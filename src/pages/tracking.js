// src/pages/tracking.js
import React, { useState } from 'react';
import Head from 'next/head';
import {
    Box, Container, Typography, TextField, Button, Grid,
    Paper, Stepper, Step, StepLabel, Divider, Stack
} from '@mui/material';

// --- ICONS ---
import SearchIcon from '@mui/icons-material/Search';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import MainLayout from '../layouts/MainLayout';

const COLORS = {
    primary: '#17479d',
    accent: '#ff910d',
    bg: '#f5f7fa',
    text: '#333'
};

// Các bước giao hàng
const trackingSteps = [
    'Đã đặt hàng',
    'Đã xác nhận',
    'Đang giao hàng',
    'Giao thành công'
];

export default function TrackingPage() {
    const [orderId, setOrderId] = useState('');
    const [phone, setPhone] = useState('');
    const [isTracking, setIsTracking] = useState(false); // State để hiển thị kết quả demo

    const handleTrackOrder = (e) => {
        e.preventDefault();
        if (orderId && phone) {
            // Giả lập gọi API và trả về kết quả sau khi bấm nút
            setIsTracking(true);
        }
    };

    return (
        <>
            <Head>
                <title>Theo dõi đơn hàng | Tạp Hóa Store</title>
            </Head>

            <MainLayout>
                <Box sx={{ bgcolor: COLORS.bg, minHeight: '100vh', py: 8 }}>
                    <Container maxWidth="md">

                        {/* TIÊU ĐỀ TRANG */}
                        <Box sx={{ textAlign: 'center', mb: 5 }}>
                            <LocalShippingIcon sx={{ fontSize: 60, color: COLORS.primary, mb: 1 }} />
                            <Typography variant="h4" sx={{ fontWeight: 800, color: COLORS.primary, mb: 1 }}>
                                Theo Dõi Đơn Hàng
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Nhập mã đơn hàng và số điện thoại của bạn để kiểm tra trạng thái vận chuyển
                            </Typography>
                        </Box>

                        {/* FORM TRA CỨU */}
                        <Paper elevation={0} sx={{ p: 4, borderRadius: '12px', border: '1px solid #e0e0e0', mb: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                            <form onSubmit={handleTrackOrder}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={5}>
                                        <TextField
                                            fullWidth
                                            label="Mã đơn hàng"
                                            variant="outlined"
                                            placeholder="VD: THS-123456"
                                            value={orderId}
                                            onChange={(e) => setOrderId(e.target.value)}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={5}>
                                        <TextField
                                            fullWidth
                                            label="Số điện thoại"
                                            variant="outlined"
                                            placeholder="Nhập SĐT đặt hàng"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'stretch' }}>
                                        <Button
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            sx={{ bgcolor: COLORS.primary, '&:hover': { bgcolor: '#0f3170' }, boxShadow: 'none' }}
                                        >
                                            <SearchIcon />
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </Paper>

                        {/* KẾT QUẢ TRA CỨU (Chỉ hiển thị khi đã bấm nút tìm kiếm) */}
                        {isTracking && (
                            <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: '12px', border: '1px solid #e0e0e0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', animation: 'fadeIn 0.5s ease-in' }}>

                                {/* Thông tin đơn hàng cơ bản */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', mb: 4, gap: 2 }}>
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: COLORS.text }}>
                                            Mã đơn hàng: <span style={{ color: COLORS.primary }}>#{orderId || 'THS-9876543'}</span>
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Ngày đặt: 31/07/2026 - 14:30
                                        </Typography>
                                    </Box>
                                    <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                                        <Typography variant="subtitle2" sx={{ color: COLORS.text, fontWeight: 600 }}>
                                            Đơn vị vận chuyển
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: COLORS.accent, fontWeight: 700 }}>
                                            Giao Hàng Nhanh (GHN)
                                        </Typography>
                                    </Box>
                                </Box>

                                <Divider sx={{ mb: 5 }} />

                                {/* THANH TIẾN TRÌNH TRẠNG THÁI (STEPPER) */}
                                <Box sx={{ width: '100%', mb: 6 }}>
                                    {/* activeStep = 2 tương đương với trạng thái "Đang giao hàng" */}
                                    <Stepper activeStep={2} alternativeLabel>
                                        {trackingSteps.map((label, index) => (
                                            <Step key={label}>
                                                <StepLabel
                                                    StepIconProps={{
                                                        sx: {
                                                            color: index <= 2 ? COLORS.accent : '#e0e0e0', // Đổi màu step đã hoàn thành
                                                            '&.Mui-active': { color: COLORS.accent },
                                                            '&.Mui-completed': { color: COLORS.accent }
                                                        }
                                                    }}
                                                >
                                                    <Typography sx={{ fontWeight: index === 2 ? 700 : 500, color: index <= 2 ? COLORS.text : '#999', mt: 1 }}>
                                                        {label}
                                                    </Typography>
                                                </StepLabel>
                                            </Step>
                                        ))}
                                    </Stepper>
                                </Box>

                                {/* CHI TIẾT LỊCH SỬ GIAO HÀNG */}
                                <Grid container spacing={4}>
                                    <Grid item xs={12} md={6}>
                                        <Box sx={{ bgcolor: '#f9fafc', p: 3, borderRadius: '8px', height: '100%' }}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center' }}>
                                                <ReceiptLongIcon sx={{ mr: 1, color: COLORS.primary }} /> Thông tin người nhận
                                            </Typography>
                                            <Stack spacing={1.5}>
                                                <Typography variant="body2"><strong>Họ tên:</strong> Nguyễn Văn A</Typography>
                                                <Typography variant="body2"><strong>Số điện thoại:</strong> {phone || '0987 654 321'}</Typography>
                                                <Typography variant="body2"><strong>Địa chỉ:</strong> 123 Đường Cầu Giấy, Phường Quan Hoa, Quận Cầu Giấy, TP. Hà Nội</Typography>
                                                <Typography variant="body2"><strong>Ghi chú:</strong> Giao hàng giờ hành chính</Typography>
                                            </Stack>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <Box sx={{ bgcolor: '#f9fafc', p: 3, borderRadius: '8px', height: '100%' }}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center' }}>
                                                <LocalShippingIcon sx={{ mr: 1, color: COLORS.primary }} /> Lịch sử cập nhật
                                            </Typography>

                                            {/* Trục thời gian đơn giản */}
                                            <Stack spacing={2} sx={{ position: 'relative', borderLeft: '2px solid #e0e0e0', ml: 1, pl: 3 }}>

                                                <Box sx={{ position: 'relative' }}>
                                                    <CheckCircleIcon sx={{ position: 'absolute', left: -35, top: -2, color: COLORS.accent, bgcolor: 'white', borderRadius: '50%' }} />
                                                    <Typography variant="body2" sx={{ fontWeight: 700, color: COLORS.accent }}>Đang giao hàng</Typography>
                                                    <Typography variant="caption" color="text.secondary">01/08/2026 - 08:15 | Đơn hàng đang được shipper giao đến bạn.</Typography>
                                                </Box>

                                                <Box sx={{ position: 'relative' }}>
                                                    <CheckCircleIcon sx={{ position: 'absolute', left: -35, top: -2, color: COLORS.primary, bgcolor: 'white', borderRadius: '50%' }} />
                                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>Đã xác nhận</Typography>
                                                    <Typography variant="caption" color="text.secondary">31/07/2026 - 15:00 | Đơn hàng đã được đóng gói và bàn giao cho ĐVVC.</Typography>
                                                </Box>

                                                <Box sx={{ position: 'relative' }}>
                                                    <CheckCircleIcon sx={{ position: 'absolute', left: -35, top: -2, color: COLORS.primary, bgcolor: 'white', borderRadius: '50%' }} />
                                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>Đặt hàng thành công</Typography>
                                                    <Typography variant="caption" color="text.secondary">31/07/2026 - 14:30 | Hệ thống đã ghi nhận đơn hàng.</Typography>
                                                </Box>

                                            </Stack>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Paper>
                        )}

                    </Container>
                </Box>
            </MainLayout>
        </>
    );
}