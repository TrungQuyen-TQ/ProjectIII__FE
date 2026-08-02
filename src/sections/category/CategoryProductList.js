import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ProductCard from '../../components/ProductCard';

export default function CategoryProductList({ filteredProducts, categoryName, onQuickView, onOpenFilter }) {
  return (
    <>
      {/* KHỐI TITLE HEADER VÀ NÚT LỌC */}
      <Box sx={{ mb: 3, bgcolor: 'white', p: { xs: 2, md: 3 }, borderRadius: '8px', border: '1px solid #e0e0e0' }}>

        {/* Tên danh mục */}
        <Typography variant="h5" sx={{ fontWeight: 700, textTransform: 'uppercase', mb: 2, color: '#333' }}>
          {categoryName}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>


          {/* Nút Lọc (Chỉ hiển thị trên Mobile/Tablet) */}
          <Button
            onClick={onOpenFilter} // Gọi hàm mở Drawer
            startIcon={<FilterAltIcon />}
            sx={{
              display: { xs: 'flex', md: 'none' }, // Ẩn trên desktop (md), hiện ở thiết bị nhỏ (xs)
              color: '#333',
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Lọc
          </Button>
        </Box>
      </Box>

      {/* DANH SÁCH SẢN PHẨM */}
      {filteredProducts.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 10, bgcolor: 'white', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
          <Typography variant="h6" color="text.secondary">Hiện tại chưa có sản phẩm nào trong danh mục này.</Typography>
        </Box>
      ) : (
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)', // Mobile nhỏ chia 2 cột cho đẹp thay vì 1
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)'
          },
          gap: 2
        }}>
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onQuickView={onQuickView} 
            />
          ))}
        </Box>
      )}
    </>
  );
}