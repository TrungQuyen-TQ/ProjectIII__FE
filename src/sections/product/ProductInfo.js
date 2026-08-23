import React, { useState, useEffect } from 'react';
import {
  Grid, Box, Stack, Typography, Rating, Divider, Button, IconButton
} from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import LoopIcon from '@mui/icons-material/Loop';

import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { getProductImageUrl } from '../../utils/imageHelper';
import brandService from '../../services/brandService';

const isUuid = (str) => {
  return typeof str === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
};

export default function ProductInfo({
  product,
  activeThumb,
  setActiveThumb,
  qty,
  setQty
}) {
  const dispatch = useDispatch();
  const router = useRouter();

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [selectedStringVariant, setSelectedStringVariant] = useState('');

  const hasObjectVariants = product && Array.isArray(product.variants) && product.variants.length > 0 && typeof product.variants[0] === 'object';

  // Trích xuất các thuộc tính độc nhất từ variants (dành cho API backend)
  const attributeKeys = [];
  if (hasObjectVariants) {
    product.variants.forEach(v => {
      if (v && v.attributes) {
        Object.keys(v.attributes).forEach(k => {
          if (!attributeKeys.includes(k)) {
            attributeKeys.push(k);
          }
        });
      }
    });
  }

  const getAttributeValues = (key) => {
    const values = [];
    if (hasObjectVariants) {
      product.variants.forEach(v => {
        if (v && v.attributes && v.attributes[key] !== undefined) {
          const val = v.attributes[key];
          if (!values.includes(val)) {
            values.push(val);
          }
        }
      });
    }
    return values;
  };

  const [brandName, setBrandName] = useState('');

  useEffect(() => {
    setSelectedVariant(null);
    setSelectedAttributes({});
    setSelectedStringVariant('');
  }, [product]);

  useEffect(() => {
    const fetchBrand = async () => {
      setBrandName('');
      const brandId = product?.brandId || product?.brand || product?.BrandId || product?.Brand;
      if (brandId && isUuid(brandId)) {
        const brandData = await brandService.getBrandById(brandId);
        if (brandData) {
          setBrandName(brandData.name || brandData.Name || '');
        }
      } else if (brandId) {
        setBrandName(brandId);
      }
    };

    if (product) {
      fetchBrand();
    }
  }, [product]);

  const handleSelectVariant = (v) => {
    setSelectedVariant(v);
    if (v) {
      if (v.attributes) {
        setSelectedAttributes(v.attributes);
      }
      const img = v.thumbnail || (v.images && v.images[0]);
      if (img) {
        setActiveThumb(img);
      }
    } else {
      setSelectedAttributes({});
      setActiveThumb(product.image || product.thumbnail || '');
    }
  };

  const handleSelectStringVariant = (val, idx) => {
    setSelectedStringVariant(val);
    if (val === '') {
      setActiveThumb(product.image || product.thumbnail || '');
    } else {
      if (Array.isArray(product.thumbnails) && product.thumbnails[idx]) {
        setActiveThumb(product.thumbnails[idx]);
      } else if (Array.isArray(product.images) && product.images[idx]) {
        setActiveThumb(product.images[idx]);
      }
    }
  };

  const getSelectedVariantText = () => {
    if (hasObjectVariants && selectedVariant) {
      return Object.entries(selectedVariant.attributes || {})
        .map(([k, v]) => {
          const label = k === 'design' ? 'Phân loại' : k;
          return `${label}: ${v}`;
        })
        .join(', ');
    }
    if (product && Array.isArray(product.variants) && product.variants.length > 0 && typeof product.variants[0] === 'string') {
      return selectedStringVariant;
    }
  };

  const handleAddToCart = () => {
    const variantText = getSelectedVariantText();
    const productToCart = {
      ...product,
      price: hasObjectVariants && selectedVariant ? selectedVariant.price : product.price,
      sku: hasObjectVariants && selectedVariant ? selectedVariant.sku : product.sku,
      productVariantId: hasObjectVariants && selectedVariant ? selectedVariant.id : null,
      image: hasObjectVariants && selectedVariant && (selectedVariant.thumbnail || (selectedVariant.images && selectedVariant.images[0]))
        ? (selectedVariant.thumbnail || selectedVariant.images[0])
        : (product.image || product.thumbnail)
    };
    dispatch(addToCart({ product: productToCart, quantity: qty, variant: variantText }));
    toast.success('Đã thêm sản phẩm vào giỏ hàng!');
  };

  const handleBuyNow = () => {
    const variantText = getSelectedVariantText();
    const productToCart = {
      ...product,
      price: hasObjectVariants && selectedVariant ? selectedVariant.price : product.price,
      sku: hasObjectVariants && selectedVariant ? selectedVariant.sku : product.sku,
      productVariantId: hasObjectVariants && selectedVariant ? selectedVariant.id : null,
      image: hasObjectVariants && selectedVariant && (selectedVariant.thumbnail || (selectedVariant.images && selectedVariant.images[0]))
        ? (selectedVariant.thumbnail || selectedVariant.images[0])
        : (product.image || product.thumbnail)
    };
    dispatch(addToCart({ product: productToCart, quantity: qty, variant: variantText }));
    router.push('/cart');
  };

  const displayImage = getProductImageUrl(activeThumb || product.image || product.thumbnail);

  const displayPrice = hasObjectVariants && selectedVariant
    ? `${selectedVariant.price.toLocaleString('vi-VN')} VNĐ`
    : (typeof product.price === 'number' ? `${product.price.toLocaleString('vi-VN')} VNĐ` : product.price);

  const displayOriginalPrice = hasObjectVariants && selectedVariant
    ? (selectedVariant.originalPrice ? `${selectedVariant.originalPrice.toLocaleString('vi-VN')} VNĐ` : null)
    : (typeof product.originalPrice === 'number' ? `${product.originalPrice.toLocaleString('vi-VN')} VNĐ` : product.originalPrice);

  const displaySku = hasObjectVariants && selectedVariant
    ? selectedVariant.sku
    : product.sku;

  let discountTag = product.discount;
  if (!discountTag && typeof product.price === 'number' && typeof product.originalPrice === 'number' && product.originalPrice > product.price) {
    const pct = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    if (pct > 0) {
      discountTag = `-${pct}%`;
    }
  }

  const displayThumbnails = (product.thumbnails || [product.image || product.thumbnail || '/images/default-product.jpg']).map(t => getProductImageUrl(t));

  return (
    <Box sx={{ bgcolor: 'white', borderRadius: '12px', p: { xs: 2, md: 4 }, boxShadow: '0 2px 12px rgba(0,0,0,0.03)', mb: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 3, md: 6 } }}>

        {/* CỘT TRÁI: HÌNH ẢNH */}
        <Box sx={{ width: { xs: '100%', md: '50%' }, flexShrink: 0 }}>
          <Box sx={{ bgcolor: '#f8f9fa', borderRadius: '12px', p: 2, mb: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid #f0f0f0' }}>
            <Box component="img" src={getProductImageUrl(activeThumb) || displayImage} sx={{ width: '100%', maxHeight: { xs: 300, md: 450 }, objectFit: 'contain' }} />
          </Box>
          {displayThumbnails.length > 1 && (
            <Stack direction="row" spacing={1.5} sx={{ overflowX: 'auto', pb: 1 }}>
              {displayThumbnails.map((thumb, idx) => (
                <Box
                  key={idx}
                  onClick={() => setActiveThumb(thumb)}
                  sx={{
                    width: 70, height: 70,
                    borderRadius: '6px',
                    border: getProductImageUrl(activeThumb || displayImage) === thumb ? '2px solid #2962ff' : '1.5px solid #e0e0e0',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    flexShrink: 0,
                    transition: '0.2s',
                    '&:hover': { borderColor: '#2962ff' }
                  }}
                >
                  <Box component="img" src={thumb} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </Box>
              ))}
            </Stack>
          )}
        </Box>

        {/* CỘT PHẢI: THÔNG TIN CHI TIẾT */}
        <Box sx={{ flexGrow: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#333', mb: 1, lineHeight: 1.3, fontSize: { xs: '1.5rem', md: '2.2rem' } }}>
            {product.name}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Rating value={product.rating} precision={0.5} readOnly size="small" sx={{ color: '#ffc107' }} />
            <Typography variant="body2" color="text.secondary">({product.reviews} đánh giá)</Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Thương hiệu: <span style={{ color: '#2962ff', fontWeight: 600 }}>{brandName || product.brandName || product.BrandName || 'Khác'}</span> | Mã sản phẩm: <span style={{ color: '#2962ff', fontWeight: 600 }}>{displaySku}</span>
          </Typography>

          {/* BẢNG GIÁ KHUYẾN MÃI */}
          <Box sx={{ bgcolor: '#f5f8ff', p: 3, borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, border: '1px dashed #bce2ff' }}>
            <Box sx={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: 1.5 }}>
              <Typography sx={{ color: '#2962ff', fontWeight: 800, fontSize: { xs: '1.8rem', md: '2.5rem' } }}>
                {displayPrice}
              </Typography>
              {displayOriginalPrice && (
                <Typography sx={{ color: '#9e9e9e', textDecoration: 'line-through', fontSize: '1.2rem' }}>
                  {displayOriginalPrice}
                </Typography>
              )}
            </Box>

            {discountTag && (
              <Box sx={{
                bgcolor: '#fff1f0',
                color: '#ff4d4f',
                px: 1.5,
                py: 0.5,
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 700,
                alignSelf: 'center'
              }}>
                {discountTag}
              </Box>
            )}
          </Box>

          {/* LỰA CHỌN BIẾN THỂ (CHO API BACKEND) */}
          {hasObjectVariants && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Phân loại:</Typography>
              <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
                <Button
                  variant={selectedVariant === null ? "contained" : "outlined"}
                  size="small"
                  onClick={() => handleSelectVariant(null)}
                  sx={{
                    borderRadius: '6px',
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 2,
                    py: 0.5,
                    borderColor: selectedVariant === null ? '#2962ff' : '#e0e0e0',
                    bgcolor: selectedVariant === null ? '#2962ff' : 'white',
                    color: selectedVariant === null ? 'white' : '#555',
                    '&:hover': {
                      borderColor: '#2962ff',
                      bgcolor: selectedVariant === null ? '#1c4cc7' : 'rgba(41, 98, 255, 0.04)'
                    }
                  }}
                >
                  Sản phẩm gốc
                </Button>
                {product.variants.map((v) => {
                  const isSelected = selectedVariant && selectedVariant.id === v.id;
                  const label = v.name || Object.values(v.attributes || {}).join(' - ') || 'Biến thể';
                  return (
                    <Button
                      key={v.id}
                      variant={isSelected ? "contained" : "outlined"}
                      size="small"
                      onClick={() => handleSelectVariant(v)}
                      sx={{
                        borderRadius: '6px',
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 2,
                        py: 0.5,
                        borderColor: isSelected ? '#2962ff' : '#e0e0e0',
                        bgcolor: isSelected ? '#2962ff' : 'white',
                        color: isSelected ? 'white' : '#555',
                        '&:hover': {
                          borderColor: '#2962ff',
                          bgcolor: isSelected ? '#1c4cc7' : 'rgba(41, 98, 255, 0.04)'
                        }
                      }}
                    >
                      {label}
                    </Button>
                  );
                })}
              </Stack>
            </Box>
          )}

          {/* LỰA CHỌN BIẾN THỂ (DÀNH CHO MOCK DATA) */}
          {!hasObjectVariants && product && Array.isArray(product.variants) && product.variants.length > 0 && typeof product.variants[0] === 'string' && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Phân loại:</Typography>
              <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
                <Button
                  variant={selectedStringVariant === '' ? "contained" : "outlined"}
                  size="small"
                  onClick={() => handleSelectStringVariant('', -1)}
                  sx={{
                    borderRadius: '6px',
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 2,
                    py: 0.5,
                    borderColor: selectedStringVariant === '' ? '#2962ff' : '#e0e0e0',
                    bgcolor: selectedStringVariant === '' ? '#2962ff' : 'white',
                    color: selectedStringVariant === '' ? 'white' : '#555',
                    '&:hover': {
                      borderColor: '#2962ff',
                      bgcolor: selectedStringVariant === '' ? '#1c4cc7' : 'rgba(41, 98, 255, 0.04)'
                    }
                  }}
                >
                  Sản phẩm gốc
                </Button>
                {product.variants.map((val, idx) => {
                  const isSelected = selectedStringVariant === val;
                  return (
                    <Button
                      key={val}
                      variant={isSelected ? "contained" : "outlined"}
                      size="small"
                      onClick={() => handleSelectStringVariant(val, idx)}
                      sx={{
                        borderRadius: '6px',
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 2,
                        py: 0.5,
                        borderColor: isSelected ? '#2962ff' : '#e0e0e0',
                        bgcolor: isSelected ? '#2962ff' : 'white',
                        color: isSelected ? 'white' : '#555',
                        '&:hover': {
                          borderColor: '#2962ff',
                          bgcolor: isSelected ? '#1c4cc7' : 'rgba(41, 98, 255, 0.04)'
                        }
                      }}
                    >
                      {val}
                    </Button>
                  );
                })}
              </Stack>
            </Box>
          )}

          {/* CHỌN SỐ LƯỢNG */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>Số lượng:</Typography>
            <Box sx={{ display: 'inline-flex', border: '1px solid #e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
              <IconButton onClick={() => setQty(Math.max(1, qty - 1))} size="small" sx={{ borderRadius: 0, px: 2, py: 0.8 }}><RemoveIcon fontSize="small" /></IconButton>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 45, fontWeight: 700, fontSize: '1rem', color: '#2962ff' }}>{qty}</Box>
              <IconButton onClick={() => setQty(qty + 1)} size="small" sx={{ borderRadius: 0, px: 2, py: 0.8 }}><AddIcon fontSize="small" /></IconButton>
            </Box>
          </Box>

          {/* HÀNH ĐỘNG MUA HÀNG */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 'auto', mb: 3 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleAddToCart}
              sx={{ py: 1.5, borderColor: '#2962ff', color: '#2962ff', fontWeight: 700, borderRadius: '6px', textTransform: 'none', fontSize: '1rem', '&:hover': { bgcolor: '#f0f4ff', borderColor: '#2962ff' } }}
            >
              THÊM VÀO GIỎ HÀNG
            </Button>
            <Button
              fullWidth
              variant="contained"
              startIcon={<ShoppingBagIcon />}
              onClick={handleBuyNow}
              sx={{ py: 1.5, bgcolor: '#2962ff', color: 'white', fontWeight: 700, borderRadius: '6px', textTransform: 'none', boxShadow: 'none', fontSize: '1rem', '&:hover': { bgcolor: '#1c4cc7' } }}
            >
              MUA NGAY
            </Button>
          </Stack>

          <Divider />

          {/* ĐIỀU KHOẢN CAM KẾT DỊCH VỤ */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocalShippingIcon sx={{ color: '#2962ff' }} />
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#555' }}>Giao hàng nhanh toàn quốc</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <VerifiedUserIcon sx={{ color: '#2962ff' }} />
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#555' }}>Cam kết 100% chính hãng</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LoopIcon sx={{ color: '#2962ff' }} />
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#555' }}>Đổi trả dễ dàng trong 7 ngày</Typography>
            </Box>
          </Box>

        </Box>
      </Box>
    </Box>
  );
}
