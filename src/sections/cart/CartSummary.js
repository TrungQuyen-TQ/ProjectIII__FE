import React from 'react';
import { Box, Typography, Button, Stack, Divider } from '@mui/material';
import Link from 'next/link';

export default function CartSummary({
  cartItems,
  totalItems,
  subTotal,
  shippingFee,
  taxes,
  grandTotal,
  formatPrice
}) {
  return (
    <Box sx={{ bgcolor: 'white', p: { xs: 3, md: 4 }, borderRadius: '12px', border: '1px solid #e0e0e0', boxShadow: '0 2px 12px rgba(0,0,0,0.02)' }}>
      <Typography variant="h6" sx={{ fontWeight: 600, color: '#333', mb: 3 }}>
        Tóm tắt đơn hàng
      </Typography>

      <Stack spacing={2} sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ color: '#666', fontSize: '0.95rem' }}>Số lượng sản phẩm</Typography>
          <Typography sx={{ fontWeight: 500 }}>{totalItems}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ color: '#666', fontSize: '0.95rem' }}>Tạm tính</Typography>
          <Typography sx={{ fontWeight: 500 }}>{formatPrice(subTotal)}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ color: '#666', fontSize: '0.95rem' }}>Phí giao hàng</Typography>
          <Typography sx={{ fontWeight: 500 }}>{formatPrice(shippingFee)}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ color: '#666', fontSize: '0.95rem' }}>Thuế</Typography>
          <Typography sx={{ fontWeight: 500 }}>{formatPrice(taxes)}</Typography>
        </Box>
      </Stack>

      <Divider sx={{ mb: 2 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
          Tổng cộng
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#17479d' }}>
          {formatPrice(grandTotal)}
        </Typography>
      </Box>

      <Button
        component={Link}
        href="/checkout"
        fullWidth
        variant="contained"
        size="large"
        disabled={cartItems.length === 0}
        sx={{
          bgcolor: '#17479d',
          fontWeight: 700,
          py: 1.5,
          borderRadius: '8px',
          fontSize: '1rem',
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': { bgcolor: '#0f3170' },
          '&.Mui-disabled': { bgcolor: '#cccccc', color: '#666' }
        }}
      >
        Tiến hành thanh toán
      </Button>
    </Box>
  );
}
