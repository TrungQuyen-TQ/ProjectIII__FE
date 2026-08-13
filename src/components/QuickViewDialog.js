import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, IconButton, Box, Stack, Typography, Button
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { getProductImageUrl } from '../utils/imageHelper';

export default function QuickViewDialog({ open, onClose, product }) {
  const [qty, setQty] = useState(1);
  const dispatch = useDispatch();
  const router = useRouter();

  // Khôi phục số lượng về 1 mỗi khi mở lại dialog
  useEffect(() => {
    if (open) {
      setQty(1);
    }
  }, [open, product]);

  if (!product) return null;

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity: qty }));
    toast.success('Đã thêm sản phẩm vào giỏ hàng!');
    if (onClose) onClose();
  };

  const handleBuyNow = () => {
    dispatch(addToCart({ product, quantity: qty }));
    if (onClose) onClose();
    router.push('/cart');
  };

  const displayImage = getProductImageUrl(product.image || product.thumbnail);
  const displayPrice = typeof product.price === 'number' 
    ? `${product.price.toLocaleString('vi-VN')}đ` 
    : product.price;

  const displayOriginalPrice = typeof product.originalPrice === 'number'
    ? `${product.originalPrice.toLocaleString('vi-VN')}đ`
    : product.originalPrice;

  let discountTag = product.discount;
  if (!discountTag && typeof product.price === 'number' && typeof product.originalPrice === 'number' && product.originalPrice > product.price) {
    const pct = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    if (pct > 0) {
      discountTag = `-${pct}%`;
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '8px',
          m: { xs: 1.5, sm: 2 }, // Giảm margin trên mobile để popup to hơn
          maxHeight: '90vh'
        }
      }}
    >
      {/* NÚT ĐÓNG */}
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          top: { xs: 8, sm: 12 },
          right: { xs: 8, sm: 12 },
          zIndex: 10,
          bgcolor: 'rgba(255, 255, 255, 0.8)', // Chỉnh lại nền hơi trong suốt để nổi bật trên ảnh mobile
          width: 32, height: 32,
          '&:hover': { bgcolor: '#e0e0e0' }
        }}
      >
        <CloseIcon fontSize="small" sx={{ color: '#333' }} />
      </IconButton>

      <DialogContent sx={{ p: { xs: 2, sm: 4 }, overflowX: 'hidden' }}>

        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, sm: 4 } // Khoảng cách giữa ảnh và nội dung giảm xuống trên mobile
        }}>

          {/* CỘT TRÁI: HÌNH ẢNH */}
          <Box sx={{ width: { xs: '100%', sm: '50%' } }}>
            <Box sx={{ bgcolor: '#f8f9fa', borderRadius: '8px', p: 1, mb: { xs: 1, sm: 2 }, display: 'flex', justifyContent: 'center' }}>
              <Box component="img" src={displayImage} sx={{ width: '100%', maxHeight: { xs: 280, sm: 350 }, objectFit: 'contain' }} />
            </Box>

            {/* Ảnh thu nhỏ (Ẩn trên mobile cho gọn giống ảnh mẫu, chỉ hiện trên tablet/desktop) */}
            <Stack direction="row" spacing={1.5} sx={{ display: { xs: 'none', sm: 'flex' } }}>
              {product.thumbnails && product.thumbnails.map((thumb, idx) => (
                <Box key={idx} sx={{
                  width: 65, height: 65,
                  borderRadius: '4px',
                  border: idx === 0 ? '2px solid #2962ff' : '1px solid #e0e0e0',
                  overflow: 'hidden',
                  cursor: 'pointer'
                }}>
                  <Box component="img" src={getProductImageUrl(thumb)} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </Box>
              ))}
            </Stack>
          </Box>

          {/* CỘT PHẢI: THÔNG TIN CHI TIẾT */}
          <Box sx={{ width: { xs: '100%', sm: '50%' }, display: 'flex', flexDirection: 'column' }}>

            <Typography variant="h5" sx={{ fontWeight: 600, color: '#333', mb: 1, pr: { xs: 0, sm: 3 }, lineHeight: 1.4, fontSize: { xs: '1.1rem', sm: '1.5rem' } }}>
              {product.name}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: { xs: 1.5, sm: 2 }, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
              Thương hiệu: <span style={{ color: '#2962ff', fontWeight: 500 }}>{product.brand || 'Khác'}</span> | Mã sản phẩm: <span style={{ color: '#2962ff' }}>{product.sku}</span>
            </Typography>

            {/* KHU VỰC GIÁ VÀ TEM GIẢM GIÁ */}
            <Box sx={{ bgcolor: '#f5f5f5', p: { xs: 1.5, sm: 2.5 }, borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: { xs: 2, sm: 3 } }}>

              <Box sx={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', rowGap: 0.5 }}>
                <Typography sx={{ color: '#2962ff', fontWeight: 700, mr: 1.5, fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
                  {displayPrice}
                </Typography>
                {displayOriginalPrice && (
                  <Typography sx={{ color: '#333', textDecoration: 'line-through', fontWeight: 600, fontSize: { xs: '0.9rem', sm: '1.25rem' } }}>
                    {displayOriginalPrice}
                  </Typography>
                )}
              </Box>

              {/* Tem hình răng cưa */}
              {discountTag && (
                <Box sx={{
                  bgcolor: '#ff2f4c',
                  color: 'white',
                  width: { xs: 50, sm: 58 },
                  height: { xs: 50, sm: 58 },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexShrink: 0,
                  clipPath: 'polygon(50% 0%, 61% 12%, 77% 9%, 81% 25%, 96% 29%, 89% 43%, 100% 55%, 85% 66%, 87% 82%, 71% 86%, 63% 100%, 48% 92%, 35% 100%, 25% 85%, 9% 81%, 13% 65%, 0% 53%, 11% 41%, 3% 26%, 19% 23%, 23% 8%, 38% 13%)',
                  lineHeight: 1.1
                }}>
                  <Typography variant="caption" sx={{ display: 'block', fontWeight: 700, fontSize: { xs: '0.45rem', sm: '0.55rem' }, mt: 0.5 }}>
                    Tiết kiệm
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 900, fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>
                    {discountTag.replace('-', '').trim()}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* CHỌN SỐ LƯỢNG */}
            <Box sx={{ mb: { xs: 2, sm: 3 } }}>
              <Box sx={{ display: 'inline-flex', border: '1px solid #e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                <IconButton onClick={() => setQty(Math.max(1, qty - 1))} size="small" sx={{ borderRadius: 0, px: 1.5, py: 0.5, color: '#666' }}>
                  <RemoveIcon fontSize="small" />
                </IconButton>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, borderLeft: '1px solid #e0e0e0', borderRight: '1px solid #e0e0e0', color: '#2962ff', fontWeight: 600, fontSize: '0.9rem' }}>
                  {qty}
                </Box>
                <IconButton onClick={() => setQty(qty + 1)} size="small" sx={{ borderRadius: 0, px: 1.5, py: 0.5, color: '#666' }}>
                  <AddIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>

            {/* NÚT THÊM VÀO GIỎ & MUA NGAY */}
            {/* Sử dụng flexDirection column cho mobile và row cho desktop */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 1.5, sm: 2 }, mb: 2, mt: 'auto' }}>
              <Button 
                fullWidth 
                variant="outlined" 
                onClick={handleAddToCart}
                sx={{ py: 1.2, borderColor: '#2962ff', color: '#2962ff', fontWeight: 600, borderRadius: '4px', textTransform: 'none', fontSize: '0.95rem', '&:hover': { bgcolor: '#f0f4ff' } }}
              >
                THÊM VÀO GIỎ
              </Button>
              <Button 
                fullWidth 
                variant="contained" 
                onClick={handleBuyNow}
                sx={{ py: 1.2, bgcolor: '#2962ff', color: 'white', fontWeight: 600, borderRadius: '4px', textTransform: 'none', boxShadow: 'none', fontSize: '0.95rem', '&:hover': { bgcolor: '#1c4cc7' } }}
              >
                MUA NGAY
              </Button>
            </Box>

            <Typography variant="body2" sx={{ color: '#ff2f4c', fontWeight: 600, cursor: 'pointer', mt: { xs: 0, sm: 1 }, fontSize: { xs: '0.85rem', sm: '0.875rem' } }}>
              &gt;&gt; Xem chi tiết sản phẩm
            </Typography>

          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}