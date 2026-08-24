import React from 'react';
import { Card, Box, Typography, Button, Rating } from '@mui/material';
import { getProductImageUrl } from '../utils/imageHelper';
import Link from 'next/link';

function safeNumber(val) {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  return Number(String(val).replace(/[^0-9]/g, '')) || 0;
}

export default function OutletProductCard({ product = {}, onQuickView }) {
  const {
    id = 1,
    name = 'Sản phẩm Outlet',
    image,
    thumbnail,
    Thumbnail,
    discountPercent = 0,
    rating = 5,
  } = product;

  const price = safeNumber(product.price);
  const originalPrice = safeNumber(product.originalPrice);

  const safeId = Number(id) || name.length || 1;
  const soldCount = product.soldCount || ((safeId * 47) % 250) + 50;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: 3,
        border: '1px solid #e8ecf2',
        boxShadow: 'none',
        transition: 'all 0.25s ease',
        '&:hover': {
          boxShadow: '0 10px 24px rgba(0, 51, 102, 0.1)',
          transform: 'translateY(-4px)',
          borderColor: '#cce0f5',
          '& .product-img': {
            transform: 'scale(1.05)',
          },
        },
      }}
    >
      {/* Khối Hình ảnh & Huy hiệu Đã bán */}
      <Link href={`/product/${id}`} style={{ textDecoration: 'none' }}>
        <Box sx={{ p: 1.5, pb: 0 }}>
          <Box
            sx={{
              width: '100%',
              height: 190,
              borderRadius: 2,
              overflow: 'hidden',
              bgcolor: '#f8f9fc',
              position: 'relative',
              cursor: 'pointer'
            }}
          >
            <Box
              component="img"
              className="product-img"
              src={getProductImageUrl(image || thumbnail || Thumbnail)}
              alt={name}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.3s ease',
                display: 'block',
              }}
            />

            {/* Huy hiệu Đã bán */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 8,
                left: 8,
                bgcolor: 'rgba(255, 255, 255, 0.92)',
                color: '#0066cc',
                fontSize: '11px',
                fontWeight: 700,
                px: 1,
                py: 0.3,
                borderRadius: 5,
                border: '1px solid #d6e8fa',
              }}
            >
              🔥 Đã bán {soldCount}
            </Box>
          </Box>
        </Box>
      </Link>

      {/* Thông tin sản phẩm */}
      <Box
        sx={{
          p: 1.5,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          {/* Huy hiệu New */}
          <Box
            component="span"
            sx={{
              display: 'inline-block',
              bgcolor: '#fff0f0',
              color: '#e53935',
              fontSize: '11px',
              fontWeight: 700,
              px: 0.8,
              py: 0.2,
              borderRadius: 1,
              mb: 0.8,
            }}
          >
            🔥 New
          </Box>

          {/* Tên sản phẩm */}
          <Link href={`/product/${id}`} style={{ textDecoration: 'none' }}>
            <Typography
              variant="subtitle2"
              title={name}
              sx={{
                fontWeight: 600,
                color: '#2b303a',
                mb: 0.8,
                lineHeight: 1.4,
                height: 40,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                cursor: 'pointer',
                '&:hover': { color: '#0066cc' }
              }}
            >
              {name}
            </Typography>
          </Link>

          {/* Đánh giá sao chuẩn MUI */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Rating
              value={Number(product.rating || product.Rating || rating || 5)}
              readOnly
              size="small"
              sx={{ color: '#ffb800', fontSize: '1rem' }}
            />
            <Typography
              component="span"
              sx={{ color: '#888', fontSize: '12px', ml: 0.5 }}
            >
              ({product.ratingCount !== undefined ? product.ratingCount : (product.RatingCount !== undefined ? product.RatingCount : (product.reviews || 0))})
            </Typography>
          </Box>
        </Box>

        {/* Khối giá & Nút Xem Nhanh */}
        <Box>
          <Box sx={{ mb: 1.2 }}>
            <Typography
              sx={{
                fontSize: '18px',
                fontWeight: 800,
                color: '#0066cc',
                lineHeight: 1.2,
              }}
            >
              {price.toLocaleString('vi-VN')} VNĐ
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.3 }}>
              <Typography
                sx={{
                  fontSize: '13px',
                  color: '#888',
                  textDecoration: 'line-through',
                }}
              >
                {originalPrice.toLocaleString('vi-VN')} VNĐ
              </Typography>
              <Box
                component="span"
                sx={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#e53935',
                  bgcolor: '#ffebee',
                  px: 0.7,
                  py: 0.2,
                  borderRadius: 1,
                }}
              >
                -{discountPercent}%
              </Box>
            </Box>
          </Box>

          {/* Nút Xem nhanh */}
          <Button
            fullWidth
            variant="outlined"
            onClick={() => onQuickView && onQuickView(product)}
            sx={{
              borderRadius: 5,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '13px',
              py: 0.6,
              borderColor: '#0066cc',
              color: '#0066cc',
              '&:hover': {
                bgcolor: '#0066cc',
                color: '#fff',
                borderColor: '#0066cc',
              },
            }}
          >
            👁 XEM NHANH
          </Button>
        </Box>
      </Box>
    </Card>
  );
}
