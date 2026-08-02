import React from 'react';
import {
  Box, Typography, Card, CardMedia, CardContent, CardActions,
  Rating, Button, FormControl, Select, MenuItem
} from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

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
            <Card key={product.id} sx={{
              height: '100%', display: 'flex', flexDirection: 'column',
              transition: 'all 0.3s ease',
              border: '1px solid #e0e0e0',
              boxShadow: 'none',
              borderRadius: '8px',
              '&:hover': {
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                borderColor: 'transparent'
              }
            }}>

              <Box sx={{ position: 'relative', pt: '100%', bgcolor: '#fafafa' }}>
                <CardMedia
                  component="img"
                  image={product.image}
                  alt={product.name}
                  sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain', p: 1 }}
                />
              </Box>

              <CardContent sx={{ flexGrow: 1, p: 2, pb: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
                  {product.isNew && (
                    <Box sx={{ display: 'flex', alignItems: 'center', color: '#ff4d4f', bgcolor: '#fff1f0', px: 1, py: 0.3, borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
                      <LocalFireDepartmentIcon sx={{ fontSize: '14px', mr: 0.3 }} /> New
                    </Box>
                  )}
                  <Box sx={{ display: 'flex', alignItems: 'center', color: '#1890ff', bgcolor: '#e6f7ff', px: 1, py: 0.3, borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
                    <ShowChartIcon sx={{ fontSize: '14px', mr: 0.3 }} /> Đã bán {product.sold}
                  </Box>
                </Box>

                <Typography variant="body2" sx={{ fontWeight: 500, color: '#333', mb: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: 40, lineHeight: 1.4 }}>
                  {product.name}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'center' }}>
                  <Rating value={product.rating} precision={0.5} readOnly size="small" sx={{ color: '#ffc107', fontSize: '1rem' }} />
                  <Typography variant="caption" sx={{ color: '#9e9e9e', ml: 0.5 }}>({product.reviews})</Typography>
                </Box>

                <Box sx={{ textAlign: 'center', mt: 'auto' }}>
                  <Typography variant="h6" sx={{ color: '#1890ff', fontWeight: 700, fontSize: { xs: '1rem', md: '1.2rem' }, lineHeight: 1 }}>
                    {product.price}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                    <Typography variant="caption" sx={{ color: '#9e9e9e', textDecoration: 'line-through' }}>
                      {product.originalPrice}
                    </Typography>
                    {product.discount && (
                      <Box sx={{ bgcolor: '#fff1f0', color: '#ff4d4f', px: 0.8, py: 0.2, borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>
                        {product.discount}
                      </Box>
                    )}
                  </Box>
                </Box>
              </CardContent>

              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  fullWidth variant="outlined"
                  startIcon={<VisibilityOutlinedIcon />}
                  onClick={() => onQuickView && onQuickView(product)}
                  sx={{
                    color: '#1890ff',
                    borderColor: '#1890ff',
                    borderRadius: '50px',
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: { xs: '0.75rem', md: '0.875rem' }, // Chữ nhỏ lại một xíu trên mobile cho vừa
                    '&:hover': { bgcolor: '#e6f7ff', borderColor: '#1890ff' }
                  }}
                >
                  XEM NHANH
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      )}
    </>
  );
}