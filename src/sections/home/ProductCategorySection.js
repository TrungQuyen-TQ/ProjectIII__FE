import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, IconButton, Stack, CircularProgress } from '@mui/material';
import Slider from 'react-slick';
import ProductCard from '../../components/ProductCard';

// --- ICONS ---
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

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

import { dataProducts as MOCK_PRODUCTS } from '../../data/dataProducts';
import { dataCategories as STATIC_CATEGORIES } from '../../data/dataCategories';
import QuickViewDialog from '../../components/QuickViewDialog';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';

const BANNER_MAP = {
  'qua-luu-niem': '/banner/bannerluuniem.avif',
  'thiep-chuc-mung': '/banner/bannerthiepchucmung.avif',
  'bup-be': '/banner/bannerbupbe.avif',
  'cap-tai-lieu': '/banner/bannercaptailieu.avif',
  'tui-xach': '/banner/bannertuixach.avif',
  'my-pham': '/banner/bannerdolamdep.avif'
};

const getBannerUrl = (cat) => {
  if (cat.bannerUrl) {
    return cat.bannerUrl.startsWith('/') ? cat.bannerUrl : `/${cat.bannerUrl}`;
  }
  const slug = cat.slug || cat.id;
  const banner = BANNER_MAP[slug];
  if (banner) return banner;
  
  const title = (cat.title || cat.name || '').toLowerCase();
  if (title.includes('lưu niệm') || title.includes('quà tặng')) return BANNER_MAP['qua-luu-niem'];
  if (title.includes('thiệp')) return BANNER_MAP['thiep-chuc-mung'];
  if (title.includes('búp bê')) return BANNER_MAP['bup-be'];
  if (title.includes('tài liệu') || title.includes('cặp') || title.includes('văn phòng')) return BANNER_MAP['cap-tai-lieu'];
  if (title.includes('túi') || title.includes('balo')) return BANNER_MAP['tui-xach'];
  if (title.includes('mỹ phẩm') || title.includes('làm đẹp') || title.includes('son')) return BANNER_MAP['my-pham'];
  return null;
};

