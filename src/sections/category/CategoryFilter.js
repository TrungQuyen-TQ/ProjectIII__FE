import React from 'react';
import { Box, Typography, FormGroup, FormControlLabel, Checkbox, Divider, Button, TextField, Stack } from '@mui/material';

export default function CategoryFilter({
  subCategories = [],
  selectedSubId = '',
  onSelectSubId,
  minPrice = '',
  maxPrice = '',
  onMinPriceChange,
  onMaxPriceChange,
  onApply,
  onReset
}) {
  
  const handlePresetPrice = (min, max) => {
    onMinPriceChange(min !== null ? String(min) : '');
    onMaxPriceChange(max !== null ? String(max) : '');
  };

  return (
    <Box sx={{ bgcolor: 'white', p: 3, borderRadius: '8px', border: '1px solid #e0e0e0', position: 'sticky', top: 120 }}>
      <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, pb: 1, borderBottom: '2px solid #17479d', display: 'block', color: '#17479d' }}>
        BỘ LỌC TÌM KIẾM
      </Typography>

      {/* 1. LOẠI SẢN PHẨM (DANH MỤC CON) */}
      {subCategories.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#17479d', textTransform: 'uppercase', mb: 1.5 }}>
            DANH MỤC CON
          </Typography>
          <FormGroup>
            {subCategories.map((subItem) => (
              <FormControlLabel
                key={subItem.id}
                control={
                  <Checkbox
                    size="small"
                    checked={selectedSubId === subItem.id}
                    onChange={() => onSelectSubId(selectedSubId === subItem.id ? '' : subItem.id)}
                  />
                }
                label={<Typography variant="body2" sx={{ fontWeight: 500 }}>{subItem.title || subItem.name}</Typography>}
              />
            ))}
          </FormGroup>
          <Divider sx={{ my: 2 }} />
        </Box>
      )}

      {/* 2. MỨC GIÁ CHỌN NHANH */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#17479d', textTransform: 'uppercase', mb: 1.5 }}>
          MỨC GIÁ
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={minPrice === '' && maxPrice === '100000'}
                onChange={(e) => e.target.checked ? handlePresetPrice(null, 100000) : handlePresetPrice(null, null)}
              />
            }
            label={<Typography variant="body2" sx={{ fontWeight: 500 }}>Dưới 100.000đ</Typography>}
          />
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={minPrice === '100000' && maxPrice === '300000'}
                onChange={(e) => e.target.checked ? handlePresetPrice(100000, 300000) : handlePresetPrice(null, null)}
              />
            }
            label={<Typography variant="body2" sx={{ fontWeight: 500 }}>100.000đ - 300.000đ</Typography>}
          />
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={minPrice === '300000' && maxPrice === ''}
                onChange={(e) => e.target.checked ? handlePresetPrice(300000, null) : handlePresetPrice(null, null)}
              />
            }
            label={<Typography variant="body2" sx={{ fontWeight: 500 }}>Trên 300.000đ</Typography>}
          />
        </FormGroup>
      </Box>

      {/* 3. KHOẢNG GIÁ TỰ NHẬP */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 1 }}>
          KHOẢNG GIÁ (VND)
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <TextField
            size="small"
            placeholder="Từ"
            value={minPrice}
            onChange={(e) => onMinPriceChange(e.target.value.replace(/\D/g, ''))}
            inputProps={{ style: { fontSize: '0.85rem', padding: '8px' } }}
          />
          <Typography variant="body2" color="text.secondary">-</Typography>
          <TextField
            size="small"
            placeholder="Đến"
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(e.target.value.replace(/\D/g, ''))}
            inputProps={{ style: { fontSize: '0.85rem', padding: '8px' } }}
          />
        </Stack>
      </Box>

      <Stack spacing={1}>
        <Button
          fullWidth
          variant="contained"
          onClick={onApply}
          sx={{
            bgcolor: '#17479d',
            fontWeight: 700,
            py: 1,
            borderRadius: '8px',
            '&:hover': { bgcolor: '#0f3170' }
          }}
        >
          ÁP DỤNG
        </Button>
        <Button
          fullWidth
          variant="outlined"
          onClick={onReset}
          sx={{
            borderColor: '#ccc',
            color: '#666',
            fontWeight: 600,
            py: 1,
            borderRadius: '8px',
            '&:hover': { borderColor: '#999', bgcolor: '#f5f5f5' }
          }}
        >
          XÓA BỘ LỌC
        </Button>
      </Stack>
    </Box>
  );
}

