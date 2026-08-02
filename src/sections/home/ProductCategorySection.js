// src/sections/home/ProductCategorySection.js
import React, { useState } from 'react';
import { 
  Box, Container, Typography, Button, Card, CardMedia, 
  CardContent, CardActions, IconButton, Rating, Chip, Stack
} from '@mui/material';
import Slider from 'react-slick';

// --- ICONS ---
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

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
                    <Card sx={{ 
                      height: '100%', display: 'flex', flexDirection: 'column',
                      transition: 'all 0.3s ease', 
                      // Đã đổi thành viền xanh nhạt, bóng đổ nhẹ để tạo khối
                      border: '1px solid #bce2ff', 
                      boxShadow: '0 2px 10px rgba(23, 71, 157, 0.04)', 
                      borderRadius: '12px',
                      '&:hover': { 
                        // Khi hover viền xanh đậm hơn và bóng đổ nổi bật hơn
                        boxShadow: '0 8px 24px rgba(23, 71, 157, 0.15)', 
                        borderColor: '#17479d' 
                      } 
                    }}>
                      
                      <Box sx={{ position: 'relative', pt: '100%' }}>
                        <CardMedia component="img" image={product.image} alt={product.name} sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                      </Box>

                      <CardContent sx={{ flexGrow: 1, p: 2, pb: 1, display: 'flex', flexDirection: 'column' }}>
                        <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
                          {product.isNew && (
                            <Chip icon={<LocalFireDepartmentIcon sx={{ fontSize: '14px !important', color: '#e53935' }}/>} label="New" size="small" sx={{ bgcolor: 'rgba(229, 57, 53, 0.1)', color: '#e53935', fontWeight: 800, fontSize: '0.65rem', height: 22, borderRadius: '4px' }} />
                          )}
                          <Chip icon={<TaskAltIcon sx={{ fontSize: '14px !important', color: '#1976d2' }}/>} label={`Đã bán ${product.sold}`} size="small" sx={{ bgcolor: 'rgba(25, 118, 210, 0.1)', color: '#1976d2', fontWeight: 700, fontSize: '0.65rem', height: 22, borderRadius: '4px' }} />
                        </Stack>

                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#2c3e50', mb: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: 40, lineHeight: 1.4 }}>
                          {product.name}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'center' }}>
                          <Rating value={product.rating} precision={0.5} readOnly size="small" sx={{ color: '#ffc107', fontSize: '1rem' }} />
                          <Typography variant="caption" sx={{ color: '#9e9e9e', ml: 0.5 }}>({product.reviews})</Typography>
                        </Box>

                        <Box sx={{ textAlign: 'center', mt: 'auto' }}>
                          <Typography variant="h6" sx={{ color: '#17479d', fontWeight: 800, fontSize: '1.2rem', lineHeight: 1 }}>
                            {product.price}
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            <Typography variant="caption" sx={{ color: '#9e9e9e', textDecoration: 'line-through' }}>{product.originalPrice}</Typography>
                            <Typography variant="caption" sx={{ color: '#e53935', fontWeight: 700 }}>{product.discount}</Typography>
                          </Box>
                        </Box>
                      </CardContent>

                      <CardActions sx={{ p: 2, pt: 0 }}>
                        <Button 
                          fullWidth variant="outlined" 
                          startIcon={<VisibilityOutlinedIcon />} 
                          onClick={() => handleOpenQuickView(product)}
                          sx={{ color: '#17479d', borderColor: '#17479d', borderRadius: '50px', fontWeight: 700, '&:hover': { bgcolor: '#17479d', color: 'white' } }}
                        >
                          XEM NHANH
                        </Button>
                      </CardActions>
                    </Card>
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