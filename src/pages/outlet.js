// src/pages/khuyen-mai.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Chip,
  CircularProgress
} from '@mui/material';

import MainLayout from '../layouts/MainLayout';
import OutletProductCard from '../components/OutletProductCard';
import QuickViewDialog from '../components/QuickViewDialog';
import Slider from 'react-slick';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { IconButton } from '@mui/material';

import {
  getOutletCategorySections
} from '../utils/outletHelpers';

// IMPORT SERVICE MỚI
import productService from '../services/productService';
import categoryService from '../services/categoryService';

// Dữ liệu mẫu (Backup)
import { dataProducts as productsData } from '../data/dataProducts';
import { dataCategories as categoriesData } from '../data/dataCategories';

// --- MŨI TÊN SLIDER ---
const ProductPrevArrow = ({ onClick }) => (
  <IconButton onClick={onClick} sx={{ position: 'absolute', top: '40%', left: -20, transform: 'translateY(-50%)', zIndex: 2, bgcolor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.2)', width: 40, height: 40, '&:hover': { bgcolor: '#f5f5f5' }, display: { xs: 'none', md: 'flex' } }}>
    <ArrowBackIosNewIcon sx={{ fontSize: 18, color: '#17479d' }} />
  </IconButton>
);

const ProductNextArrow = ({ onClick }) => (
  <IconButton onClick={onClick} sx={{ position: 'absolute', top: '40%', right: -20, transform: 'translateY(-50%)', zIndex: 2, bgcolor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.2)', width: 40, height: 40, '&:hover': { bgcolor: '#f5f5f5' }, display: { xs: 'none', md: 'flex' } }}>
    <ArrowForwardIosIcon sx={{ fontSize: 18, color: '#17479d' }} />
  </IconButton>
);

const sliderSettings = {
  dots: false, infinite: false, speed: 500, slidesToShow: 4, slidesToScroll: 2,
  prevArrow: <ProductPrevArrow />, nextArrow: <ProductNextArrow />,
  responsive: [
    { breakpoint: 1200, settings: { slidesToShow: 4 } },
    { breakpoint: 900, settings: { slidesToShow: 3 } },
    { breakpoint: 600, settings: { slidesToShow: 2, arrows: false } },
  ]
};

// ================= COMPONENT: GIAN HÀNG & NÚT XEM THÊM =================
function CategorySectionBlock({ section, onQuickView, onResetTab }) {
  return (
    <Box
      sx={{
        bgcolor: 'rgba(255, 255, 255, 0.97)',
        backdropFilter: 'blur(10px)',
        borderRadius: 4,
        p: { xs: 2, md: 3 },
        mb: 4,
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)'
      }}
    >
      {section.bannerImage && (
        <Box sx={{ width: '100%', borderRadius: 3, overflow: 'hidden', mb: 3, border: '1px solid #eef2f6' }}>
          <Box component="img" src={section.bannerImage} alt={section.name} sx={{ width: '100%', display: 'block' }} />
        </Box>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5, mb: 2.5, pb: 2, borderBottom: '2px solid #f0f3f8' }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#003366', m: 0 }}>{section.bannerTitle}</Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {['Sinh nhật', 'Lễ Tết', 'Tình yêu'].map((item) => (
            <Chip key={item} label={item} size="small" variant="outlined" sx={{ fontWeight: 500, borderColor: '#dcdfe6', color: '#555', bgcolor: '#fff' }} />
          ))}
          <Chip label="Xem tất cả" size="small" onClick={onResetTab} sx={{ fontWeight: 600, bgcolor: '#fffaf0', color: '#ff9900', borderColor: '#ff9900', border: '1px solid #ff9900' }} />
        </Stack>
      </Box>

      {/* LƯỚI SẢN PHẨM TRƯỢT NGANG */}
      <Box sx={{ mx: { xs: -1, md: -1.5 }, position: 'relative' }}>
        <Slider {...sliderSettings}>
          {section.products.map((product) => (
            <Box key={product.id} sx={{ px: { xs: 1, md: 1.5 }, pb: 2, pt: 1, height: '100%' }}>
              <OutletProductCard product={product} onQuickView={onQuickView} />
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
}

// ================= TRANG CHÍNH =================
export default function OutletPage() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('ALL');

  const [categories, setCategories] = useState([]);
  const [outletSections, setOutletSections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // SỬ DỤNG SERVICE ĐỂ GỌI API
  useEffect(() => {
    const isUuid = (str) => {
      return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
    };

    const fetchData = async () => {
      try {
        setIsLoading(true);

        // 1. Tải danh mục từ API
        const categoryList = await categoryService.getCategories();
        let catData = [];
        if (categoryList && categoryList.length > 0) {
          catData = categoryList;
        } else {
          catData = categoriesData;
        }
        setCategories(catData);

        // Lấy danh mục cha (parentId = null)
        const rootCats = catData.filter(c => !c.parentId && !c.parent_id);

        // 2. Tải sản phẩm cho từng danh mục cha từ API qua categoryId
        const allFetchedProducts = [];

        for (const cat of rootCats) {
          // Tìm các danh mục con
          const childCategories = catData.filter(
            c => c.parentId === cat.id || c.parent_id === cat.id
          );
          const categoryIds = [cat.id, ...childCategories.map(c => c.id)];

          let apiProductsMerged = [];
          for (const id of categoryIds) {
            if (isUuid(id)) {
              // Gọi API lấy sản phẩm theo CategoryId
              const apiProds = await productService.getProducts({ categoryId: id });
              if (apiProds && apiProds.length > 0) {
                // Đảm bảo gán categoryId cho sản phẩm nếu chưa có
                const mapped = apiProds.map(p => ({ ...p, categoryId: id }));
                apiProductsMerged = [...apiProductsMerged, ...mapped];
              }
            }
          }

          // Loại bỏ sản phẩm trùng lặp
          const uniqueProducts = [];
          const seenIds = new Set();
          for (const p of apiProductsMerged) {
            const pId = p.id || p.Id;
            if (!seenIds.has(pId)) {
              seenIds.add(pId);
              uniqueProducts.push(p);
            }
          }

          if (uniqueProducts.length > 0) {
            allFetchedProducts.push(...uniqueProducts);
          }
        }

        // Nếu không lấy được sản phẩm nào từ API, dùng dữ liệu mẫu làm backup
        let finalProducts = allFetchedProducts;
        if (finalProducts.length === 0) {
          finalProducts = productsData;
        }

        // 3. Gọi helper để xử lý lọc sản phẩm giảm giá trên 25% và gom nhóm thành các Section
        const sections = getOutletCategorySections(finalProducts, catData);
        setOutletSections(sections);

      } catch (error) {
        console.error("Lỗi khi kết nối Database lấy sản phẩm/danh mục:", error);
        // Fallback dùng dữ liệu mẫu
        const sections = getOutletCategorySections(productsData, categoriesData);
        setOutletSections(sections);
        setCategories(categoriesData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const displayedSections = activeTab === 'ALL' ? outletSections : outletSections.filter((sec) => sec.id === activeTab);

  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  return (
    <MainLayout title="Outlet - Xả Kho Giá Hời | Thiên Long">
      {/* NỀN ẢNH PHÁO HOA CỐ ĐỊNH PARALLAX */}
      <Box
        sx={{
          backgroundColor: '#0f172a',
          backgroundImage: `
            linear-gradient(to bottom, rgba(15, 23, 42, 0) 0%, rgba(15, 23, 42, 0.6) 50%, rgba(15, 23, 42, 1) 100%),
            url(/banner/bg-fireworks.jpg)
          `,
          backgroundSize: '100% auto',
          backgroundPosition: 'top center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
          pb: 8
        }}
      >

        {/* === HERO BANNER FULL ẢNH === */}
        <Box sx={{ width: '100%', position: 'relative', overflow: 'hidden', bgcolor: '#1b2a4e', display: 'flex', justifyContent: 'center' }}>
          <Box
            component="img"
            src="/banner/bannermain.jpg"
            alt="ARTS Outlet Xả Kho Giá Hời"
            sx={{
              width: '100%',
              maxWidth: '1440px',
              height: 'auto',
              display: 'block',
            }}
          />
        </Box>

        {/* === BANNER CAM KẾT OUTLET === */}
        <Container maxWidth="md" sx={{ mt: { xs: -2, md: -4 }, mb: 4, position: 'relative', zIndex: 10 }}>
          <Box sx={{ background: 'linear-gradient(180deg, #2b417e 0%, #16244f 100%)', border: '3px solid #ffda6a', borderRadius: 5, py: 2, px: 3, textAlign: 'center', boxShadow: '0 8px 20px rgba(22, 36, 79, 0.4), inset 0 0 15px rgba(255, 255, 255, 0.15)' }}>
            <Typography variant="h6" sx={{ fontWeight: 900, color: '#fff000', textTransform: 'uppercase', fontFamily: "'Arial Black', sans-serif", textShadow: '0 2px 6px rgba(0, 0, 0, 0.4)', fontSize: { xs: '16px', md: '20px' } }}>
              CHÍNH HÃNG GIÁ OUTLET — ⚡ CHỐT DEAL NGAY KHÔNG CẦN NGHĨ! ⚡
            </Typography>
          </Box>
        </Container>



        {/* === CÁC GIAN HÀNG === */}
        <Container maxWidth="lg">
          {/* MÀN HÌNH LOADING */}
          {isLoading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10 }}>
              <CircularProgress sx={{ color: '#ffda6a', mb: 2 }} />
              <Typography sx={{ color: '#fff', fontWeight: 600 }}>Đang tải sản phẩm siêu sale...</Typography>
            </Box>
          ) : (
            <>
              {displayedSections.map((section) => (
                <CategorySectionBlock key={section.id} section={section} onQuickView={handleQuickView} onResetTab={() => setActiveTab('ALL')} />
              ))}

              {/* NẾU RỖNG SẢN PHẨM */}
              {displayedSections.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 8, bgcolor: 'rgba(255,255,255,0.95)', borderRadius: 4, color: '#666', boxShadow: '0 10px 30px rgba(0,0,0,0.25)' }}>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>Chưa có sản phẩm giảm giá nào trong gian hàng này!</Typography>
                </Box>
              )}
            </>
          )}
        </Container>

        {/* === MODAL XEM NHANH === */}
        {isQuickViewOpen && selectedProduct && (
          <QuickViewDialog product={selectedProduct} open={isQuickViewOpen} onClose={() => setIsQuickViewOpen(false)} />
        )}
      </Box>
    </MainLayout>
  );
}