import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { 
    Box, Container, Typography, Dialog, DialogContent, DialogContentText, DialogTitle, 
    Button, RadioGroup, FormControlLabel, Radio, FormControl, Paper, IconButton, Divider, TextField,
    DialogActions, Chip, CircularProgress
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HelpIcon from '@mui/icons-material/Help';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import MainLayout from '../layouts/MainLayout';
import toast from 'react-hot-toast';

import PaymentMethod from '../sections/checkout/PaymentMethod';
import OrderSummary from '../sections/checkout/OrderSummary';

import addressService from '../services/addressService';
import AddressFormDialog from '../sections/profile/AddressFormDialog';
import { clearCart } from '../redux/slices/cartSlice';

import paymentMethodService from '../services/paymentMethodService';
import deliveryMethodService from '../services/deliveryMethodService';
import couponService from '../services/couponService';
import orderService from '../services/orderService';

const COLORS = {
    primaryBlue: '#17479d',
    activeOrange: '#ff910d',
    bgLight: '#e5f2fb',
    success: '#2e7d32'
};

const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' VNĐ';
};

export default function CheckoutPage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { items: cartItems } = useSelector((state) => state.cart);
    // Sổ địa chỉ giao hàng
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [addressDialogOpen, setAddressDialogOpen] = useState(false);
    const [showAllAddresses, setShowAllAddresses] = useState(false);
    const [loadingAddresses, setLoadingAddresses] = useState(true);
    
    // AddressFormDialog
    const [formDialogOpen, setFormDialogOpen] = useState(false);
    const [formDialogMode, setFormDialogMode] = useState('create');
    const [editingAddress, setEditingAddress] = useState(null);
    const [tempSelectedAddressId, setTempSelectedAddressId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [confirmDeleteAddress, setConfirmDeleteAddress] = useState(null);

    const [formData, setFormData] = useState({
        notes: ''
    });

    const loadAddresses = async () => {
        setLoadingAddresses(true);
        try {
            const data = await addressService.getMyAddresses();
            const list = Array.isArray(data) ? data : [];
            setAddresses(list);
            
            if (list.length > 0) {
                const defaultAddr = list.find(a => a.isDefault) || list[0];
                setSelectedAddress(defaultAddr);
                setTempSelectedAddressId(defaultAddr.id);
            } else {
                setSelectedAddress(null);
                setTempSelectedAddressId(null);
            }
        } catch (err) {
            console.error("Lỗi khi tải sổ địa chỉ:", err);
        } finally {
            setLoadingAddresses(false);
        }
    };

    const [paymentMethods, setPaymentMethods] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('');

    const [deliveryMethods, setDeliveryMethods] = useState([]);
    const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState('');

    // Coupon states
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponError, setCouponError] = useState('');
    const [discountAmount, setDiscountAmount] = useState(0);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [createdOrder, setCreatedOrder] = useState(null);
    const [qrDialogOpen, setQrDialogOpen] = useState(false);

    // Tính toán số tiền đơn hàng
    const subTotal = cartItems.reduce((sum, item) => sum + item.price * (item.qty || item.quantity || 1), 0);
    const selectedDelivery = deliveryMethods.find(d => d.id === selectedDeliveryMethod);
    const shippingFee = selectedDelivery ? (selectedDelivery.shippingFee || selectedDelivery.ShippingFee || 0) : 0;
    const taxes = Math.round((subTotal - discountAmount) * 0.08);
    const grandTotal = Math.max(0, subTotal + shippingFee + taxes - discountAmount);

    const [mounted, setMounted] = useState(false);

    // 1. Set mounted
    useEffect(() => {
        setMounted(true);
    }, []);

    // 2b. Tải sổ địa chỉ
    useEffect(() => {
        if (user) {
            loadAddresses();
        }
    }, [user]);

    // Bảo vệ trang: Chuyển hướng đăng nhập nếu chưa có user
    useEffect(() => {
        if (mounted && !user) {
            toast.error("Vui lòng đăng nhập để thanh toán!");
            router.push('/auth/login?redirect=/checkout');
        }
    }, [mounted, user, router]);

    // 2. Tải phương thức thanh toán và phương thức vận chuyển từ API (Chỉ gọi khi user đã sẵn sàng)
    useEffect(() => {
        if (!user) return;

        const loadMethods = async () => {
            try {
                const payData = await paymentMethodService.getAllPaymentMethods();
                setPaymentMethods(payData || []);
                if (payData && payData.length > 0) {
                    setPaymentMethod(payData[0].id);
                }

                const delData = await deliveryMethodService.getAllDeliveryMethods();
                setDeliveryMethods(delData || []);
                if (delData && delData.length > 0) {
                    setSelectedDeliveryMethod(delData[0].id);
                }
            } catch (err) {
                console.error("Lỗi tải phương thức thanh toán/vận chuyển:", err);
            }
        };
        loadMethods();
    }, [user]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Áp dụng Coupon
    const handleApplyCoupon = async () => {
        setCouponError('');
        if (!couponCode.trim()) {
            setCouponError('Vui lòng nhập mã giảm giá.');
            return;
        }

        try {
            const res = await couponService.getAllCoupons(1, 100);
            const couponList = res.items || res.Items || [];
            
            const matched = couponList.find(c => c.code.toUpperCase() === couponCode.trim().toUpperCase());
            if (!matched) {
                setCouponError('Mã giảm giá không hợp lệ hoặc đã hết hạn.');
                setAppliedCoupon(null);
                setDiscountAmount(0);
                return;
            }
            
            const now = new Date();
            if (new Date(matched.startDate) > now || new Date(matched.endDate) < now) {
                setCouponError('Mã giảm giá đã hết hạn hoặc chưa đến thời gian áp dụng.');
                return;
            }
            
            if (matched.usedCount >= matched.quantity) {
                setCouponError('Mã giảm giá đã được sử dụng hết.');
                return;
            }
            
            if (subTotal < matched.minOrderAmount) {
                setCouponError(`Đơn hàng tối thiểu phải từ ${formatPrice(matched.minOrderAmount)} để áp dụng.`);
                return;
            }
            
            let calcDiscount = 0;
            if (matched.discountType === 'PERCENT') {
                calcDiscount = (subTotal * matched.discountValue) / 100;
                if (matched.maxDiscountAmount && calcDiscount > matched.maxDiscountAmount) {
                    calcDiscount = matched.maxDiscountAmount;
                }
            } else {
                calcDiscount = matched.discountValue;
            }
            
            setAppliedCoupon(matched);
            setDiscountAmount(calcDiscount);
            toast.success('Áp dụng mã giảm giá thành công!');
        } catch (error) {
            console.error(error);
            setCouponError('Có lỗi xảy ra khi kiểm tra mã giảm giá.');
        }
    };

    // Hủy Coupon
    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setDiscountAmount(0);
        setCouponCode('');
        setCouponError('');
        toast.success('Đã hủy áp dụng mã giảm giá.');
    };

    // Các hàm xử lý xóa địa chỉ có xác nhận
    const openDeleteConfirm = (address, e) => {
        if (e) e.stopPropagation();
        setConfirmDeleteAddress(address);
    };

    const closeDeleteConfirm = () => {
        if (deletingId) return;
        setConfirmDeleteAddress(null);
    };

    const handleConfirmDelete = async () => {
        if (!confirmDeleteAddress) return;
        const address = confirmDeleteAddress;
        try {
            setDeletingId(address.id);
            await addressService.deleteAddress(address.id);
            toast.success('Đã xóa địa chỉ.');
            
            if (selectedAddress && selectedAddress.id === address.id) {
                setSelectedAddress(null);
                setTempSelectedAddressId(null);
            }
            
            setConfirmDeleteAddress(null);
            await loadAddresses();
        } catch (err) {
            toast.error(err.response?.data || err.message || 'Không thể xóa địa chỉ này.');
        } finally {
            setDeletingId(null);
        }
    };

    // Mở Form Thêm Mới địa chỉ
    const handleOpenCreateAddress = () => {
        setFormDialogMode('create');
        setEditingAddress(null);
        setFormDialogOpen(true);
    };

    // Mở Form Sửa địa chỉ
    const handleOpenEditAddress = (addr) => {
        setFormDialogMode('edit');
        setEditingAddress(addr);
        setFormDialogOpen(true);
    };

    // Submit dialog address
    const handleSubmitFormDialog = async (dto) => {
        try {
            if (formDialogMode === 'edit' && editingAddress) {
                await addressService.updateAddress(editingAddress.id, dto);
                toast.success('Cập nhật địa chỉ thành công!');
            } else {
                await addressService.createAddress(dto);
                toast.success('Thêm địa chỉ mới thành công!');
            }
            setFormDialogOpen(false);
            setEditingAddress(null);
            await loadAddresses();
        } catch (err) {
            toast.error(err.response?.data || err.response?.data?.message || err.message || 'Có lỗi xảy ra, vui lòng thử lại.');
        }
    };

    const handlePreSubmitOrder = (e) => {
        e.preventDefault();
        
        if (cartItems.length === 0) {
            toast.error("Giỏ hàng của bạn đang trống!");
            return;
        }

        if (!selectedAddress) {
            toast.error("Vui lòng thêm và chọn địa chỉ giao hàng!");
            return;
        }

        setConfirmOpen(true);
    };

    const handleSubmitOrder = async () => {
        setConfirmOpen(false);

        const addressParts = (selectedAddress.provinceCity || '').split(',').map(s => s.trim());
        const districtName = addressParts[0] || '';
        const provinceName = addressParts[1] || districtName;

        const payload = {
            customerAddressId: selectedAddress.id,
            receiverName: selectedAddress.receiverName,
            phone: selectedAddress.phone,
            province: provinceName,
            district: districtName,
            ward: selectedAddress.wardCommune,
            address: selectedAddress.addressDetail,
            note: formData.notes || null,
            paymentMethodId: paymentMethod,
            deliveryMethodId: selectedDeliveryMethod || null,
            couponCode: appliedCoupon ? appliedCoupon.code : null,
            items: cartItems.map(item => ({
                productId: item.id,
                productVariantId: item.productVariantId || null,
                quantity: item.qty || item.quantity || 1
            }))
        };

        try {
            const loadingToast = toast.loading("Đang tiến hành đặt hàng...");
            const orderData = await orderService.createOrder(payload);
            toast.dismiss(loadingToast);
            dispatch(clearCart());
            setCreatedOrder(orderData);
            
            if (orderData && orderData.paymentQrUrl) {
                router.push({
                    pathname: '/QRPayment',
                    query: {
                        orderCode: orderData.orderCode,
                        total: orderData.total,
                        qrUrl: orderData.paymentQrUrl
                    }
                });
            } else {
                setOrderSuccess(true);
            }
        } catch (err) {
            console.error("Lỗi khi gửi đơn hàng lên server:", err);
            toast.error(err.response?.data?.message || err.message || "Đặt hàng thất bại. Vui lòng thử lại!");
        }
    };

    const handleCloseSuccess = () => {
        setOrderSuccess(false);
        router.push('/');
    };

    return (
        <MainLayout>
            <Head>
                <title>Thanh toán đơn hàng | Arts</title>
            </Head>

            <Box sx={{ bgcolor: COLORS.bgLight, minHeight: '100vh', py: { xs: 4, md: 6 } }}>
                <Container maxWidth="xl">

                    <Typography variant="h5" sx={{ fontWeight: 800, color: COLORS.primaryBlue, mb: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Thanh toán đơn hàng
                    </Typography>

                    <form onSubmit={handlePreSubmitOrder}>
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, alignItems: 'flex-start' }}>

                            {/* CỘT BÊN TRÁI: THÔNG TIN GIAO NHẬN & PHƯƠNG THỨC THANH TOÁN */}
                            <Box sx={{ width: { xs: '100%', md: '60%' }, display: 'flex', flexDirection: 'column', gap: 4, flexShrink: 0 }}>

                                <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', border: `1px solid ${COLORS.primaryBlue}20`, bgcolor: '#ffffff' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                        <Typography variant="h6" sx={{ color: '#333', fontWeight: 800, fontSize: '1.1rem' }}>
                                            Địa chỉ nhận hàng
                                        </Typography>
                                        {addresses.length > 0 && (
                                            <Button
                                                onClick={() => {
                                                    setTempSelectedAddressId(selectedAddress?.id);
                                                    setAddressDialogOpen(true);
                                                }}
                                                sx={{ textTransform: 'none', fontWeight: 600, color: '#1976d2' }}
                                            >
                                                Thay đổi
                                            </Button>
                                        )}
                                    </Box>

                                    {loadingAddresses ? (
                                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                            <CircularProgress size={28} sx={{ color: COLORS.primaryBlue }} />
                                        </Box>
                                    ) : selectedAddress ? (
                                        <Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                                                {selectedAddress.isDefault && (
                                                    <Chip
                                                        label="Mặc định"
                                                        size="small"
                                                        sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 700, borderRadius: '4px', height: 20, fontSize: '0.75rem' }}
                                                    />
                                                )}
                                                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#333' }}>
                                                    {selectedAddress.receiverName} - {selectedAddress.phone}
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                                                {selectedAddress.addressDetail}, {selectedAddress.wardCommune}, {selectedAddress.provinceCity}
                                            </Typography>
                                        </Box>
                                    ) : (
                                        <Box sx={{ py: 2, textAlign: 'center' }}>
                                            <Typography variant="body2" sx={{ color: '#888', mb: 2 }}>
                                                Bạn chưa có địa chỉ giao hàng nào.
                                            </Typography>
                                            <Button
                                                variant="outlined"
                                                onClick={handleOpenCreateAddress}
                                                startIcon={<AddIcon />}
                                                sx={{ textTransform: 'none', borderRadius: '8px' }}
                                            >
                                                Thêm địa chỉ mới
                                            </Button>
                                        </Box>
                                    )}

                                    <Divider sx={{ my: 2 }} />

                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#333', mb: 1 }}>
                                        Ghi chú đơn hàng (không bắt buộc)
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        name="notes"
                                        placeholder="Nhập ghi chú hoặc yêu cầu đặc biệt của bạn về đơn hàng..."
                                        value={formData.notes}
                                        onChange={handleInputChange}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                                    />
                                </Paper>

                                {/* 2. PHƯƠNG THỨC VẬN CHUYỂN */}
                                <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', border: `1px solid ${COLORS.primaryBlue}20`, bgcolor: '#ffffff' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                                        <LocalShippingIcon sx={{ color: COLORS.activeOrange, fontSize: '1.5rem' }} />
                                        <Typography variant="h6" sx={{ color: COLORS.primaryBlue, fontWeight: 800, textTransform: 'uppercase', fontSize: '1rem', letterSpacing: '0.5px' }}>
                                            Phương thức vận chuyển
                                        </Typography>
                                    </Box>
                                    <FormControl component="fieldset" fullWidth>
                                        <RadioGroup
                                            value={selectedDeliveryMethod}
                                            onChange={(e) => setSelectedDeliveryMethod(e.target.value)}
                                        >
                                            {deliveryMethods.map((method) => {
                                                const isSelected = selectedDeliveryMethod === method.id;
                                                return (
                                                    <Box key={method.id} sx={{
                                                        p: 2,
                                                        mb: 2,
                                                        borderRadius: '10px',
                                                        border: isSelected ? '2px solid #17479d' : '1px solid #e0e0e0',
                                                        bgcolor: isSelected ? '#f4f8fc' : 'white',
                                                        transition: 'all 0.2s'
                                                    }}>
                                                        <FormControlLabel
                                                            value={method.id}
                                                            control={<Radio color="primary" />}
                                                            label={
                                                                <Box>
                                                                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                                                        {method.name} ({formatPrice(method.shippingFee || method.ShippingFee || 0)})
                                                                    </Typography>
                                                                    <Typography variant="caption" color="text.secondary">{method.description}</Typography>
                                                                </Box>
                                                            }
                                                        />
                                                    </Box>
                                                );
                                            })}
                                        </RadioGroup>
                                    </FormControl>
                                </Paper>

                                <PaymentMethod
                                    paymentMethod={paymentMethod}
                                    setPaymentMethod={setPaymentMethod}
                                    paymentMethods={paymentMethods}
                                />
                            </Box>

                            {/* CỘT BÊN PHẢI: TÓM TẮT ĐƠN HÀNG */}
                            <Box sx={{ flexGrow: 1, width: '100%', position: 'sticky', top: 140 }}>
                                <OrderSummary
                                    cartItems={cartItems}
                                    subTotal={subTotal}
                                    shippingFee={shippingFee}
                                    taxes={taxes}
                                    discountAmount={discountAmount}
                                    grandTotal={grandTotal}
                                    formatPrice={formatPrice}
                                    couponCode={couponCode}
                                    setCouponCode={setCouponCode}
                                    onApplyCoupon={handleApplyCoupon}
                                    onRemoveCoupon={handleRemoveCoupon}
                                    appliedCoupon={appliedCoupon}
                                    couponError={couponError}
                                />
                            </Box>

                        </Box>
                    </form>
                </Container>
            </Box>

            {/* DIALOG XÁC NHẬN THANH TOÁN */}
            <Dialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                PaperProps={{ 
                    sx: { 
                        borderRadius: '24px', 
                        maxWidth: 330, 
                        width: '100%',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
                        position: 'relative'
                    } 
                }}
            >
                <button
                    onClick={() => setConfirmOpen(false)}
                    style={{
                        position: 'absolute',
                        right: '20px',
                        top: '20px',
                        background: 'transparent',
                        border: 'none',
                        color: '#9ca3af',
                        cursor: 'pointer',
                        padding: '4px',
                        borderRadius: '50%',
                        zIndex: 10
                    }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                <DialogContent sx={{ p: '48px 24px 32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                        <Box sx={{ width: 100, height: 100, borderRadius: '50%', bgcolor: 'rgba(255, 145, 13, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Box sx={{ width: 72, height: 72, borderRadius: '50%', bgcolor: '#ff910d', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                </svg>
                            </Box>
                        </Box>
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, fontSize: '24px', color: '#111827', mb: 2 }}>Confirm!</Typography>
                    <DialogContentText sx={{ color: '#6b7280', fontSize: '0.92rem', fontWeight: 500, mb: 5, textAlign: 'center', lineHeight: 1.6 }}>
                        Bạn có chắc chắn muốn tiến hành đặt hàng với tổng số tiền thanh toán là <strong style={{ color: '#ff910d' }}>{formatPrice(grandTotal)}</strong>?
                    </DialogContentText>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, width: '100%' }}>
                        <Button
                            onClick={handleSubmitOrder}
                            variant="contained"
                            fullWidth
                            sx={{ bgcolor: '#ff910d', py: 1.6, fontWeight: 700, borderRadius: '12px', textTransform: 'none', boxShadow: 'none' }}
                        >
                            Xác nhận đặt hàng
                        </Button>
                        <Button
                            onClick={() => setConfirmOpen(false)}
                            variant="text"
                            fullWidth
                            sx={{ py: 1, color: '#9ca3af', textTransform: 'none' }}
                        >
                            Quay lại
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>

            {/* DIALOG HIỂN THỊ MÃ QR THANH TOÁN */}
            <Dialog
                open={qrDialogOpen}
                onClose={() => {
                    setQrDialogOpen(false);
                    router.push('/');
                }}
                PaperProps={{
                    sx: {
                        borderRadius: '24px',
                        maxWidth: 400,
                        width: '100%',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
                        position: 'relative',
                        overflow: 'hidden'
                    }
                }}
            >
                <button
                    onClick={() => {
                        setQrDialogOpen(false);
                        router.push('/');
                    }}
                    style={{
                        position: 'absolute',
                        right: '20px',
                        top: '20px',
                        background: 'transparent',
                        border: 'none',
                        color: '#9ca3af',
                        cursor: 'pointer',
                        padding: '4px',
                        borderRadius: '50%',
                        zIndex: 10
                    }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                <DialogContent sx={{ p: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: COLORS.primaryBlue, mb: 1, textTransform: 'uppercase', fontSize: '1.1rem', letterSpacing: '0.5px' }}>
                        Thanh toán đơn hàng
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6b7280', mb: 3 }}>
                        Quét mã QR bên dưới bằng ứng dụng Ngân hàng để thanh toán tự động
                    </Typography>

                    {createdOrder && (
                        <>
                            <Box sx={{
                                p: 2,
                                bgcolor: '#f8fafc',
                                borderRadius: '16px',
                                border: '1px solid #e2e8f0',
                                mb: 3,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: 220,
                                height: 220,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                            }}>
                                <img
                                    src={createdOrder.paymentQrUrl}
                                    alt="Mã QR Thanh Toán"
                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                />
                            </Box>

                            <Box sx={{ width: '100%', bgcolor: '#f1f5f9', p: 2, borderRadius: '12px', mb: 4, textAlign: 'left' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>Mã đơn hàng:</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>{createdOrder.orderCode}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>Số tiền cần trả:</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: COLORS.activeOrange }}>{formatPrice(createdOrder.total)}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>Nội dung CK:</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>{createdOrder.orderCode}</Typography>
                                </Box>
                            </Box>
                        </>
                    )}

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, width: '100%' }}>
                        <Button
                            onClick={() => {
                                setQrDialogOpen(false);
                                setOrderSuccess(true);
                            }}
                            variant="contained"
                            fullWidth
                            sx={{
                                bgcolor: COLORS.primaryBlue,
                                py: 1.6,
                                fontWeight: 700,
                                borderRadius: '12px',
                                textTransform: 'none',
                                boxShadow: 'none',
                                '&:hover': { bgcolor: '#0f3475', boxShadow: 'none' }
                            }}
                        >
                            Tôi đã chuyển khoản thành công
                        </Button>
                        <Button
                            onClick={() => {
                                setQrDialogOpen(false);
                                router.push('/');
                            }}
                            variant="text"
                            fullWidth
                            sx={{ py: 1, color: '#9ca3af', textTransform: 'none' }}
                        >
                            Quay lại trang chủ
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>

            {/* DIALOG ĐẶT HÀNG THÀNH CÔNG */}
            <Dialog
                open={orderSuccess}
                onClose={handleCloseSuccess}
                PaperProps={{ 
                    sx: { 
                        borderRadius: '24px', 
                        maxWidth: 330, 
                        width: '100%',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
                        position: 'relative'
                    } 
                }}
            >
                <button
                    onClick={handleCloseSuccess}
                    style={{
                        position: 'absolute',
                        right: '20px',
                        top: '20px',
                        background: 'transparent',
                        border: 'none',
                        color: '#9ca3af',
                        cursor: 'pointer',
                        padding: '4px',
                        borderRadius: '50%',
                        zIndex: 10
                    }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                <DialogContent sx={{ p: '48px 24px 32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                        <Box sx={{ width: 100, height: 100, borderRadius: '50%', bgcolor: 'rgba(122, 193, 70, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Box sx={{ width: 72, height: 72, borderRadius: '50%', bgcolor: '#7ac142', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            </Box>
                        </Box>
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, fontSize: '24px', color: '#111827', mb: 2 }}>Success!</Typography>
                    <DialogContentText sx={{ color: '#6b7280', fontSize: '0.92rem', fontWeight: 500, mb: 5, textAlign: 'center', lineHeight: 1.6 }}>
                        Cảm ơn bạn đã lựa chọn mua sắm tại <strong>Arts</strong>. Đơn hàng của bạn đã được ghi nhận thành công.
                    </DialogContentText>
                    <Button
                        onClick={handleCloseSuccess}
                        variant="contained"
                        fullWidth
                        sx={{
                            bgcolor: '#7ac142',
                            py: 1.6,
                            fontWeight: 700,
                            borderRadius: '12px',
                            textTransform: 'none',
                            fontSize: '15px',
                            color: '#fff',
                            boxShadow: 'none',
                            '&:hover': { bgcolor: '#6ab035', boxShadow: 'none' }
                        }}
                    >
                        Continue
                    </Button>
                </DialogContent>
            </Dialog>

            {/* DIALOG CHỌN ĐỊA CHỈ NHẬN HÀNG */}
            <Dialog
                open={addressDialogOpen}
                onClose={() => setAddressDialogOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { borderRadius: '16px', p: 1 } }}
            >
                <DialogTitle sx={{ fontWeight: 800, color: '#333', display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                    <span>Địa chỉ nhận hàng</span>
                    <IconButton onClick={() => setAddressDialogOpen(false)}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers sx={{ px: 2, py: 1 }}>
                    <RadioGroup
                        value={tempSelectedAddressId || ''}
                    >
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {addresses
                                .slice(0, showAllAddresses ? addresses.length : 3)
                                .map((addr) => {
                                    const isSelected = tempSelectedAddressId === addr.id;
                                    return (
                                        <Box
                                            key={addr.id}
                                            onClick={() => setTempSelectedAddressId(addr.id)}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                p: 2,
                                                borderRadius: '12px',
                                                border: isSelected ? `2px solid ${COLORS.primaryBlue}` : '1px solid #e0e0e0',
                                                bgcolor: isSelected ? '#f4f8fc' : 'white',
                                                transition: 'all 0.2s',
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    bgcolor: isSelected ? '#f4f8fc' : '#fafafa'
                                                }
                                            }}
                                        >
                                            <Radio
                                                checked={isSelected}
                                                sx={{ 
                                                    mt: -0.5, 
                                                    mr: 1,
                                                    color: COLORS.primaryBlue,
                                                    '&.Mui-checked': {
                                                        color: COLORS.primaryBlue
                                                    }
                                                }}
                                            />
                                            <Box sx={{ flexGrow: 1 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                                        {addr.receiverName} - {addr.phone}
                                                    </Typography>
                                                    {addr.isDefault && (
                                                        <Chip
                                                            label="Địa chỉ mặc định"
                                                            size="small"
                                                            sx={{ bgcolor: '#ffe0b2', color: '#e65100', fontWeight: 700, borderRadius: '4px', height: 18, fontSize: '0.65rem' }}
                                                        />
                                                    )}
                                                </Box>
                                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                                                    {addr.addressDetail}, {addr.wardCommune}, {addr.provinceCity}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', gap: 1, ml: 1 }}>
                                                <Button
                                                    size="small"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleOpenEditAddress(addr);
                                                    }}
                                                    sx={{ textTransform: 'none', color: '#1976d2', p: 0, minWidth: 0, fontSize: '0.8rem' }}
                                                >
                                                    Sửa
                                                </Button>
                                                {!addr.isDefault && (
                                                    <IconButton
                                                        size="small"
                                                        onClick={(e) => openDeleteConfirm(addr, e)}
                                                        sx={{ color: '#d32f2f', p: 0 }}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                )}
                                            </Box>
                                        </Box>
                                    );
                                })}
                        </Box>
                    </RadioGroup>

                    {addresses.length > 3 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                            <Button
                                endIcon={showAllAddresses ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                onClick={() => setShowAllAddresses(!showAllAddresses)}
                                sx={{ textTransform: 'none', color: '#1976d2', fontWeight: 600 }}
                            >
                                {showAllAddresses ? 'Thu gọn' : 'Xem tất cả'}
                            </Button>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button
                        startIcon={<AddIcon />}
                        onClick={() => {
                            setAddressDialogOpen(false);
                            handleOpenCreateAddress();
                        }}
                        sx={{ textTransform: 'none', fontWeight: 700, color: COLORS.primaryBlue }}
                    >
                        Thêm địa chỉ mới
                    </Button>
                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                        <Button
                            onClick={() => setAddressDialogOpen(false)}
                            variant="outlined"
                            sx={{ borderRadius: '20px', textTransform: 'none', px: 3, borderColor: '#e0e0e0', color: '#666' }}
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={() => {
                                const selected = addresses.find(a => a.id === tempSelectedAddressId);
                                if (selected) {
                                    setSelectedAddress(selected);
                                }
                                setAddressDialogOpen(false);
                            }}
                            variant="contained"
                            sx={{ borderRadius: '20px', textTransform: 'none', px: 3, bgcolor: COLORS.primaryBlue, '&:hover': { bgcolor: '#0f3170' } }}
                        >
                            Tiếp tục
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>

            {/* DIALOG THÊM/SỬA ĐỊA CHỈ */}
            <AddressFormDialog
                open={formDialogOpen}
                mode={formDialogMode}
                initialAddress={editingAddress}
                onClose={() => {
                    setFormDialogOpen(false);
                    setEditingAddress(null);
                }}
                onSubmit={handleSubmitFormDialog}
            />

            {/* DIALOG XÁC NHẬN XÓA ĐỊA CHỈ */}
            <Dialog
                open={!!confirmDeleteAddress}
                onClose={closeDeleteConfirm}
                maxWidth="xs"
                fullWidth
                PaperProps={{ sx: { borderRadius: '16px', p: 0.5 } }}
            >
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.2, fontWeight: 800, color: '#333' }}>
                    <Box sx={{
                        width: 40, height: 40, borderRadius: '50%',
                        bgcolor: '#fdecea', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                        <WarningAmberIcon sx={{ color: '#d32f2f' }} />
                    </Box>
                    Xóa địa chỉ này?
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                        Bạn có chắc muốn xóa địa chỉ của{' '}
                        <Box component="span" sx={{ fontWeight: 700, color: '#333' }}>
                            {confirmDeleteAddress?.receiverName}
                        </Box>
                        ? Hành động này không thể hoàn tác.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5 }}>
                    <Button
                        onClick={closeDeleteConfirm}
                        disabled={!!deletingId}
                        sx={{ textTransform: 'none', fontWeight: 700, color: '#666' }}
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        disabled={!!deletingId}
                        variant="contained"
                        color="error"
                        sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '8px', boxShadow: 'none', px: 3 }}
                    >
                        {deletingId ? <CircularProgress size={18} sx={{ color: 'white' }} /> : 'Xóa địa chỉ'}
                    </Button>
                </DialogActions>
            </Dialog>

        </MainLayout>
    );
}
