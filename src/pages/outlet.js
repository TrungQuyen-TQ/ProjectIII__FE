// src/pages/khuyen-mai.js
import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Chip
} from '@mui/material';

import MainLayout from '../layouts/MainLayout';
import OutletProductCard from '../components/OutletProductCard';
import QuickViewDialog from '../components/QuickViewDialog';
import {
  getOutletCategorySections,
  TARGET_CATEGORIES,
} from '../utils/outletHelpers';

import { dataProducts as productsData } from '../data/dataProducts';
import { dataCategories as categoriesData } from '../data/dataCategories';


// ================= COMPONENT: GIAN HÀNG & NÚT XEM THÊM =================
function CategorySectionBlock({ section, onQuickView, onResetTab }) {
  const [visibleCount, setVisibleCount] = useState(4);
  const hasMore = section.products.length > visibleCount;

  const handleLoadMore = () => setVisibleCount((prev) => prev + 4);

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

      {/* SỬ DỤNG CSS GRID ĐỂ ÉP CÁC THẺ SẢN PHẨM CÂN BẰNG HOÀN HẢO */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)', // Mobile: 1 cột
            sm: 'repeat(2, 1fr)', // Tablet: 2 cột
            md: 'repeat(3, 1fr)', // Màn hình nhỏ: 3 cột
            lg: 'repeat(4, 1fr)', // Màn hình chuẩn: ÉP ĐÚNG 4 CỘT CHIA ĐỀU 100%
          },
          gap: 2.5,
        }}
      >
        {section.products.slice(0, visibleCount).map((product) => (
          <Box key={product.id} sx={{ height: '100%' }}>
            <OutletProductCard product={product} onQuickView={onQuickView} />
          </Box>
        ))}
      </Box>

      {hasMore && (
        <Box sx={{ textAlign: 'center', mt: 3.5, pt: 1 }}>
          <Button variant="contained" onClick={handleLoadMore} sx={{ bgcolor: '#ff1a3c', color: '#ffffff', fontWeight: 700, fontSize: '14px', textTransform: 'none', px: 4, py: 1.2, borderRadius: 2, '&:hover': { bgcolor: '#e01030' } }}>
            Xem thêm ({section.products.length - visibleCount} sản phẩm)
          </Button>
        </Box>
      )}
    </Box>
  );
}

// ================= TRANG CHÍNH =================
export default function OutletPage() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('ALL');

  const outletSections = getOutletCategorySections(productsData, categoriesData);
  const displayedSections = activeTab === 'ALL' ? outletSections : outletSections.filter((sec) => sec.id === activeTab);

  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  return (
    <MainLayout title="Outlet - Xả Kho Giá Hời | Thiên Long">
      {/* NỀN ẢNH PHÁO HOA + HIỆU ỨNG MỜ DẦN VÀO MÀU XANH ĐEN */}
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
        <Box sx={{ width: '100%', position: 'relative', overflow: 'hidden', bgcolor: '#1b2a4e' }}>
          <Box
            component="img"
            src="/banner/bannermain.jpg"
            alt="ARTS Outlet Xả Kho Giá Hời"
            sx={{
              width: '100%',
              height: 'auto',
              maxHeight: { xs: '300px', sm: '400px', md: '500px', lg: '600px' },
              objectFit: 'cover',
              objectPosition: 'center',
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

        {/* === THANH LỌC DANH MỤC === */}
        <Box sx={{ bgcolor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(8px)', borderTop: '1px solid #e2e8f0', borderBottom: '2px solid #e2e8f0', mb: 4, position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <Container maxWidth="lg">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1.5, overflowX: 'auto', whiteSpace: 'nowrap', '&::-webkit-scrollbar': { display: 'none' } }}>
              <Button variant={activeTab === 'ALL' ? 'contained' : 'outlined'} onClick={() => setActiveTab('ALL')} sx={{ borderRadius: 5, textTransform: 'none', fontWeight: 600, fontSize: '14px', px: 2.2, py: 0.8, borderColor: '#e2e8f0', bgcolor: activeTab === 'ALL' ? '#1b2a4e' : '#f8fafc', color: activeTab === 'ALL' ? '#fff' : '#1e293b', '&:hover': { borderColor: '#1b2a4e', color: activeTab === 'ALL' ? '#fff' : '#1b2a4e' } }}>
                🔥 Tất cả gian hàng
              </Button>
              {TARGET_CATEGORIES.map((cat) => {
                const isActive = activeTab === cat.id;
                return (
                  <Button key={cat.id} variant={isActive ? 'contained' : 'outlined'} onClick={() => setActiveTab(cat.id)} sx={{ borderRadius: 5, textTransform: 'none', fontWeight: 600, fontSize: '14px', px: 2.2, py: 0.8, borderColor: '#e2e8f0', bgcolor: isActive ? '#1b2a4e' : '#f8fafc', color: isActive ? '#fff' : '#1e293b', '&:hover': { borderColor: '#1b2a4e', color: isActive ? '#fff' : '#1b2a4e' } }}>
                    <span style={{ marginRight: 6 }}>{cat.icon}</span> {cat.name}
                  </Button>
                );
              })}
            </Box>
          </Container>
        </Box>

        {/* === CÁC GIAN HÀNG === */}
        <Container maxWidth="lg">
          {displayedSections.map((section) => (
            <CategorySectionBlock key={section.id} section={section} onQuickView={handleQuickView} onResetTab={() => setActiveTab('ALL')} />
          ))}
          {displayedSections.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8, bgcolor: 'rgba(255,255,255,0.95)', borderRadius: 4, color: '#666', boxShadow: '0 10px 30px rgba(0,0,0,0.25)' }}>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>Không có sản phẩm giảm giá nào thuộc mục này!</Typography>
            </Box>
          )}
        </Container>

        {/* === MODAL XEM NHANH === */}
        {isQuickViewOpen && selectedProduct && (
          <QuickViewDialog product={selectedProduct} isOpen={isQuickViewOpen} onClose={() => setIsQuickViewOpen(false)} />
        )}
      </Box>
    </MainLayout>
  );
}