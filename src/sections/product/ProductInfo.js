import React from 'react';
import {
  Grid, Box, Stack, Typography, Rating, Divider, Button, IconButton
} from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import LoopIcon from '@mui/icons-material/Loop';

export default function ProductInfo({
  product,
  activeThumb,
  setActiveThumb,
  qty,
  setQty
}) {
  return (
    <Box sx={{ bgcolor: 'white', borderRadius: '12px', p: { xs: 2, md: 4 }, boxShadow: '0 2px 12px rgba(0,0,0,0.03)', mb: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 3, md: 6 } }}>

        {/* CỘT TRÁI: HÌNH ẢNH */}
        <Box sx={{ width: { xs: '100%', md: '50%' }, flexShrink: 0 }}>
          <Box sx={{ bgcolor: '#f8f9fa', borderRadius: '12px', p: 2, mb: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid #f0f0f0' }}>
            <Box component="img" src={activeThumb || product.image} sx={{ width: '100%', maxHeight: { xs: 300, md: 450 }, objectFit: 'contain' }} />
          </Box>
          <Stack direction="row" spacing={1.5} sx={{ overflowX: 'auto', pb: 1 }}>
            {product.thumbnails && product.thumbnails.map((thumb, idx) => (
              <Box
                key={idx}
                onClick={() => setActiveThumb(thumb)}
                sx={{
                  width: 70, height: 70,
                  borderRadius: '6px',
                  border: activeThumb === thumb ? '2px solid #2962ff' : '1.5px solid #e0e0e0',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: '0.2s',
                  '&:hover': { borderColor: '#2962ff' }
                }}
              >
                <Box component="img" src={thumb} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </Box>
            ))}
          </Stack>
        </Box>

        {/* CỘT PHẢI: THÔNG TIN CHI TIẾT */}
        <Box sx={{ flexGrow: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#333', mb: 1, lineHeight: 1.3, fontSize: { xs: '1.5rem', md: '2.2rem' } }}>
            {product.name}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Rating value={product.rating} precision={0.5} readOnly size="small" sx={{ color: '#ffc107' }} />
            <Typography variant="body2" color="text.secondary">({product.reviews} đánh giá)</Typography>
            <Divider orientation="vertical" flexItem />
            <Typography variant="body2" color="text.secondary">Đã bán {product.sold}</Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Thương hiệu: <span style={{ color: '#2962ff', fontWeight: 600 }}>{product.brand}</span> | Mã sản phẩm: <span style={{ color: '#2962ff', fontWeight: 600 }}>{product.sku}</span>
          </Typography>

          {/* BẢNG GIÁ KHUYẾN MÃI */}
          <Box sx={{ bgcolor: '#f5f8ff', p: 3, borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, border: '1px dashed #bce2ff' }}>
            <Box sx={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: 1.5 }}>
              <Typography sx={{ color: '#2962ff', fontWeight: 800, fontSize: { xs: '1.8rem', md: '2.5rem' } }}>
                {product.price}
              </Typography>
              {product.originalPrice && (
                <Typography sx={{ color: '#9e9e9e', textDecoration: 'line-through', fontSize: '1.2rem' }}>
                  {product.originalPrice}
                </Typography>
              )}
            </Box>

            {product.discount && (
              <Box sx={{
                bgcolor: '#ff2f4c',
                color: 'white',
                width: 58,
                height: 58,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                clipPath: 'polygon(50% 0%, 61% 12%, 77% 9%, 81% 25%, 96% 29%, 89% 43%, 100% 55%, 85% 66%, 87% 82%, 71% 86%, 63% 100%, 48% 92%, 35% 100%, 25% 85%, 9% 81%, 13% 65%, 0% 53%, 11% 41%, 3% 26%, 19% 23%, 23% 8%, 38% 13%)',
                lineHeight: 1.1
              }}>
                <Typography variant="caption" sx={{ display: 'block', fontWeight: 700, fontSize: '0.55rem' }}>Tiết kiệm</Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 900, fontSize: '0.85rem' }}>{product.discount.replace('-', '').trim()}</Typography>
              </Box>
            )}
          </Box>

          {/* CHỌN SỐ LƯỢNG */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>Số lượng:</Typography>
            <Box sx={{ display: 'inline-flex', border: '1px solid #e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
              <IconButton onClick={() => setQty(Math.max(1, qty - 1))} size="small" sx={{ borderRadius: 0, px: 2, py: 0.8 }}><RemoveIcon fontSize="small" /></IconButton>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 45, fontWeight: 700, fontSize: '1rem', color: '#2962ff' }}>{qty}</Box>
              <IconButton onClick={() => setQty(qty + 1)} size="small" sx={{ borderRadius: 0, px: 2, py: 0.8 }}><AddIcon fontSize="small" /></IconButton>
            </Box>
          </Box>

          {/* HÀNH ĐỘNG MUA HÀNG */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 'auto', mb: 3 }}>
            <Button fullWidth variant="outlined" sx={{ py: 1.5, borderColor: '#2962ff', color: '#2962ff', fontWeight: 700, borderRadius: '6px', textTransform: 'none', fontSize: '1rem', '&:hover': { bgcolor: '#f0f4ff', borderColor: '#2962ff' } }}>
              THÊM VÀO GIỎ HÀNG
            </Button>
            <Button fullWidth variant="contained" startIcon={<ShoppingBagIcon />} sx={{ py: 1.5, bgcolor: '#2962ff', color: 'white', fontWeight: 700, borderRadius: '6px', textTransform: 'none', boxShadow: 'none', fontSize: '1rem', '&:hover': { bgcolor: '#1c4cc7' } }}>
              MUA NGAY
            </Button>
          </Stack>

          <Divider />

          {/* ĐIỀU KHOẢN CAM KẾT DỊCH VỤ */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocalShippingIcon sx={{ color: '#2962ff' }} />
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#555' }}>Giao hàng nhanh toàn quốc</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <VerifiedUserIcon sx={{ color: '#2962ff' }} />
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#555' }}>Cam kết 100% chính hãng</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LoopIcon sx={{ color: '#2962ff' }} />
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#555' }}>Đổi trả dễ dàng trong 7 ngày</Typography>
            </Box>
          </Box>

        </Box>
      </Box>
    </Box>
  );
}
