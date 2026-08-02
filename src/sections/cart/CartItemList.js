import React from 'react';
import { Box, Typography, Button, IconButton, Stack } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';

export default function CartItemList({
  cartItems,
  onIncrease,
  onDecrease,
  onRemove,
  onClearCart,
  formatPrice
}) {
  return (
    <Box sx={{ bgcolor: 'white', p: { xs: 2, md: 4 }, borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 500, color: '#000' }}>
          Giỏ hàng
        </Typography>
        <Typography sx={{ color: '#666', fontWeight: 500 }}>
          {cartItems.length} sản phẩm
        </Typography>
      </Box>

      {cartItems.length === 0 ? (
        <Typography sx={{ textAlign: 'center', color: '#999', py: 4 }}>
          Giỏ hàng của bạn đang trống.
        </Typography>
      ) : (
        <Stack spacing={3}>
          {cartItems.map((item) => (
            <Box
              key={item.id}
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: { xs: 'flex-start', md: 'center' },
                position: 'relative',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                p: 2,
                pr: { md: 6 },
                gap: 3
              }}
            >
              <IconButton
                onClick={() => onRemove(item.id)}
                sx={{ position: 'absolute', top: 12, right: 12, p: 0, color: '#000' }}
              >
                <CancelIcon />
              </IconButton>

              <Box
                component="img"
                src={item.image}
                sx={{ width: 80, height: 80, borderRadius: '4px', objectFit: 'cover', flexShrink: 0 }}
              />

              <Box sx={{ flexGrow: 1, minWidth: 0, width: '100%' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500, color: '#1a1a1a', mb: 0.5, lineHeight: 1.4 }}>
                  {item.name}
                </Typography>
                <Typography variant="body2" sx={{ color: '#9e9e9e' }}>
                  {item.variant}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
                <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: '#000' }}>
                  {formatPrice(item.price)}
                </Typography>
                <Typography sx={{ color: '#9e9e9e', textDecoration: 'line-through', fontSize: '0.85rem' }}>
                  {formatPrice(item.originalPrice)}
                </Typography>
                <Typography sx={{ bgcolor: '#ff0000', color: 'white', px: 1, py: 0.2, borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>
                  {item.discount}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #e0e0e0', borderRadius: '4px', height: 36, flexShrink: 0 }}>
                <IconButton onClick={() => onDecrease(item.id)} size="small" sx={{ borderRadius: 0, px: 1.5 }}>
                  <RemoveIcon fontSize="small" sx={{ color: '#333' }} />
                </IconButton>
                <Typography sx={{ px: 2, borderLeft: '1px solid #e0e0e0', borderRight: '1px solid #e0e0e0', lineHeight: '36px', minWidth: 40, textAlign: 'center' }}>
                  {item.qty}
                </Typography>
                <IconButton onClick={() => onIncrease(item.id)} size="small" sx={{ borderRadius: 0, px: 1.5 }}>
                  <AddIcon fontSize="small" sx={{ color: '#333' }} />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Stack>
      )}

      {cartItems.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
          <Button
            color="error"
            startIcon={<DeleteSweepIcon />}
            onClick={onClearCart}
            sx={{ textTransform: 'none', fontWeight: 600, textDecoration: 'underline' }}
          >
            Xóa hết giỏ hàng
          </Button>
        </Box>
      )}
    </Box>
  );
}
