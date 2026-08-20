import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Box, Container, Typography, Button, Paper, Dialog, DialogContent } from '@mui/material';
import MainLayout from '../layouts/MainLayout';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';

const COLORS = {
    primaryBlue: '#17479d',
    activeOrange: '#ff910d',
    bgLight: '#e5f2fb'
};

const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' VND';
};

export default function QRPaymentPage() {
    const router = useRouter();
    const { orderCode, total, qrUrl } = router.query;

    const [qrDialogOpen, setQrDialogOpen] = useState(false);
    const [paymentSubmitted, setPaymentSubmitted] = useState(false);

    // Mở popup QR tự động khi nhận được thông tin từ query
    useEffect(() => {
        if (router.isReady && qrUrl) {
            setQrDialogOpen(true);
        }
    }, [router.isReady, qrUrl]);

    const handleConfirmPayment = () => {
        setQrDialogOpen(false);
        setPaymentSubmitted(true);
    };

    return (
        <MainLayout>
            <Head>
                <title>Thanh toán QR | Arts</title>
            </Head>

            <Box sx={{ bgcolor: COLORS.bgLight, minHeight: '80vh', py: { xs: 6, md: 10 }, display: 'flex', alignItems: 'center' }}>
                <Container maxWidth="sm">
                    <Paper 
                        elevation={0} 
                        sx={{ 
                            p: { xs: 4, md: 6 }, 
                            borderRadius: '24px', 
                            textAlign: 'center', 
                            boxShadow: '0 10px 30px rgba(23, 71, 157, 0.05)',
                            border: '1px solid rgba(23, 71, 157, 0.1)'
                        }}
                    >
                        {!paymentSubmitted ? (
                            // Giao diện khi chưa nhấn xác nhận đã thanh toán
                            <Box>
                                <AccessTimeIcon sx={{ fontSize: '4rem', color: COLORS.activeOrange, mb: 3 }} />
                                <Typography variant="h5" sx={{ fontWeight: 800, color: COLORS.primaryBlue, mb: 2 }}>
                                    ĐANG CHỜ THANH TOÁN
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#4b5563', mb: 4 }}>
                                    Đơn hàng <strong style={{ color: COLORS.activeOrange }}>{orderCode || '...'}</strong> của bạn đã được khởi tạo. Vui lòng thanh toán bằng mã QR để tiếp tục.
                                </Typography>
                                <Button
                                    variant="contained"
                                    onClick={() => setQrDialogOpen(true)}
                                    sx={{
                                        bgcolor: COLORS.primaryBlue,
                                        py: 1.5,
                                        px: 4,
                                        fontWeight: 700,
                                        borderRadius: '12px',
                                        textTransform: 'none',
                                        boxShadow: 'none',
                                        '&:hover': { bgcolor: '#0f3475', boxShadow: 'none' }
                                    }}
                                >
                                    Xem lại mã QR
                                </Button>
                            </Box>
                        ) : (
                            // Giao diện sau khi đã nhấn xác nhận thanh toán thành công
                            <Box>
                                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                                    <Box sx={{ width: 80, height: 80, borderRadius: '50%', bgcolor: 'rgba(255, 145, 13, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <CheckCircleIcon sx={{ fontSize: '3.5rem', color: COLORS.activeOrange }} />
                                    </Box>
                                </Box>
                                
                                <Typography variant="h5" sx={{ fontWeight: 800, color: COLORS.primaryBlue, mb: 3 }}>
                                    GỬI YÊU CẦU THÀNH CÔNG!
                                </Typography>

                                <Typography variant="body1" sx={{ color: '#1f2937', fontWeight: 600, mb: 2, lineHeight: 1.6 }}>
                                    Vui lòng chờ chúng tôi xác nhận chuyển tiền trong vòng 30 phút.
                                </Typography>

                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, mb: 5, color: '#4b5563', bgcolor: '#f3f4f6', py: 2, px: 3, borderRadius: '12px' }}>
                                    <PhoneInTalkIcon sx={{ color: COLORS.primaryBlue }} />
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                        Nếu có vấn đề gì hãy liên hệ với chúng tôi qua số điện thoại: <strong style={{ color: COLORS.primaryBlue }}>1900 866 819</strong>
                                    </Typography>
                                </Box>

                                <Button
                                    variant="contained"
                                    onClick={() => router.push('/')}
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
                                    Quay về trang chủ
                                </Button>
                            </Box>
                        )}
                    </Paper>
                </Container>
            </Box>

            {/* POPUP MÃ QR TỰ ĐỘNG HIỂN THỊ */}
            <Dialog
                open={qrDialogOpen}
                onClose={() => setQrDialogOpen(false)}
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
                <DialogContent sx={{ p: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: COLORS.primaryBlue, mb: 1, textTransform: 'uppercase', fontSize: '1.1rem', letterSpacing: '0.5px' }}>
                        Thanh toán qua QR Code
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6b7280', mb: 3 }}>
                        Quét mã QR bên dưới bằng ứng dụng Ngân hàng để thanh toán tự động
                    </Typography>

                    {qrUrl && (
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
                                    src={qrUrl}
                                    alt="Mã QR Thanh Toán"
                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                />
                            </Box>

                            <Box sx={{ width: '100%', bgcolor: '#f1f5f9', p: 2, borderRadius: '12px', mb: 4, textAlign: 'left' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>Mã đơn hàng:</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>{orderCode}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>Số tiền cần trả:</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: COLORS.activeOrange }}>{formatPrice(total)}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>Nội dung CK:</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>{orderCode}</Typography>
                                </Box>
                            </Box>
                        </>
                    )}

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, width: '100%' }}>
                        <Button
                            onClick={handleConfirmPayment}
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
                            onClick={() => setQrDialogOpen(false)}
                            variant="text"
                            fullWidth
                            sx={{ py: 1, color: '#9ca3af', textTransform: 'none' }}
                        >
                            Đóng
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </MainLayout>
    );
}
