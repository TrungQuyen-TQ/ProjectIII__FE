// src/pages/cart.js
import React from 'react';
import Head from 'next/head';
import { Box, Container, Typography, Button, Grid, Divider, IconButton } from '@mui/material';

// SỬA LỖI TẠI ĐÂY: Đổi sang dùng DeleteIcon chuẩn (Standard)
import DeleteIcon from '@mui/icons-material/Delete'; 

import MainLayout from '../layouts/MainLayout';

export default function CartPage() {
  return (
    <>
      <Head>
        <title>Giỏ hàng | Tạp Hóa Store</title>
      </Head>

      <MainLayout>
        <Container maxWidth="lg" sx={{ py: 6, flexGrow: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#17479d', mb: 4 }}>
            Giỏ Hàng Của Bạn
          </Typography>

          <Grid container spacing={4}>
            {/* Cột Danh sách sản phẩm */}
            <Grid item xs={12} md={8}>
              <Box sx={{ bgcolor: 'white', p: 3, borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                {/* Item 1 */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box component="img" src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&q=80" sx={{ width: 80, height: 80, borderRadius: '8px', objectFit: 'cover' }} />
                  <Box sx={{ flexGrow: 1, ml: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Son kem MAC cao cấp (Đồ làm đẹp)</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>Số lượng: 1</Typography>
                  </Box>
                  <Typography variant="h6" sx={{ color: '#ff910d', fontWeight: 800, mx: 3 }}>450.000đ</Typography>
                  {/* Đã đổi thành <DeleteIcon /> */}
                  <IconButton color="error"><DeleteIcon /></IconButton>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                {/* Item 2 */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box component="img" src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&q=80" sx={{ width: 80, height: 80, borderRadius: '8px', objectFit: 'cover' }} />
                  <Box sx={{ flexGrow: 1, ml: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Hộp quà tặng Sinh nhật</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>Số lượng: 2</Typography>
                  </Box>
                  <Typography variant="h6" sx={{ color: '#ff910d', fontWeight: 800, mx: 3 }}>300.000đ</Typography>
                  {/* Đã đổi thành <DeleteIcon /> */}
                  <IconButton color="error"><DeleteIcon /></IconButton>
                </Box>
              </Box>
            </Grid>

            {/* Cột Thanh toán */}
            <Grid item xs={12} md={4}>
              <Box sx={{ bgcolor: 'white', p: 3, borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Tổng Đơn Hàng</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography>Tạm tính:</Typography>
                  <Typography sx={{ fontWeight: 600 }}>750.000đ</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography>Phí giao hàng:</Typography>
                  <Typography sx={{ fontWeight: 600 }}>30.000đ</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>Thành tiền:</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 900, color: '#ff910d' }}>780.000đ</Typography>
                </Box>
                <Button fullWidth variant="contained" size="large" sx={{ bgcolor: '#17479d', fontWeight: 800, py: 1.5, borderRadius: '8px', '&:hover': { bgcolor: '#0f3170' } }}>
                  TIẾN HÀNH THANH TOÁN
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </MainLayout>
    </>
  );
}