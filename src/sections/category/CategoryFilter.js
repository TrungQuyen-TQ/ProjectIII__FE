import React from 'react';
import { Box, Typography, FormGroup, FormControlLabel, Checkbox, Divider, Button } from '@mui/material';

export default function CategoryFilter({ subItemsList = [] }) {
  return (
    <Box sx={{ bgcolor: 'white', p: 3, borderRadius: '8px', border: '1px solid #e0e0e0', position: 'sticky', top: 120 }}>
      <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, pb: 1, borderBottom: '2px solid #17479d', display: 'block', color: '#17479d' }}>
        BỘ LỌC TÌM KIẾM
      </Typography>

      {/* 1. LOẠI SẢN PHẨM */}
      {subItemsList.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#17479d', textTransform: 'uppercase', mb: 1.5 }}>
            LOẠI SẢN PHẨM
          </Typography>
          <FormGroup>
            {subItemsList.map((subItem, index) => (
              <FormControlLabel
                key={index}
                control={<Checkbox size="small" />}
                label={<Typography variant="body2" sx={{ fontWeight: 500 }}>{subItem}</Typography>}
              />
            ))}
          </FormGroup>
          <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', mt: 1, color: 'text.secondary', cursor: 'pointer', fontWeight: 600 }}>
            Xem thêm ∨
          </Typography>
          <Divider sx={{ my: 2 }} />
        </Box>
      )}

      {/* 2. MỨC GIÁ */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#17479d', textTransform: 'uppercase', mb: 1.5 }}>
          MỨC GIÁ
        </Typography>
        <FormGroup>
          <FormControlLabel control={<Checkbox size="small" />} label={<Typography variant="body2" sx={{ fontWeight: 500 }}>Dưới 100.000đ</Typography>} />
          <FormControlLabel control={<Checkbox size="small" />} label={<Typography variant="body2" sx={{ fontWeight: 500 }}>100.000đ - 300.000đ</Typography>} />
          <FormControlLabel control={<Checkbox size="small" />} label={<Typography variant="body2" sx={{ fontWeight: 500 }}>Trên 300.000đ</Typography>} />
        </FormGroup>
      </Box>

      <Button fullWidth variant="contained" sx={{ mt: 2, bgcolor: '#17479d', fontWeight: 700, py: 1, borderRadius: '8px', '&:hover': { bgcolor: '#0f3170' } }}>
        ÁP DỤNG
      </Button>
    </Box>
  );
}
