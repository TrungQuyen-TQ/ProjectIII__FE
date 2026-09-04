import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Stepper, Step, StepLabel, Divider, Grid, Stack, Avatar, Chip, CircularProgress, Button, Rating, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import HomeIcon from '@mui/icons-material/Home';
import PhoneIcon from '@mui/icons-material/Phone';
import PaymentIcon from '@mui/icons-material/Payment';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import toast from 'react-hot-toast';
import feedbackService from '../../services/feedbackService';
import productService from '../../services/productService';
import { getProductImageUrl } from '../../utils/imageHelper';

function OrderItemAvatar({ item, productId }) {
    const [imageUrl, setImageUrl] = useState('/images/placeholder.png');

    useEffect(() => {
        const directImg = item?.imageUrl || item?.ImageUrl || item?.product?.imageUrl || item?.product?.thumbnail || item?.variant?.image || item?.variant?.thumbnail;
        if (directImg) {
            setImageUrl(getProductImageUrl(directImg));
            return;
        }

        const targetProductId = item?.productId || item?.ProductId || productId;
        const fetchProductImage = async () => {
            if (!targetProductId) return;
            try {
                const productDetail = await productService.getProductById(targetProductId);
                if (productDetail) {
                    // Ưu tiên tìm ảnh từ biến thể khớp trong productDetail.variants
                    const variantId = item?.variantId || item?.productVariantId || item?.ProductVariantId;
                    const variantSku = item?.variantName || item?.variantSku;
                    let img = null;

                    if (Array.isArray(productDetail.variants) && productDetail.variants.length > 0) {
                        const matchedVariant = productDetail.variants.find(v => 
                            (variantId && v.id === variantId) || 
                            (variantSku && (v.sku === variantSku || v.sku?.toLowerCase() === variantSku?.toLowerCase()))
                        );
                        if (matchedVariant) {
                            img = matchedVariant.image || matchedVariant.thumbnail || matchedVariant.images?.[0];
                        }
                    }

                    // Nếu biến thể không có ảnh riêng, lấy ảnh sản phẩm gốc
                    if (!img) {
                        img = productDetail.thumbnail || productDetail.Thumbnail || productDetail.image || productDetail.images?.[0];
                    }

                    if (img) {
                        setImageUrl(getProductImageUrl(img));
                    }
                }
            } catch (err) {
                console.error("Lỗi khi tải ảnh sản phẩm đơn hàng:", err);
            }
        };
        fetchProductImage();
    }, [item, productId]);

    return (
        <Avatar
            variant="rounded"
            src={imageUrl}
            sx={{ width: 48, height: 48, border: '1px solid #eee' }}
        />
    );
}

