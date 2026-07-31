// src/sections/home/ProductCategorySection.js
import React, { useState } from 'react';
import { 
  Box, Container, Typography, Button, Card, CardMedia, 
  CardContent, CardActions, IconButton, Rating, Chip, Stack,
  Dialog, DialogContent, Grid, Divider
} from '@mui/material';
import Slider from 'react-slick';

// --- ICONS ---
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
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

// --- DỮ LIỆU SẢN PHẨM MẪU ---
const products = [
  { 
    id: 1, 
    name: 'Sản phẩm nổi bật - Mẫu 1', 
    price: '9,600đ', originalPrice: '12,000đ', discount: '- 20%', 
    image: 'https://images.unsplash.com/photo-1583485088034-697b5a624f47?w=500&q=80', 
    thumbnails: [
      'https://images.unsplash.com/photo-1583485088034-697b5a624f47?w=150&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&q=80'
    ],
    rating: 5, reviews: 10, sold: '143', isNew: true,
    brand: 'ArtStore', sku: 'ART-001', variants: ['Mặc định']
  },
  { 
    id: 2, 
    name: 'Sản phẩm cao cấp - Mẫu 2', 
    price: '9,600đ', originalPrice: '12,000đ', discount: '- 20%', 
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&q=80',
    thumbnails: ['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=150&q=80'],
    rating: 5, reviews: 2, sold: '257', isNew: true,
    brand: 'ArtStore', sku: 'ART-002', variants: ['Xanh', 'Đỏ', 'Đen']
  },
  { 
    id: 3, 
    name: 'Sản phẩm phổ thông - Mẫu 3', 
    price: '8,800đ', originalPrice: '11,000đ', discount: '- 20%', 
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500&q=80', 
    thumbnails: ['https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=150&q=80'],
    rating: 4.5, reviews: 12, sold: '1194', isNew: true,
    brand: 'ArtStore', sku: 'ART-003', variants: ['Mặc định']
  },
  { 
    id: 4, 
    name: 'Sản phẩm quà tặng - Mẫu 4', 
    price: '190,000đ', originalPrice: '250,000đ', discount: '- 24%', 
    image: 'https://images.unsplash.com/photo-1512496115841-345028372225?w=500&q=80', 
    thumbnails: ['https://images.unsplash.com/photo-1512496115841-345028372225?w=150&q=80'],
    rating: 4, reviews: 5, sold: '3.4k', isNew: false,
    brand: 'ArtStore', sku: 'ART-004', variants: ['Size M', 'Size L']
  },
  { 
    id: 5, 
    name: 'Sản phẩm mới - Mẫu 5', 
    price: '120,000đ', originalPrice: '150,000đ', discount: '- 20%', 
    image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=500&q=80', 
    thumbnails: ['https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=150&q=80'],
    rating: 5, reviews: 45, sold: '850', isNew: false,
    brand: 'ArtStore', sku: 'ART-005', variants: ['Mặc định']
  }
];

