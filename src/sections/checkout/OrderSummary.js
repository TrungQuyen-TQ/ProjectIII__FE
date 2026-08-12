import React from 'react';
import { Box, Paper, Typography, Stack, Avatar, Divider, Button, TextField } from '@mui/material';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { getProductImageUrl } from '../../utils/imageHelper';

const COLORS = {
    primaryBlue: '#17479d',
    activeOrange: '#ff910d',
    borderGray: '#e0eaf5'
};

export default function OrderSummary({
    cartItems,
    subTotal,
    shippingFee,
    taxes,
    discountAmount = 0,
    grandTotal,
    formatPrice,
    couponCode = '',
    setCouponCode,
    onApplyCoupon,
    onRemoveCoupon,
    appliedCoupon = null,
    couponError = ''
}) {
    return (
        <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', border: `1px solid ${COLORS.borderGray}`, bgcolor: '#ffffff' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <ShoppingBagIcon sx={{ color: COLORS.activeOrange, fontSize: '1.5rem' }} />
                <Typography variant="h6" sx={{ color: COLORS.primaryBlue, fontWeight: 800, textTransform: 'uppercase', fontSize: '1rem', letterSpacing: '0.5px' }}>
                    3. Đơn hàng của bạn
                </Typography>
            </Box>

            {/* Danh sách sản phẩm */}
            <Stack spacing={2.5} sx={{ mb: 3, maxHeight: '300px', overflowY: 'auto', pr: 1 }}>
                {cartItems.map((item) => {
                    const itemQty = item.qty || item.quantity || 1;
                    return (
                        <Box key={item.id} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <Avatar src={getProductImageUrl(item.image)} variant="rounded" sx={{ width: 56, height: 56, border: '1px solid #f0f0f0' }} />
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="body2" sx={{ fontWeight: 700, color: '#333', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.3 }}>
                                    {item.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Phân loại: {item.variant || 'Mặc định'} | Qty: {itemQty}
                                </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: COLORS.primaryBlue }}>
                                {formatPrice(item.price * itemQty)}
                            </Typography>
                        </Box>
                    );
                })}
            </Stack>

            <Divider sx={{ mb: 3 }} />

            {/* Mã giảm giá (Coupon) */}
            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                <TextField
                    size="small"
                    placeholder="Nhập mã giảm giá..."
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={Boolean(appliedCoupon)}
                    fullWidth
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '8px'
                        }
                    }}
                />
                <Button
                    variant={appliedCoupon ? "outlined" : "contained"}
                    color={appliedCoupon ? "error" : "primary"}
                    onClick={appliedCoupon ? onRemoveCoupon : onApplyCoupon}
                    sx={{
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 700,
                        px: 3,
                        bgcolor: appliedCoupon ? 'transparent' : COLORS.primaryBlue,
                        borderColor: appliedCoupon ? 'error.main' : 'transparent',
                        boxShadow: 'none',
                        whiteSpace: 'nowrap',
                        '&:hover': {
                            bgcolor: appliedCoupon ? 'rgba(211, 47, 47, 0.04)' : '#0f3170',
                            boxShadow: 'none'
                        }
                    }}
                >
                    {appliedCoupon ? "Hủy" : "Áp dụng"}
                </Button>
            </Box>
            {couponError && (
                <Typography variant="caption" color="error" sx={{ display: 'block', mt: -2, mb: 2, ml: 0.5 }}>
                    {couponError}
                </Typography>
            )}
            {appliedCoupon && (
                <Typography variant="caption" sx={{ color: 'success.main', display: 'block', mt: -2, mb: 2, ml: 0.5, fontWeight: 700 }}>
                    Đã áp dụng mã: {appliedCoupon.code}
                </Typography>
            )}

            <Divider sx={{ mb: 3 }} />

            {/* Bảng tính chi phí */}
            <Stack spacing={2} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Tạm tính</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatPrice(subTotal)}</Typography>
                </Box>
                {discountAmount > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>Giảm giá (Coupon)</Typography>
                        <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>-{formatPrice(discountAmount)}</Typography>
                    </Box>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Phí vận chuyển</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatPrice(shippingFee)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Thuế (VAT 8%)</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatPrice(taxes)}</Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Tổng tiền thanh toán</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: COLORS.activeOrange }}>{formatPrice(grandTotal)}</Typography>
                </Box>
            </Stack>

            {/* Nút thanh toán */}
            <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{
                    bgcolor: COLORS.primaryBlue,
                    fontWeight: 700,
                    py: 1.8,
                    borderRadius: '8px',
                    fontSize: '1rem',
                    textTransform: 'none',
                    boxShadow: 'none',
                    '&:hover': { bgcolor: '#0f3170', boxShadow: 'none' }
                }}
            >
                Đặt hàng ngay ({formatPrice(grandTotal)})
            </Button>
        </Paper>
    );
}
