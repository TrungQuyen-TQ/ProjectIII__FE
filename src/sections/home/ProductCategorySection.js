import React, { useState } from 'react';
import { Box, Container, Typography, Button, IconButton, Stack } from '@mui/material';
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

import { dataProducts as products } from '../../data/dataProducts';
import { dataCategories as categories } from '../../data/dataCategories';
import QuickViewDialog from '../../components/QuickViewDialog';


export default function ProductCategorySection() {
  const [quickViewProduct, setQuickViewProduct] = useState(null);

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

  return (
    // Đã giảm py (padding dọc) từ { xs: 4, md: 8 } xuống { xs: 3, md: 5 } để bớt thừa màu Aqua
    <Box sx={{ bgcolor: '#e5f2fb', py: { xs: 3, md: 5 } }}>
      <Container maxWidth="xl">

        {categories.map((cat, index) => (
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
            {cat.bannerUrl && (
              <Box sx={{ mb: 4, borderRadius: '16px', overflow: 'hidden' }}>
                <Box
                  component="img"
                  src={cat.bannerUrl}
                  alt={cat.title}
                  sx={{
                    width: '100%',
                    height: 'auto', // Tự động lấy chiều cao theo tỷ lệ gốc của ảnh
                    display: 'block'
                  }}
                />
              </Box>
            )}

            {/* 2. HEADER DANH MỤC */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, mb: 3, gap: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#17479d', textTransform: 'uppercase' }}>
                {cat.title}
              </Typography>
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
            </Box>

            {/* 3. LƯỚI SẢN PHẨM TRƯỢT NGANG */}
            <Box sx={{ mx: { xs: -1, md: -1.5 } }}>
              <Slider {...sliderSettings}>
                {products.map((product) => (
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
        ))}

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