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

  useEffect(() => {
    if (product && Array.isArray(product.attributes) && product.attributes.length > 0) {
      // Find first variant in stock, or fallback to first variant
      const defaultVariant = (product.variants || []).find(v => v.stock > 0) || (product.variants || [])[0];
      if (defaultVariant && defaultVariant.attributes) {
        setSelectedAttributes({ ...defaultVariant.attributes });
        setSelectedVariant(defaultVariant);
        const img = defaultVariant.image || defaultVariant.thumbnail || (defaultVariant.images && defaultVariant.images[0]);
        if (img) {
          setActiveThumb(img);
        }
      } else {
        const initialAttrs = {};
        product.attributes.forEach(attr => {
          initialAttrs[attr.code] = attr.values[0] || '';
        });
        setSelectedAttributes(initialAttrs);
        setSelectedVariant(null);
      }
    } else {
      setSelectedVariant(null);
      setSelectedAttributes({});
    }
    setQty(1);
  }, [product, setActiveThumb]);

  const getAttributeButtonState = (attrCode, value) => {
    if (selectedAttributes[attrCode] === value) {
      return 'active';
    }

    const targetSelection = { ...selectedAttributes, [attrCode]: value };
    const matchingVariants = (product.variants || []).filter(v =>
      v && v.attributes && Object.entries(targetSelection).every(([k, val]) => v.attributes[k] === val)
    );

    if (matchingVariants.length > 0) {
      const hasStock = matchingVariants.some(v => v.stock > 0);
      return hasStock ? 'normal' : 'oos';
    }

    return 'disabled';
  };

  const [brandName, setBrandName] = useState('');

  const handleSelectAttribute = (attrCode, value) => {
    const state = getAttributeButtonState(attrCode, value);
    if (state === 'disabled') {
      return;
    }

    const newSelection = { ...selectedAttributes, [attrCode]: value };
    setSelectedAttributes(newSelection);

    const matchingVariant = (product.variants || []).find(v =>
      v && v.attributes && Object.entries(newSelection).every(([k, val]) => v.attributes[k] === val)
    );

    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
      const img = matchingVariant.image || matchingVariant.thumbnail || (matchingVariant.images && matchingVariant.images[0]);
      if (img) {
        setActiveThumb(img);
      }
    } else {
      setSelectedVariant(null);
    }
  };

  const getSelectedVariantText = () => {
    if (product && Array.isArray(product.attributes) && product.attributes.length > 0 && selectedVariant) {
      return Object.entries(selectedVariant.attributes || {})
        .map(([k, v]) => {
          const attrDef = product.attributes.find(a => a.code === k);
          const label = attrDef ? attrDef.name : k;
          return `${label}: ${v}`;
        })
        .join(', ');
    }
    return '';
  };

  const isOutOfStock = product && Array.isArray(product.attributes) && product.attributes.length > 0
    ? (selectedVariant ? selectedVariant.stock <= 0 : true)
    : (product ? product.stock <= 0 : false);

  const displayStock = selectedVariant ? selectedVariant.stock : (product ? product.stock : 0);

  const handleAddToCart = () => {
    const variantText = getSelectedVariantText();
    const productToCart = {
      ...product,
      price: selectedVariant ? selectedVariant.price : product.price,
      sku: selectedVariant ? selectedVariant.sku : product.sku,
      productVariantId: selectedVariant ? selectedVariant.id : null,
      image: selectedVariant && (selectedVariant.image || selectedVariant.thumbnail || (selectedVariant.images && selectedVariant.images[0]))
        ? (selectedVariant.image || selectedVariant.thumbnail || selectedVariant.images[0])
        : (product.image || product.thumbnail)
    };
    dispatch(addToCart({ product: productToCart, quantity: qty, variant: variantText }));
    toast.success('Đã thêm sản phẩm vào giỏ hàng!');
  };

  const handleBuyNow = () => {
    const variantText = getSelectedVariantText();
    const productToCart = {
      ...product,
      price: selectedVariant ? selectedVariant.price : product.price,
      sku: selectedVariant ? selectedVariant.sku : product.sku,
      productVariantId: selectedVariant ? selectedVariant.id : null,
      image: selectedVariant && (selectedVariant.image || selectedVariant.thumbnail || (selectedVariant.images && selectedVariant.images[0]))
        ? (selectedVariant.image || selectedVariant.thumbnail || selectedVariant.images[0])
        : (product.image || product.thumbnail)
    };
    dispatch(addToCart({ product: productToCart, quantity: qty, variant: variantText }));
    router.push('/cart');
  };

  const displayImage = getProductImageUrl(activeThumb || product.image || product.thumbnail);

  const displayPrice = selectedVariant
    ? `${selectedVariant.price.toLocaleString('vi-VN')}đ`
    : (typeof product.price === 'number' ? `${product.price.toLocaleString('vi-VN')}đ` : product.price);

  const displayOriginalPrice = selectedVariant
    ? (selectedVariant.originalPrice ? `${selectedVariant.originalPrice.toLocaleString('vi-VN')}đ` : null)
    : (typeof product.originalPrice === 'number' ? `${product.originalPrice.toLocaleString('vi-VN')}đ` : product.originalPrice);

  const displaySku = selectedVariant
    ? selectedVariant.sku
    : product.sku;

  const getButtonStyle = (state) => {
    switch (state) {
      case 'active':
        return {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 700,
          px: 2.5,
          py: 1,
          border: '2px solid #17479d',
          backgroundColor: '#f0f4fa',
          color: '#17479d',
          boxShadow: '0 0 0 1px #17479d, 0 3px 10px rgba(23, 71, 157, 0.15)',
          transform: 'scale(1.02)',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: '#e3ecf8',
            borderColor: '#17479d'
          }
        };
      case 'oos':
        return {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 500,
          px: 2.5,
          py: 1,
          border: '1.5px solid #d0d0d0',
          backgroundImage: 'linear-gradient(135deg, transparent 48%, #c0c0c0 49%, #c0c0c0 51%, transparent 52%)',
          backgroundColor: '#fafafa',
          color: '#9e9e9e',
          opacity: 0.65,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: '#f0f0f0',
            borderColor: '#9e9e9e',
            opacity: 0.85
          }
        };
      case 'disabled':
        return {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 500,
          px: 2.5,
          py: 1,
          border: '1.5px dashed #e0e0e0',
          backgroundColor: '#f5f5f5',
          color: '#bdbdbd',
          cursor: 'not-allowed',
          pointerEvents: 'none',
          opacity: 0.4
        };
      case 'normal':
      default:
        return {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 600,
          px: 2.5,
          py: 1,
          border: '1.5px solid #e0e0e0',
          backgroundColor: 'white',
          color: '#424242',
          transition: 'all 0.2s ease',
          '&:hover': {
            borderColor: '#17479d',
            backgroundColor: 'rgba(23, 71, 157, 0.04)',
            color: '#17479d',
            transform: 'translateY(-1px)'
          }
        };
    }
  };

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
          <Stack direction="row" spacing={1.5} sx={{ overflowX: 'auto', pb: 1 }}>
            {displayThumbnails.map((thumb, idx) => (
              <Box
                key={idx}
                onClick={() => setActiveThumb(thumb)}
                sx={{
                  width: 70, height: 70,
                  borderRadius: '8px',
                  border: getProductImageUrl(activeThumb || displayImage) === thumb ? '2px solid #17479d' : '1.5px solid #e0e0e0',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: '#17479d',
                    transform: 'scale(1.05)'
                  }
                }}
              >
                <Box component="img" src={thumb} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </Box>
            ))}
          </Stack>
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
          <Box sx={{
            background: 'linear-gradient(90deg, #f5f8ff 0%, #edf2ff 100%)',
            p: 3,
            borderRadius: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
            border: '1px solid #d2e4ff',
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.02)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: 1.5 }}>
              <Typography sx={{ color: '#17479d', fontWeight: 800, fontSize: { xs: '1.8rem', md: '2.5rem' } }}>
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

          {/* LỰA CHỌN BIẾN THỂ ĐỘNG (DỰA TRÊN ATTRIBUTES VÀ VARIANTS) */}
          {product && Array.isArray(product.attributes) && product.attributes.length > 0 && (
            <Box sx={{ mb: 4 }}>
              {product.attributes.map((attr) => (
                <Box key={attr.code} sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: '#333' }}>
                    {attr.name}:
                  </Typography>
                  <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
                    {attr.values.map((val) => {
                      const state = getAttributeButtonState(attr.code, val);
                      return (
                        <Button
                          key={val}
                          variant="outlined"
                          size="medium"
                          onClick={() => handleSelectAttribute(attr.code, val)}
                          sx={getButtonStyle(state)}
                        >
                          {val}
                        </Button>
                      );
                    })}
                  </Stack>
                </Box>
              ))}
            </Box>
          )}

          {/* CHỌN SỐ LƯỢNG */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: '#333' }}>
              Số lượng: <span style={{ fontWeight: 400, color: '#666', marginLeft: '8px' }}>
                (Kho: {isOutOfStock ? "Hết hàng" : displayStock})
              </span>
            </Typography>
            <Box sx={{ display: 'inline-flex', border: '1px solid #e0e0e0', borderRadius: '4px', overflow: 'hidden', opacity: isOutOfStock ? 0.5 : 1, pointerEvents: isOutOfStock ? 'none' : 'auto' }}>
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
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              sx={{
                py: 1.5,
                borderColor: '#17479d',
                color: '#17479d',
                fontWeight: 700,
                borderRadius: '8px',
                textTransform: 'none',
                fontSize: '1rem',
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: '#f0f4fa',
                  borderColor: '#17479d',
                  transform: 'translateY(-1px)'
                },
                '&:active': {
                  transform: 'translateY(1px)'
                }
              }}
            >
              THÊM VÀO GIỎ HÀNG
            </Button>
            <Button
              fullWidth
              variant="contained"
              disabled={isOutOfStock}
              startIcon={<ShoppingBagIcon />}
              onClick={handleBuyNow}
              sx={{
                py: 1.5,
                background: isOutOfStock ? '#ccc' : 'linear-gradient(135deg, #2962ff 0%, #17479d 100%)',
                color: 'white',
                fontWeight: 700,
                borderRadius: '8px',
                textTransform: 'none',
                boxShadow: isOutOfStock ? 'none' : '0 4px 14px rgba(23, 71, 157, 0.3)',
                fontSize: '1rem',
                transition: 'all 0.2s',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1c4cc7 0%, #0f347a 100%)',
                  boxShadow: '0 6px 20px rgba(23, 71, 157, 0.4)',
                  transform: 'translateY(-1px)'
                },
                '&:active': {
                  transform: 'translateY(1px)'
                }
              }}
            >
              {isOutOfStock ? "TẠM HẾT HÀNG" : "MUA NGAY"}
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
