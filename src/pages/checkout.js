// src/pages/checkout.js
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Box, Container, Typography, Dialog, DialogContent, DialogContentText, DialogTitle, Button, RadioGroup, FormControlLabel, Radio, FormControl, Paper } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HelpIcon from '@mui/icons-material/Help';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import MainLayout from '../layouts/MainLayout';
import toast from 'react-hot-toast';

// Import các components con từ folder sections
import ShippingInfo from '../sections/checkout/ShippingInfo';
import PaymentMethod from '../sections/checkout/PaymentMethod';
import OrderSummary from '../sections/checkout/OrderSummary';

// Import các services
import paymentMethodService from '../services/paymentMethodService';
import deliveryMethodService from '../services/deliveryMethodService';
import couponService from '../services/couponService';
import orderService from '../services/orderService';
import { clearCart } from '../redux/slices/cartSlice';

const COLORS = {
    primaryBlue: '#17479d',
    activeOrange: '#ff910d',
    bgLight: '#e5f2fb',
    success: '#2e7d32'
};

const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
};

export default function CheckoutPage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { items: cartItems } = useSelector((state) => state.cart);

    // Form states - Auto điền thông tin liên hệ và địa chỉ mặc định từ Profile nếu đã lưu
    const [formData, setFormData] = useState({
        fullName: user ? `${user.lastName || ''} ${user.middleName || ''} ${user.firstName || ''}`.trim() : '',
        email: user ? user.email : '',
        phone: user ? user.phone || '' : '',
        province: user?.address?.province || '',
        district: user?.address?.district || '',
        ward: user?.address?.ward || '',
        streetAddress: user?.address?.streetAddress || '',
        notes: ''
    });

    // Quản lý dữ liệu địa chỉ gọi từ API Online
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [selectedProvinceCode, setSelectedProvinceCode] = useState('');
    const [selectedDistrictCode, setSelectedDistrictCode] = useState('');

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

    // Tính toán số tiền đơn hàng
    const subTotal = cartItems.reduce((sum, item) => sum + item.price * (item.qty || item.quantity || 1), 0);
    const selectedDelivery = deliveryMethods.find(d => d.id === selectedDeliveryMethod);
    const shippingFee = selectedDelivery ? (selectedDelivery.shippingFee || selectedDelivery.ShippingFee || 0) : 0;
    const taxes = Math.round((subTotal - discountAmount) * 0.08);
    const grandTotal = Math.max(0, subTotal + shippingFee + taxes - discountAmount);

    const [mounted, setMounted] = useState(false);

    // 1. Tải danh sách Tỉnh/Thành phố khi load trang và set mounted
    useEffect(() => {
        setMounted(true);
        fetch('https://provinces.open-api.vn/api/p/')
            .then(res => res.json())
            .then(data => setProvinces(data))
            .catch(err => console.error("Lỗi tải tỉnh thành:", err));
    }, []);

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

    // 1b. Tự động nhận diện và nạp các danh sách Quận/Phường tương ứng nếu người dùng đã có địa chỉ mặc định đã lưu
    useEffect(() => {
        if (user?.address?.province && provinces.length > 0) {
            const foundProv = provinces.find(p => p.name === user.address.province);
            if (foundProv) {
                setSelectedProvinceCode(foundProv.code);

                // Nạp Quận/Huyện của Tỉnh này
                fetch(`https://provinces.open-api.vn/api/p/${foundProv.code}?depth=2`)
                    .then(res => res.json())
                    .then(data => {
                        const distList = data.districts || [];
                        setDistricts(distList);

                        if (user.address.district) {
                            const foundDist = distList.find(d => d.name === user.address.district);
                            if (foundDist) {
                                setSelectedDistrictCode(foundDist.code);

                                // Nạp Phường/Xã của Huyện này
                                fetch(`https://provinces.open-api.vn/api/d/${foundDist.code}?depth=2`)
                                    .then(res => res.json())
                                    .then(wData => {
                                        setWards(wData.wards || []);
                                    })
                                    .catch(err => console.error("Lỗi tải phường xã mặc định:", err));
                            }
                        }
                    })
                    .catch(err => console.error("Lỗi tải quận huyện mặc định:", err));
            }
        }
    }, [user, provinces]);

    // 3. Thay đổi tỉnh -> Gọi API lấy Quận/Huyện
    const handleProvinceChange = (e) => {
        const provinceCode = e.target.value;
        setSelectedProvinceCode(provinceCode);

        const provinceName = provinces.find(p => p.code === provinceCode)?.name || '';
        setFormData(prev => ({
            ...prev,
            province: provinceName,
            district: '',
            ward: ''
        }));

        setSelectedDistrictCode('');
        setWards([]);
        setDistricts([]);

        fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`)
            .then(res => res.json())
            .then(data => setDistricts(data.districts || []))
            .catch(err => console.error("Lỗi tải quận huyện:", err));
    };

    // 4. Thay đổi Huyện -> Gọi API lấy Phường/Xã
    const handleDistrictChange = (e) => {
        const districtCode = e.target.value;
        setSelectedDistrictCode(districtCode);

        const districtName = districts.find(d => d.code === districtCode)?.name || '';
        setFormData(prev => ({
            ...prev,
            district: districtName,
            ward: ''
        }));

        setWards([]);

        fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`)
            .then(res => res.json())
            .then(data => setWards(data.wards || []))
            .catch(err => console.error("Lỗi tải phường xã:", err));
    };

    // 5. Thay đổi Phường/Xã
    const handleWardChange = (e) => {
        const wardName = e.target.value;
        setFormData(prev => ({
            ...prev,
            ward: wardName
        }));
    };

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

    const handlePreSubmitOrder = (e) => {
        e.preventDefault();
        
        if (cartItems.length === 0) {
            toast.error("Giỏ hàng của bạn đang trống!");
            return;
        }

        if (!formData.fullName || !formData.phone || !formData.province || !formData.district || !formData.ward || !formData.streetAddress) {
            toast.error("Vui lòng điền đầy đủ thông tin giao hàng!");
            return;
        }

        setConfirmOpen(true);
    };

    const handleSubmitOrder = async () => {
        setConfirmOpen(false);

        const payload = {
            customerAddressId: null, // Luồng khách nhập thông tin địa chỉ trực tiếp
            receiverName: formData.fullName,
            phone: formData.phone,
            province: formData.province,
            district: formData.district,
            ward: formData.ward,
            address: formData.streetAddress,
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
            await orderService.createOrder(payload);
            toast.dismiss(loadingToast);
            dispatch(clearCart());
            setOrderSuccess(true);
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

                                <ShippingInfo
                                    formData={formData}
                                    handleInputChange={handleInputChange}
                                    provinces={provinces}
                                    districts={districts}
                                    wards={wards}
                                    selectedProvinceCode={selectedProvinceCode}
                                    selectedDistrictCode={selectedDistrictCode}
                                    handleProvinceChange={handleProvinceChange}
                                    handleDistrictChange={handleDistrictChange}
                                    handleWardChange={handleWardChange}
                                />

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
                            <Box sx={{ flexGrow: 1, width: '100%', position: 'sticky', top: 90 }}>
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

        </MainLayout>
    );
}
