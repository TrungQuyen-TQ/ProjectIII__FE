import React from 'react';
import Link from 'next/link';
import {
  Box, Card, CardMedia, CardContent, CardActions, Rating, Button, Typography
} from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

export default function ProductCard({ product, onQuickView }) {
  if (!product) return null;

  return (
    <Card sx={{
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
      {/* ẢNH SẢN PHẨM */}
      <Link href={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
        <Box sx={{ position: 'relative', pt: '100%', bgcolor: '#fafafa' }}>
          <CardMedia
            component="img"
            image={product.image}
            alt={product.name}
            sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain', p: 1 }}
          />
        </Box>
      </Link>

      <CardContent sx={{ flexGrow: 1, p: 2, pb: 1, display: 'flex', flexDirection: 'column' }}>
        {/* BADGES */}
        <Box sx={{ display: 'flex', gap: 1, mb: 1.5, flexWrap: 'wrap', minHeight: '24px', alignItems: 'center' }}>
          {product.isNew ? (
            <Box sx={{ display: 'flex', alignItems: 'center', color: '#ff4d4f', bgcolor: '#fff1f0', px: 1, py: 0.3, borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
              <LocalFireDepartmentIcon sx={{ fontSize: '14px', mr: 0.3 }} /> New
            </Box>
          ) : (
            <Box sx={{ height: '22px' }} />
          )}
        </Box>

        {/* TÊN SẢN PHẨM */}
        <Typography 
          component={Link}
          href={`/product/${product.id}`}
          variant="body2" 
          sx={{ 
            fontWeight: 500, color: '#333', mb: 1, 
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', 
            overflow: 'hidden', minHeight: 40, lineHeight: 1.4,
            textDecoration: 'none',
            '&:hover': { color: '#1890ff' }
          }}
        >
          {product.name}
        </Typography>

        {/* RATING */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'center' }}>
          <Rating value={product.rating} precision={0.5} readOnly size="small" sx={{ color: '#ffc107', fontSize: '1rem' }} />
          <Typography variant="caption" sx={{ color: '#9e9e9e', ml: 0.5 }}>({product.reviews})</Typography>
        </Box>

        {/* GIÁ SẢN PHẨM */}
        <Box sx={{ textAlign: 'center', mt: 'auto' }}>
          <Typography variant="h6" sx={{ color: '#1890ff', fontWeight: 700, fontSize: { xs: '1rem', md: '1.2rem' }, lineHeight: 1 }}>
            {product.price}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mt: 1, flexWrap: 'wrap' }}>
            {product.originalPrice && (
              <Typography variant="caption" sx={{ color: '#9e9e9e', textDecoration: 'line-through' }}>
                {product.originalPrice}
              </Typography>
            )}
            {product.discount && (
              <Box sx={{ bgcolor: '#fff1f0', color: '#ff4d4f', px: 0.8, py: 0.2, borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>
                {product.discount}
              </Box>
            )}
          </Box>
        </Box>
      </CardContent>

      {/* NÚT XEM NHANH */}
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
            fontSize: { xs: '0.75rem', md: '0.875rem' },
            '&:hover': { bgcolor: '#e6f7ff', borderColor: '#1890ff' }
          }}
        >
          XEM NHANH
        </Button>
      </CardActions>
    </Card>
  );
}
