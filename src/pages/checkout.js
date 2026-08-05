// src/pages/checkout.js
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Box, Container, Typography, Dialog, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MainLayout from '../layouts/MainLayout';

// Import các components con từ folder sections
import ShippingInfo from '../sections/checkout/ShippingInfo';
import PaymentMethod from '../sections/checkout/PaymentMethod';
import OrderSummary from '../sections/checkout/OrderSummary';

const COLORS = {
    primaryBlue: '#17479d',
    activeOrange: '#ff910d',
    bgLight: '#e5f2fb',
    success: '#2e7d32'
};

const dummyCartItems = [
    {
        id: 1,
        name: 'Bút Gel Thiên Long Pokémon GEL-045/PKM – Mực Xanh 0.5mm',
        variant: 'Eevee',
        price: 10800,
        qty: 1,
        image: 'https://images.unsplash.com/photo-1583485088034-697b5a624f47?w=150&q=80'
    },
    {
        id: 2,
        name: 'Bút Gel Thiên Long GOAL GEL-052 Quick Dry – 0.5mm',
        variant: 'Xanh - Cán Xanh',
        price: 54000,
        qty: 5,
        image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=150&q=80'
    }
];

const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
};

export default function CheckoutPage() {
    const router = useRouter();
    const { user } = useSelector((state) => state.auth);

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

    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [orderSuccess, setOrderSuccess] = useState(false);

    // Tính toán số tiền đơn hàng
    const subTotal = dummyCartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    const shippingFee = 30000;
    const taxes = Math.round(subTotal * 0.08);
    const grandTotal = subTotal + shippingFee + taxes;

    // 1. Tải danh sách Tỉnh/Thành phố khi load trang
    useEffect(() => {
        fetch('https://provinces.open-api.vn/api/p/')
            .then(res => res.json())
            .then(data => setProvinces(data))
            .catch(err => console.error("Lỗi tải tỉnh thành:", err));
    }, []);

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

    // 2. Thay đổi tỉnh -> Gọi API lấy Quận/Huyện
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

    // 3. Thay đổi Huyện -> Gọi API lấy Phường/Xã
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

    // 4. Thay đổi Phường/Xã
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

    const handleSubmitOrder = (e) => {
        e.preventDefault();
        setOrderSuccess(true);
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

                    <form onSubmit={handleSubmitOrder}>
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

                                <PaymentMethod 
                                    paymentMethod={paymentMethod}
                                    setPaymentMethod={setPaymentMethod}
                                />
                            </Box>

                            {/* CỘT BÊN PHẢI: TÓM TẮT ĐƠN HÀNG */}
                            <Box sx={{ flexGrow: 1, width: '100%', position: 'sticky', top: 90 }}>
                                <OrderSummary 
                                    cartItems={dummyCartItems}
                                    subTotal={subTotal}
                                    shippingFee={shippingFee}
                                    taxes={taxes}
                                    grandTotal={grandTotal}
                                    formatPrice={formatPrice}
                                />
                            </Box>

                        </Box>
                    </form>
                </Container>
            </Box>

            {/* DIALOG ĐẶT HÀNG THÀNH CÔNG */}
            <Dialog 
                open={orderSuccess} 
                onClose={handleCloseSuccess}
                PaperProps={{ sx: { borderRadius: '16px', p: 2, textAlign: 'center', maxWidth: 450 } }}
            >
                <DialogContent>
                    <CheckCircleIcon sx={{ fontSize: '4.5rem', color: COLORS.success, mb: 2 }} />
                    <DialogTitle sx={{ fontWeight: 900, fontSize: '1.4rem', px: 0, pt: 0, pb: 1 }}>Đặt hàng thành công!</DialogTitle>
                    <DialogContentText sx={{ color: '#555', fontSize: '0.95rem', mb: 3 }}>
                        Cảm ơn bạn đã lựa chọn mua sắm tại <strong>Arts</strong>. Đơn hàng của bạn đã được ghi nhận thành công và đang được xử lý giao hàng.
                    </DialogContentText>
                    <Button 
                        onClick={handleCloseSuccess} 
                        variant="contained"
                        fullWidth
                        sx={{ bgcolor: COLORS.primaryBlue, py: 1.2, fontWeight: 700, borderRadius: '8px', textTransform: 'none' }}
                    >
                        Quay lại mua sắm
                    </Button>
                </DialogContent>
            </Dialog>

        </MainLayout>
    );
}