function formatAttributeKey(key) {
    if (!key) return '';
    let clean = String(key).replace(/["\\]/g, '').trim();
    const lower = clean.toLowerCase();
    
    if (lower === 'color_bia' || lower === 'colorbia' || lower === 'mau_bia') return 'Màu bìa';
    if (lower === 'kieu_ruot' || lower === 'kieuruot') return 'Kiểu ruột';
    if (lower === 'color' || lower === 'mau_sac') return 'Màu sắc';
    if (lower === 'size' || lower === 'kich_thuoc') return 'Kích thước';
    if (lower === 'chat_lieu' || lower === 'material') return 'Chất liệu';
    
    clean = clean.replace(/_/g, ' ');
    return clean.charAt(0).toUpperCase() + clean.slice(1);
}

function renderItemVariantAndAttributes(item) {
    const rootProductName = item.productName || item.product?.name || 'Sản phẩm';
    const quantity = item.quantity || 1;
    const variantName = item.variantName || item.variant_name || item.variant?.name || item.variant?.sku;

    const attributeChips = [];
    const itemAttributes = item.attributes || item.variantAttributes || item.product?.attributes;

    if (itemAttributes) {
        if (typeof itemAttributes === 'object' && !Array.isArray(itemAttributes)) {
            Object.entries(itemAttributes).forEach(([k, v]) => {
                const labelKey = formatAttributeKey(k);
                const valStr = Array.isArray(v) ? v.join(', ') : String(v);
                if (labelKey && valStr) {
                    attributeChips.push({ key: labelKey, value: valStr });
                }
            });
        } else if (Array.isArray(itemAttributes)) {
            itemAttributes.forEach(attr => {
                const keyName = attr.name ? formatAttributeKey(attr.name) : formatAttributeKey(attr.code);
                const valStr = Array.isArray(attr.values) ? attr.values.join(', ') : (attr.value || '');
                if (keyName && valStr) {
                    attributeChips.push({ key: keyName, value: valStr });
                }
            });
        }
    }

    return (
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            {/* Tên sản phẩm gốc */}
            <Typography variant="body2" sx={{ fontWeight: 800, color: '#1e293b', mb: 0.6, lineHeight: 1.3 }}>
                {rootProductName}
            </Typography>

            {/* Thẻ phân loại & Thuộc tính */}
            <Stack direction="row" spacing={0.8} alignItems="center" flexWrap="wrap" useFlexGap sx={{ rowGap: 0.8 }}>
                <Chip 
                    label={`SL: ${quantity}`} 
                    size="small" 
                    sx={{ 
                        bgcolor: '#f1f5f9', 
                        color: '#334155', 
                        fontWeight: 700, 
                        fontSize: '0.72rem', 
                        height: 22,
                        borderRadius: '4px',
                        border: '1px solid #cbd5e1'
                    }} 
                />

                {variantName && (
                    <Chip
                        label={`Phân loại: ${variantName}`}
                        size="small"
                        sx={{
                            bgcolor: '#fff7ed',
                            color: '#c2410c',
                            border: '1px solid #ffedd5',
                            fontWeight: 600,
                            fontSize: '0.72rem',
                            height: 22,
                            borderRadius: '4px'
                        }}
                    />
                )}

                {attributeChips.map((attr, i) => (
                    <Chip
                        key={i}
                        label={`${attr.key}: ${attr.value}`}
                        size="small"
                        sx={{
                            bgcolor: '#eff6ff',
                            color: '#1d4ed8',
                            border: '1px solid #bfdbfe',
                            fontWeight: 600,
                            fontSize: '0.72rem',
                            height: 22,
                            borderRadius: '4px'
                        }}
                    />
                ))}
            </Stack>
        </Box>
    );
}

export default function OrderDetailSection({ selectedOrder, loadingDetails, COLORS, getStatusLabel, trackingSteps, onCancelOrder }) {
    const [feedbackOpen, setFeedbackOpen] = useState(false);
    const [selectedItemForFeedback, setSelectedItemForFeedback] = useState(null);
    const [rating, setRating] = useState(5);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [submittingFeedback, setSubmittingFeedback] = useState(false);

    const handleOpenFeedback = (item) => {
        setSelectedItemForFeedback(item);
        setRating(5);
        setTitle('');
        setContent('');
        setFeedbackOpen(true);
    };

    const handleCloseFeedback = () => {
        setFeedbackOpen(false);
        setSelectedItemForFeedback(null);
    };

    const handleSubmitFeedback = async (e) => {
        e.preventDefault();
        if (!selectedItemForFeedback) return;

        setSubmittingFeedback(true);
        try {
            const dto = {
                productId: selectedItemForFeedback.productId,
                orderItemId: selectedItemForFeedback.orderItemId,
                rating: rating,
                title: title.trim() || undefined,
                content: content.trim() || undefined,
                images: []
            };

            const res = await feedbackService.createFeedback(dto);
            if (res.success) {
                toast.success("Gửi đánh giá thành công!");
                if (selectedOrder) {
                    const targetId = selectedItemForFeedback.orderItemId || selectedItemForFeedback.id;
                    const updateItemsList = (list) => (list || []).map(i => {
                        if (i.orderItemId === targetId || i.id === targetId) {
                            return { ...i, isReviewed: true, IsReviewed: true };
                        }
                        return i;
                    });
                    if (selectedOrder.items) selectedOrder.items = updateItemsList(selectedOrder.items);
                    if (selectedOrder.orderDetails) selectedOrder.orderDetails = updateItemsList(selectedOrder.orderDetails);
                }
                handleCloseFeedback();
            } else {
                toast.error(res.error || "Gửi đánh giá thất bại.");
            }
        } catch (err) {
            toast.error("Đã xảy ra lỗi khi gửi đánh giá.");
        } finally {
            setSubmittingFeedback(false);
        }
    };

    if (loadingDetails) {
        return (
            <Box sx={{ flexGrow: 1, width: { xs: '100%', md: '66.667%' }, minWidth: 0 }}>
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        borderRadius: '16px',
                        border: '1px solid #e0eaf5',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: 400,
                        bgcolor: '#ffffff'
                    }}
                >
                    <CircularProgress />
                </Paper>
            </Box>
        );
    }

    return (
        <Box sx={{ flex: 1, width: '100%', minWidth: 0 }}>
            {selectedOrder ? (
                <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: '16px', border: '1px solid #e0eaf5', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>

                    {/* Header chi tiết */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', mb: 4, gap: 2 }}>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: COLORS.primaryBlue }}>
                                Chi tiết đơn hàng: #{selectedOrder.orderCode || selectedOrder.id}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Ngày đặt: {new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                disabled={selectedOrder.orderStatusName !== 'Mới'}
                                onClick={onCancelOrder}
                                sx={{
                                    fontWeight: 700,
                                    borderRadius: '8px',
                                    textTransform: 'none',
                                    '&.Mui-disabled': {
                                        color: '#9e9e9e',
                                        borderColor: '#e0e0e0',
                                        bgcolor: '#f5f5f5'
                                    }
                                }}
                            >
                                Hủy đơn hàng
                            </Button>
                        </Box>
                    </Box>

                    <Divider sx={{ mb: 4 }} />

                    {/* STEPPER TRẠNG THÁI */}
                    {(() => {
                        const statusInfo = getStatusLabel(selectedOrder);
                        const isCancelled = selectedOrder.orderStatus === 4 || selectedOrder.orderStatus === 'CANCELLED' || selectedOrder.orderStatusName === 'Đã hủy';
                        const isReturned = selectedOrder.orderStatusName === 'Trả hàng';

                        if (isCancelled) {
                            return (
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, bgcolor: '#fdf2f2', p: 2, borderRadius: '8px', mb: 5 }}>
                                    <CancelIcon sx={{ color: COLORS.error }} />
                                    <Typography sx={{ color: COLORS.error, fontWeight: 700 }}>
                                        Đơn hàng này đã bị hủy.
                                    </Typography>
                                </Box>
                            );
                        }

                        if (isReturned) {
                            return (
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, bgcolor: '#fdf2f2', p: 2, borderRadius: '8px', mb: 5 }}>
                                    <CancelIcon sx={{ color: COLORS.error }} />
                                    <Typography sx={{ color: COLORS.error, fontWeight: 700 }}>
                                        Đơn hàng này đã được trả lại hệ thống.
                                    </Typography>
                                </Box>
                            );
                        }

                        return (
                            <Box sx={{ width: '100%', mb: 5 }}>
                                <Stepper activeStep={statusInfo.stepIndex} alternativeLabel>
                                    {trackingSteps.map((label, index) => (
                                        <Step key={label}>
                                            <StepLabel
                                                sx={{
                                                    '& .MuiStepIcon-root': {
                                                        color: '#e0e0e0',
                                                        '&.Mui-active': { color: COLORS.success },
                                                        '&.Mui-completed': { color: COLORS.success }
                                                    }
                                                }}
                                            >
                                                <Typography sx={{ fontWeight: index === statusInfo.stepIndex ? 800 : 500, color: index <= statusInfo.stepIndex ? '#333' : '#999', mt: 0.5, fontSize: '0.85rem' }}>
                                                    {label}
                                                </Typography>
                                            </StepLabel>
                                        </Step>
                                    ))}
                                </Stepper>
                            </Box>
                        );
                    })()}

                    {/* CHI TIẾT SẢN PHẨM & NGƯỜI NHẬN */}
                    <Stack spacing={3} sx={{ width: '100%' }}>

                        {/* Thông tin giao nhận */}
                        <Box sx={{ bgcolor: '#f8fafc', p: 3, borderRadius: '12px', border: '1px solid #eef2f6' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2, color: COLORS.primaryBlue, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <ReceiptLongIcon sx={{ fontSize: '1.2rem' }} /> THÔNG TIN GIAO NHẬN
                            </Typography>

                            <Stack spacing={1.5}>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                    <HomeIcon sx={{ color: COLORS.textMuted, fontSize: '1.1rem', mt: 0.2 }} />
                                    <Box>
                                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                            {selectedOrder.receiverName}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" display="block">
                                            {selectedOrder.fullAddress || [
                                                selectedOrder.address,
                                                selectedOrder.ward,
                                                selectedOrder.district,
                                                selectedOrder.province
                                            ].filter(Boolean).join(', ')}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <PhoneIcon sx={{ color: COLORS.textMuted, fontSize: '1.1rem' }} />
                                    <Typography variant="body2">
                                        {selectedOrder.phone}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <PaymentIcon sx={{ color: COLORS.textMuted, fontSize: '1.1rem' }} />
                                    <Typography variant="body2">
                                        Phương thức thanh toán: <strong>{(!selectedOrder.paymentMethodName || selectedOrder.paymentMethodName === 'Không xác định') ? 'Thanh toán khi nhận hàng (COD)' : selectedOrder.paymentMethodName}</strong>
                                    </Typography>
                                </Box>

                                {selectedOrder.note && (
                                    <Box sx={{ bgcolor: '#fff', p: 1.5, borderRadius: '8px', border: '1px solid #eef2f6' }}>
                                        <Typography variant="caption" color="text.secondary">
                                            Ghi chú: {selectedOrder.note}
                                        </Typography>
                                    </Box>
                                )}
                            </Stack>
                        </Box>

                        {/* Danh sách mặt hàng */}
                        <Box sx={{ bgcolor: '#f8fafc', p: 3, borderRadius: '12px', border: '1px solid #eef2f6' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2, color: COLORS.primaryBlue, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <ShoppingBagIcon sx={{ fontSize: '1.2rem' }} /> SẢN PHẨM CỦA BẠN
                            </Typography>

                            <Stack spacing={2} sx={{ maxHeight: 320, overflowY: 'auto', pr: 1 }}>
                                {(selectedOrder.items || selectedOrder.orderDetails || []).map((item, idx) => (
                                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 2, bgcolor: '#ffffff', p: 2, borderRadius: '10px', border: '1px solid #eef2f6', flexWrap: 'wrap' }}>
                                        <OrderItemAvatar item={item} productId={item.productId} />
                                        
                                        {renderItemVariantAndAttributes(item)}

                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: COLORS.primaryBlue }}>
                                                {(item.unitPrice || item.price || 0).toLocaleString('vi-VN')} VNĐ
                                            </Typography>
                                            {(selectedOrder.orderStatusName === 'Hoàn thành' || selectedOrder.orderStatusName === 'Hoàn tất' || selectedOrder.orderStatus === 3 || selectedOrder.orderStatus === 'COMPLETED') && (() => {
                                                const reviewed = Boolean(item.isReviewed || item.IsReviewed || item.is_reviewed);
                                                return (
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        disabled={reviewed}
                                                        onClick={() => {
                                                            if (!reviewed) handleOpenFeedback(item);
                                                        }}
                                                        sx={{
                                                            bgcolor: reviewed ? '#e2e8f0' : COLORS.activeOrange,
                                                            color: reviewed ? '#94a3b8' : 'white',
                                                            textTransform: 'none',
                                                            fontWeight: 700,
                                                            fontSize: '0.75rem',
                                                            borderRadius: '6px',
                                                            boxShadow: 'none',
                                                            '&:hover': { bgcolor: reviewed ? '#e2e8f0' : '#e07d00', boxShadow: 'none' },
                                                            '&.Mui-disabled': {
                                                                bgcolor: '#e2e8f0',
                                                                color: '#94a3b8'
                                                            }
                                                        }}
                                                    >
                                                        {reviewed ? 'Đã đánh giá' : 'Đánh giá'}
                                                    </Button>
                                                );
                                            })()}
                                        </Stack>
                                    </Box>
                                ))}
                            </Stack>
                        </Box>
                    </Stack>

                    {/* Tổng kết tiền bạc */}
                    <Paper elevation={0} sx={{ mt: 3, p: 3, bgcolor: '#fff8f2', borderRadius: '12px', border: `1px dashed ${COLORS.activeOrange}` }}>
                        <Stack spacing={1}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">Tổng tiền hàng:</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                    {((selectedOrder.total || 0) - (selectedOrder.shippingFee || 0)).toLocaleString('vi-VN')} VNĐ
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">Phí vận chuyển:</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                    {(selectedOrder.shippingFee || 0).toLocaleString('vi-VN')} VNĐ
                                </Typography>
                            </Box>
                            {selectedOrder.discountAmount > 0 && (
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">Giảm giá:</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: COLORS.error }}>
                                        -{selectedOrder.discountAmount.toLocaleString('vi-VN')} VNĐ
                                    </Typography>
                                </Box>
                            )}
                            <Divider sx={{ my: 1 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: COLORS.primaryBlue }}>Tổng Thanh Toán:</Typography>
                                <Typography variant="h6" sx={{ fontWeight: 800, color: COLORS.activeOrange }}>
                                    {(selectedOrder.total || 0).toLocaleString('vi-VN')} VNĐ
                                </Typography>
                            </Box>
                        </Stack>
                    </Paper>

                </Paper>
            ) : (
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        borderRadius: '16px',
                        border: '1px solid #e0eaf5',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: 300,
                        bgcolor: '#ffffff'
                    }}
                >
                    <Typography variant="body1" color="text.secondary">
                        Chọn một đơn hàng để xem chi tiết
                    </Typography>
                </Paper>
            )}

            {/* POPUP ĐÁNH GIÁ SẢN PHẨM */}
            <Dialog
                open={feedbackOpen}
                onClose={handleCloseFeedback}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { borderRadius: '16px', p: 1 } }}
            >
                <DialogTitle sx={{ fontWeight: 800, color: COLORS.primaryBlue, pb: 1 }}>
                    Đánh Giá Sản Phẩm
                </DialogTitle>
                <form onSubmit={handleSubmitFeedback}>
                    <DialogContent dividers>
                        <Stack spacing={3} sx={{ py: 1, alignItems: 'center' }}>
                            {selectedItemForFeedback && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', mb: 1 }}>
                                    <Avatar
                                        variant="rounded"
                                        src={getProductImageUrl(selectedItemForFeedback.imageUrl || selectedItemForFeedback.ImageUrl || selectedItemForFeedback.product?.imageUrl || selectedItemForFeedback.product?.thumbnail || '/images/placeholder.png')}
                                        sx={{ width: 60, height: 60, border: '1px solid #eee' }}
                                    />
                                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1e293b' }}>
                                            {selectedItemForFeedback.productName || selectedItemForFeedback.product?.name || 'Sản phẩm'}
                                        </Typography>
                                        {(selectedItemForFeedback.variantName || selectedItemForFeedback.attributes) && (
                                            <Typography variant="caption" color="text.secondary" display="block">
                                                {selectedItemForFeedback.variantName ? `Phân loại: ${selectedItemForFeedback.variantName}` : ''}
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                            )}

                            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body2" sx={{ fontWeight: 700, color: '#333' }}>
                                    Mức độ hài lòng của bạn
                                </Typography>
                                <Rating
                                    value={rating}
                                    onChange={(event, newValue) => {
                                        setRating(newValue || 5);
                                    }}
                                    size="large"
                                    sx={{ color: '#ffb400' }}
                                />
                            </Box>

                            <TextField
                                fullWidth
                                label="Tiêu đề (Tùy chọn)"
                                placeholder="Nhập tiêu đề đánh giá..."
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                            />

                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Nội dung đánh giá"
                                placeholder="Hãy chia sẻ trải nghiệm của bạn về sản phẩm này..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                            />
                        </Stack>
                    </DialogContent>
                    <DialogActions sx={{ px: 3, py: 2 }}>
                        <Button
                            onClick={handleCloseFeedback}
                            disabled={submittingFeedback}
                            sx={{ color: '#666', textTransform: 'none', fontWeight: 600 }}
                        >
                            Hủy bỏ
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={submittingFeedback}
                            sx={{
                                bgcolor: COLORS.activeOrange,
                                textTransform: 'none',
                                fontWeight: 700,
                                borderRadius: '8px',
                                px: 3,
                                boxShadow: 'none',
                                '&:hover': { bgcolor: '#e07d00', boxShadow: 'none' }
                            }}
                        >
                            {submittingFeedback ? 'Đang gửi...' : 'Gửi đánh giá'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
}
