import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import Slider from 'react-slick';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ProductCard from '../../components/ProductCard';

// --- MŨI TÊN SLIDER ---
const ProductPrevArrow = ({ onClick }) => (
  <IconButton 
    onClick={onClick} 
    sx={{ 
      position: 'absolute', top: '50%', left: -20, transform: 'translateY(-50%)', zIndex: 2, 
      bgcolor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.2)', width: 40, height: 40, 
      '&:hover': { bgcolor: '#f5f5f5' }, display: { xs: 'none', md: 'flex' } 
    }}
  >
    <ArrowBackIosNewIcon sx={{ fontSize: 18, color: '#1890ff' }} />
  </IconButton>
);

const ProductNextArrow = ({ onClick }) => (
  <IconButton 
    onClick={onClick} 
    sx={{ 
      position: 'absolute', top: '50%', right: -20, transform: 'translateY(-50%)', zIndex: 2, 
      bgcolor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.2)', width: 40, height: 40, 
      '&:hover': { bgcolor: '#f5f5f5' }, display: { xs: 'none', md: 'flex' } 
    }}
  >
    <ArrowForwardIosIcon sx={{ fontSize: 18, color: '#1890ff' }} />
  </IconButton>
);

export default function ProductRelated({ relatedProducts = [], onQuickView }) {
  if (relatedProducts.length === 0) return null;

  const sliderSettings = {
    dots: false, 
    infinite: false, 
    speed: 500, 
    slidesToShow: 4, 
    slidesToScroll: 2,
    prevArrow: <ProductPrevArrow />, 
    nextArrow: <ProductNextArrow />,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 4 } },
      { breakpoint: 900, settings: { slidesToShow: 3 } },
      { breakpoint: 600, settings: { slidesToShow: 2, arrows: false } }, 
    ]
  };

  return (
    <Box sx={{ mt: 5, bgcolor: 'white', borderRadius: '24px', p: { xs: 2, md: 3 }, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
      <Typography variant="h5" sx={{ fontWeight: 800, color: '#333', mb: 3 }}>
        Sản phẩm cùng loại
      </Typography>
      
      <Box sx={{ mx: { xs: -1, md: -1.5 }, position: 'relative' }}> 
        <Slider {...sliderSettings}>
          {relatedProducts.map((p) => (
            <Box key={p.id} sx={{ px: { xs: 1, md: 1.5 }, pb: 2, pt: 1 }}>
              <ProductCard 
                product={p} 
                onQuickView={onQuickView} 
              />
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
}