export default function ProductCategorySection() {
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [productsByCategory, setProductsByCategory] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isUuid = (str) => {
      return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
    };

    const toSlug = (str) => {
      if (!str) return '';
      return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd')
        .replace(/([^0-9a-z-\s])/g, '')
        .replace(/(\s+)/g, '-')
        .replace(/-+/g, '-')
        .trim();
    };

    const loadCategoriesAndProducts = async () => {
      setLoading(true);
      try {
        // Fetch categories from API
        let catData = await categoryService.getCategories();
        if (catData && catData.length > 0) {
          // Chỉ lấy danh mục chính (không có parentId hoặc parent_id)
          catData = catData.filter(cat => !cat.parentId && !cat.parent_id);
        } else {
          catData = STATIC_CATEGORIES;
        }

        // Fetch products for each category
        const tempProducts = {};
        for (const cat of catData) {
          const catSlug = cat.slug || toSlug(cat.name || cat.title);
          if (isUuid(cat.id)) {
            const apiProds = await productService.getProducts({ categoryId: cat.id });
            if (apiProds && apiProds.length > 0) {
              tempProducts[cat.id] = apiProds;
            } else {
              const mockFiltered = MOCK_PRODUCTS.filter(
                p => String(p.category) === String(cat.id) || 
                     String(p.category) === catSlug ||
                     (catSlug === 'balo' && String(p.category) === 'tui-xach')
              );
              tempProducts[cat.id] = mockFiltered;
            }
          } else {
            // Không phải UUID -> Lọc từ mock data
            const mockFiltered = MOCK_PRODUCTS.filter(
              p => String(p.category) === String(cat.id) || 
                   String(p.category) === catSlug ||
                   (catSlug === 'balo' && String(p.category) === 'tui-xach')
            );
            tempProducts[cat.id] = mockFiltered;
          }
        }

        setCategories(catData);
        setProductsByCategory(tempProducts);
      } catch (error) {
        console.error("Error loading categories or products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCategoriesAndProducts();
  }, []);

  const handleOpenQuickView = (product) => {
    setQuickViewProduct(product);
  };
  const handleCloseQuickView = () => setQuickViewProduct(null);

  const sliderSettings = {
    dots: false, infinite: false, speed: 500, slidesToShow: 4, slidesToScroll: 2,
    prevArrow: <ProductPrevArrow />, nextArrow: <ProductNextArrow />,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 4 } },
      { breakpoint: 900, settings: { slidesToShow: 3 } },
      { breakpoint: 600, settings: { slidesToShow: 2, arrows: false } },
    ]
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8, bgcolor: '#e5f2fb' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    // Đã giảm py (padding dọc) từ { xs: 4, md: 8 } xuống { xs: 3, md: 5 } để bớt thừa màu Aqua
    <Box sx={{ bgcolor: '#e5f2fb', py: { xs: 3, md: 5 } }}>
      <Container maxWidth="xl">

        {categories.map((cat, index) => {
          const categoryProducts = productsByCategory[cat.id] || [];
          if (categoryProducts.length === 0) return null; // Ẩn category nếu không có sản phẩm nào

          return (
            <Box
              key={index}
              sx={{
                bgcolor: 'white',
                borderRadius: '24px',
                p: { xs: 2, md: 3 },  // Giảm bớt khoảng trống bên trong khối trắng
                mb: 4,                // Giảm bớt khoảng cách giữa các khối
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
              }}
            >

              {/* 1. BANNER RIÊNG CHO TỪNG DANH MỤC */}
              {(() => {
                const bannerUrl = getBannerUrl(cat);
                return bannerUrl ? (
                  <Box sx={{ mb: 4, borderRadius: '16px', overflow: 'hidden' }}>
                    <Box
                      component="img"
                      src={bannerUrl}
                      alt={cat.title || cat.name}
                      sx={{
                        width: '100%',
                        height: 'auto', // Tự động lấy chiều cao theo tỷ lệ gốc của ảnh
                        display: 'block'
                      }}
                    />
                  </Box>
                ) : null;
              })()}

              {/* 2. HEADER DANH MỤC */}
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, mb: 3, gap: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#17479d', textTransform: 'uppercase' }}>
                  {cat.title || cat.name}
                </Typography>
                {cat.subTabs && cat.subTabs.length > 0 && (
                  <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', maxWidth: '100%', pb: { xs: 1, md: 0 } }}>
                    {cat.subTabs.map((tab, idx) => (
                      <Button
                        key={idx} variant="outlined" size="small"
                        sx={{
                          borderRadius: '50px', whiteSpace: 'nowrap', fontWeight: 600, textTransform: 'none',
                          color: idx === cat.subTabs.length - 1 ? '#ff910d' : '#17479d',
                          borderColor: idx === cat.subTabs.length - 1 ? '#ff910d' : '#e0e0e0',
                          '&:hover': { borderColor: '#17479d', bgcolor: 'rgba(23,71,157,0.05)' }
                        }}
                      >
                        {tab}
                      </Button>
                    ))}
                  </Stack>
                )}
              </Box>

              {/* 3. LƯỚI SẢN PHẨM TRƯỢT NGANG */}
              <Box sx={{ mx: { xs: -1, md: -1.5 } }}>
                <Slider {...sliderSettings}>
                  {categoryProducts.map((product) => (
                    <Box key={product.id} sx={{ px: { xs: 1, md: 1.5 }, pb: 2, pt: 1 }}>
                      <ProductCard
                        product={product}
                        onQuickView={handleOpenQuickView}
                      />
                    </Box>
                  ))}
                </Slider>
              </Box>
            </Box>
          );
        })}

        {/* POPUP (MODAL) XEM NHANH SẢN PHẨM */}
        <QuickViewDialog
          open={Boolean(quickViewProduct)}
          onClose={handleCloseQuickView}
          product={quickViewProduct}
        />
      </Container>
    </Box>
  );
}