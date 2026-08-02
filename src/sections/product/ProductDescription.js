import React from 'react';
import { Box, Typography } from '@mui/material';

export default function ProductDescription({ product }) {
  return (
    <Box sx={{ bgcolor: 'white', borderRadius: '12px', p: { xs: 3, md: 4 }, boxShadow: '0 2px 12px rgba(0,0,0,0.03)', mb: 4 }}>
      <Typography variant="h6" sx={{ fontWeight: 800, color: '#17479d', borderBottom: '2px solid #17479d', display: 'inline-block', pb: 1, mb: 3 }}>
        CHI TIẾT SẢN PHẨM
      </Typography>
      <Typography variant="body1" sx={{ color: '#444', lineHeight: 1.8 }}>
        Đây là sản phẩm <strong>{product.name}</strong> chất lượng cao được thiết kế tỉ mỉ, tinh tế, mang lại trải nghiệm mua sắm và sử dụng tốt nhất cho khách hàng. Sản phẩm rất phù hợp làm quà tặng hoặc phục vụ các nhu cầu cá nhân.
        <br /><br />
        Chúng tôi cam kết cung cấp sản phẩm với chất lượng đạt chuẩn, nguồn gốc xuất xứ rõ ràng cùng dịch vụ chăm sóc khách hàng chuyên nghiệp, hỗ trợ tận tâm.
      </Typography>
    </Box>
  );
}