// --- DỮ LIỆU ĐỦ 6 DANH MỤC ---
// --- DỮ LIỆU ĐỦ 6 DANH MỤC VỚI ẢNH BANNER MỚI TỪ THƯ MỤC PUBLIC ---
const categories = [
  { 
    title: '🎁 QUÀ LƯU NIỆM', 
    id: 'qua-luu-niem', 
    bannerUrl: 'banner/bannerluuniem.png', // Thay đổi đường dẫn ảnh
    subTabs: ['Đồ Handmade', 'Móc khóa', 'Gấu bông', 'Xem tất cả'] 
  },
  { 
    title: '💌 THIỆP CHÚC MỪNG', 
    id: 'thiep-chuc-mung', 
    bannerUrl: 'banner/bannerthiepchucmung.png', // Thay đổi đường dẫn ảnh
    subTabs: ['Sinh nhật', 'Lễ Tết', 'Tình yêu', 'Xem tất cả'] 
  },
  { 
    title: '🎎 BÚP BÊ', 
    id: 'bup-be', 
    bannerUrl: 'banner/bannerbupbe.png', // Thay đổi đường dẫn ảnh
    subTabs: ['Barbie', 'Búp bê len', 'Phụ kiện', 'Xem tất cả'] 
  },
  { 
    title: '📁 CẶP TÀI LIỆU', 
    id: 'cap-tai-lieu', 
    bannerUrl: 'banner/bannercaptailieu.png', // Thay đổi đường dẫn ảnh
    subTabs: ['Bìa còng', 'Cặp da', 'Túi clear bag', 'Xem tất cả'] 
  },
  { 
    title: '👜 TÚI XÁCH', 
    id: 'tui-xach', 
    bannerUrl: 'banner/bannertuixach.png', // Thay đổi đường dẫn ảnh
    subTabs: ['Túi Tote', 'Túi chéo', 'Balo', 'Xem tất cả'] 
  },
  { 
    title: '💄 MỸ PHẨM', 
    id: 'my-pham', 
    bannerUrl: 'banner/bannerdolamdep.png', // Thay đổi đường dẫn ảnh
    subTabs: ['Son môi', 'Dưỡng da', 'Trang điểm', 'Xem tất cả'] 
  }
];

