import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Pagination, Stack } from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ProductCard from '../../components/ProductCard';

const ITEMS_PER_PAGE = 12;

export default function CategoryProductList({ filteredProducts, categoryName, onQuickView, onOpenFilter }) {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page to 1 when filters or products list changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredProducts]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    // Smooth scroll to top of product list section
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
        <>
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
            {paginatedProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onQuickView={onQuickView} 
              />
            ))}
          </Box>

          {/* THANH PHÂN TRANG */}
          {totalPages > 1 && (
            <Stack spacing={2} sx={{ mt: 5, alignItems: 'center' }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                shape="rounded"
                size="large"
                sx={{
                  '& .MuiPaginationItem-root': {
                    fontWeight: 600,
                  }
                }}
              />
            </Stack>
          )}
        </>
      )}
    </>
  );
}