export default function ProductCategorySection() {
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [qty, setQty] = useState(1);

  const handleOpenQuickView = (product) => {
    setQuickViewProduct(product);
    setQty(1); 
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

        {/* =========================================================================
            POPUP (MODAL) XEM NHANH SẢN PHẨM (BẢN HOÀN HẢO 100% - KHÔNG THANH CUỘN)
            ========================================================================= */}
        <Dialog 
          open={Boolean(quickViewProduct)} 
          onClose={handleCloseQuickView}
          maxWidth="md" fullWidth
          PaperProps={{ 
            sx: { 
              borderRadius: '16px', 
              m: 2,
              maxHeight: '90vh' 
              // Đã xóa overflow: 'visible' ở đây để triệt tiêu hoàn toàn thanh cuộn ngang
            } 
          }}
        >
          {quickViewProduct && (
            <>
              {/* NÚT ĐÓNG: Đưa vào nằm gọn gàng góc trên bên TRONG viền Popup */}
              <IconButton 
                onClick={handleCloseQuickView} 
                sx={{ 
                  position: 'absolute', 
                  top: 12, 
                  right: 12, 
                  zIndex: 10, 
                  bgcolor: 'rgba(0,0,0,0.05)', 
                  width: 36, height: 36, 
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.1)' } 
                }}
              >
                <CloseIcon fontSize="small" sx={{ color: '#333' }} />
              </IconButton>

              <DialogContent sx={{ p: { xs: 3, md: 4 } }}>
                {/* Dùng Grid chuẩn của MUI, không cần fix lề thủ công nữa */}
                <Grid container spacing={4}>
                  
                  {/* CỘT TRÁI: HÌNH ẢNH */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{ bgcolor: '#f8f9fa', borderRadius: '12px', p: 2, mb: 2, display: 'flex', justifyContent: 'center' }}>
                      <Box component="img" src={quickViewProduct.image} sx={{ width: '100%', maxHeight: 300, objectFit: 'contain' }} />
                    </Box>
                    <Stack direction="row" spacing={1.5}>
                      {quickViewProduct.thumbnails.map((thumb, idx) => (
                        <Box key={idx} sx={{ width: 60, height: 60, borderRadius: '8px', border: idx === 0 ? '2px solid #17479d' : '1px solid #e0e0e0', overflow: 'hidden', cursor: 'pointer' }}>
                          <Box component="img" src={thumb} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </Box>
                      ))}
                    </Stack>
                  </Grid>

                  {/* CỘT PHẢI: THÔNG TIN CHI TIẾT */}
                  <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column' }}>
                    
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a1a1a', mb: 1, pr: 2, lineHeight: 1.3 }}>
                      {quickViewProduct.name}
                    </Typography>
                    
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>
                      Thương hiệu: <span style={{ color: '#17479d', fontWeight: 600 }}>{quickViewProduct.brand}</span> | Mã sản phẩm: {quickViewProduct.sku}
                    </Typography>

                    <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: '8px', display: 'flex', alignItems: 'center', mb: 3, position: 'relative' }}>
                      <Typography variant="h4" sx={{ color: '#17479d', fontWeight: 800, mr: 1.5 }}>
                        {quickViewProduct.price}
                      </Typography>
                      <Typography variant="subtitle1" sx={{ color: '#9e9e9e', textDecoration: 'line-through' }}>
                        {quickViewProduct.originalPrice}
                      </Typography>
                      
                      <Box sx={{ position: 'absolute', right: 16, bgcolor: '#e53935', color: 'white', px: 1.5, py: 0.5, borderRadius: '8px', textAlign: 'center', lineHeight: 1.1 }}>
                        <Typography variant="caption" sx={{ display: 'block', fontWeight: 600, fontSize: '0.65rem' }}>Tiết kiệm</Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.9rem' }}>{quickViewProduct.discount.replace('- ', '')}</Typography>
                      </Box>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, mb: 1.5 }}>Phân loại:</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {quickViewProduct.variants.map((variant, idx) => (
                          <Button key={idx} variant={idx === 0 ? "outlined" : "text"} size="small" sx={{ border: idx === 0 ? '1px solid #17479d' : '1px solid #e0e0e0', color: idx === 0 ? '#17479d' : '#666', borderRadius: '6px', px: 2, py: 0.5, minWidth: 0, textTransform: 'none', fontWeight: 600 }}>
                            {variant}
                          </Button>
                        ))}
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                      <Box sx={{ display: 'flex', border: '1px solid #e0e0e0', borderRadius: '6px', overflow: 'hidden' }}>
                        <IconButton onClick={() => setQty(Math.max(1, qty - 1))} size="small" sx={{ borderRadius: 0, px: 2, py: 1 }}><RemoveIcon fontSize="small" /></IconButton>
                        <Box sx={{ display: 'flex', alignItems: 'center', px: 3, borderLeft: '1px solid #e0e0e0', borderRight: '1px solid #e0e0e0', fontWeight: 700, fontSize: '1rem' }}>{qty}</Box>
                        <IconButton onClick={() => setQty(qty + 1)} size="small" sx={{ borderRadius: 0, px: 2, py: 1 }}><AddIcon fontSize="small" /></IconButton>
                      </Box>
                    </Box>

                    {/* Nút Action */}
                    <Grid container spacing={2} sx={{ mb: 2, mt: 'auto' }}>
                      <Grid item xs={6}>
                        <Button fullWidth variant="outlined" sx={{ py: 1.2, borderColor: '#17479d', color: '#17479d', fontWeight: 700, borderRadius: '8px', textTransform: 'none', fontSize: '1rem' }}>
                          THÊM VÀO GIỎ
                        </Button>
                      </Grid>
                      <Grid item xs={6}>
                        <Button fullWidth variant="contained" sx={{ py: 1.2, bgcolor: '#2659f3', color: 'white', fontWeight: 700, borderRadius: '8px', textTransform: 'none', boxShadow: 'none', fontSize: '1rem', '&:hover': { bgcolor: '#17479d' } }}>
                          MUA NGAY
                        </Button>
                      </Grid>
                    </Grid>

                    <Typography variant="body2" sx={{ color: '#e53935', fontWeight: 700, cursor: 'pointer', mt: 1 }}>
                      &gt;&gt; Xem chi tiết sản phẩm
                    </Typography>

                  </Grid>
                </Grid>
              </DialogContent>
            </>
          )}
        </Dialog>
      </Container>
    </Box>
  );
}