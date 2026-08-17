import React, { useState, useEffect, useRef } from 'react';
import { Box, Container, Typography, Button, IconButton, LinearProgress } from '@mui/material';
import InfoIcon from '@mui/icons-material/InfoOutlined';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import PercentIcon from '@mui/icons-material/Percent';
import Slider from 'react-slick';
import toast from 'react-hot-toast';
import couponService from '../../services/couponService';

export default function CouponSlider() {
    const [coupons, setCoupons] = useState([]);
    const sliderRef = useRef(null);

    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                const data = await couponService.getAllCoupons(1, 100);
                setCoupons(data.items || data.Items || []);
            } catch (err) {
                console.error("Lỗi khi tải danh sách mã giảm giá:", err);
            }
        };
        fetchCoupons();
    }, []);

    const handleCopy = (code) => {
        navigator.clipboard.writeText(code);
        toast.custom((t) => (
            <div
                className={`${t.visible ? 'toast-custom-enter' : 'toast-custom-leave'} toast-custom-success`}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div className="toast-icon-success">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </div>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: '15px', color: '#1e293b', lineHeight: 1.2, marginBottom: '2px' }}>
                            Chúc mừng!
                        </div>
                        <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 500, lineHeight: 1.3 }}>
                            Đã lưu mã giảm giá: <strong style={{ color: '#10b981' }}>{code}</strong> thành công.
                        </div>
                    </div>
                </div>
                <button 
                    onClick={() => toast.dismiss(t.id)}
                    className="toast-close-btn"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
        ), {
            position: 'top-right',
            duration: 3500
        });
    };

    if (coupons.length === 0) return null;

    const settings = {
        dots: false,
        infinite: true,
        speed: 800,
        slidesToShow: Math.min(3, coupons.length),
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: false,
        pauseOnHover: true,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: Math.min(2, coupons.length),
                    infinite: true
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    infinite: true
                }
            }
        ]
    };

    return (
        <Box sx={{ bgcolor: '#e5f2fb', py: 2 }}>
            <Container maxWidth="xl" sx={{ position: 'relative' }}>
                <Box
                    sx={{
                        bgcolor: '#ffffff',
                        p: { xs: 2.5, md: 4 },
                        borderRadius: '24px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 800, color: '#17479d', display: 'flex', alignItems: 'center', gap: 1 }}>
                            🎟️ ƯU ĐÃI ĐẶC BIỆT DÀNH CHO BẠN
                        </Typography>
                        <Box>
                            <IconButton onClick={() => sliderRef.current?.slickPrev()} sx={{ border: '1px solid #ccc', mr: 1, bgcolor: '#fff', '&:hover': { bgcolor: '#f5f5f5' } }}><KeyboardArrowLeftIcon /></IconButton>
                            <IconButton onClick={() => sliderRef.current?.slickNext()} sx={{ border: '1px solid #ccc', bgcolor: '#fff', '&:hover': { bgcolor: '#f5f5f5' } }}><KeyboardArrowRightIcon /></IconButton>
                        </Box>
                    </Box>

                    <Box sx={{ mx: -1.5 }}>
                        <Slider ref={sliderRef} {...settings}>
                            {coupons.map((coupon) => {
                                const progress = Math.min(100, (coupon.usedCount / coupon.quantity) * 100);
                                const formattedEndDate = new Date(coupon.endDate).toLocaleDateString('vi-VN', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: '2-digit'
                                });
                                const discountTitle = coupon.discountType === 'PERCENT'
                                    ? `Giảm ${coupon.discountValue}%`
                                    : `Giảm ${coupon.discountValue.toLocaleString('vi-VN')}đ`;

                                return (
                                    <Box key={coupon.id} sx={{ px: 1.5, py: 1 }}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                height: 135,
                                                borderRadius: '12px',
                                                overflow: 'hidden',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                                                border: '1px solid #eef2f6',
                                                bgcolor: '#ffffff',
                                                position: 'relative',
                                                transition: '0.3s',
                                                '&:hover': {
                                                    boxShadow: '0 6px 18px rgba(0,0,0,0.1)'
                                                }
                                            }}
                                        >
                                            {/* Cột trái */}
                                            <Box sx={{
                                                width: 90,
                                                bgcolor: '#fff8f2',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: 1,
                                                flexShrink: 0
                                            }}>
                                                <Box sx={{
                                                    width: 44,
                                                    height: 44,
                                                    borderRadius: '50%',
                                                    bgcolor: '#fff0e0',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    border: '1.5px dashed #ff910d'
                                                }}>
                                                    <PercentIcon sx={{ color: '#ff910d', fontSize: '1.5rem' }} />
                                                </Box>
                                                <Typography sx={{ fontSize: '11px', fontWeight: 800, color: '#333' }}>Mã giảm</Typography>
                                            </Box>

                                            {/* Divider nét đứt với lỗ tròn đục hai đầu */}
                                            <Box sx={{
                                                width: '2px',
                                                borderLeft: '2px dashed #ff910d',
                                                position: 'relative',
                                                height: '100%',
                                                bgcolor: '#ffffff',
                                                flexShrink: 0
                                            }}>
                                                {/* Lỗ tròn phía trên */}
                                                <Box sx={{
                                                    position: 'absolute',
                                                    top: -9,
                                                    left: -9,
                                                    width: 16,
                                                    height: 16,
                                                    borderRadius: '50%',
                                                    bgcolor: '#ffffff',
                                                    borderBottom: '1px solid #eef2f6',
                                                    zIndex: 10
                                                }} />
                                                {/* Lỗ tròn phía dưới */}
                                                <Box sx={{
                                                    position: 'absolute',
                                                    bottom: -9,
                                                    left: -9,
                                                    width: 16,
                                                    height: 16,
                                                    borderRadius: '50%',
                                                    bgcolor: '#ffffff',
                                                    borderTop: '1px solid #eef2f6',
                                                    zIndex: 10
                                                }} />
                                            </Box>

                                            {/* Cột phải */}
                                            <Box sx={{
                                                flexGrow: 1,
                                                bgcolor: '#ffffff',
                                                p: 1.8,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-between',
                                                minWidth: 0
                                            }}>
                                                <Box>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1a1a1a', pr: 1, lineHeight: 1.2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                            {coupon.name}
                                                        </Typography>
                                                    </Box>
                                                    <Typography variant="caption" sx={{ color: '#666', display: 'block', mt: 0.5, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        Đơn tối thiểu {coupon.minOrderAmount.toLocaleString('vi-VN')}đ
                                                    </Typography>
                                                </Box>

                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 1 }}>
                                                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                                        <Typography variant="caption" sx={{ color: '#ff4d4f', fontWeight: 600, display: 'block', mb: 0.5 }}>
                                                            HSD: {formattedEndDate}
                                                        </Typography>
                                                        <LinearProgress
                                                            variant="determinate"
                                                            value={progress}
                                                            sx={{
                                                                height: 4,
                                                                borderRadius: 2,
                                                                bgcolor: '#e6f7ff',
                                                                '& .MuiLinearProgress-bar': { bgcolor: '#ff910d' }
                                                            }}
                                                        />
                                                    </Box>
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        onClick={() => handleCopy(coupon.code)}
                                                        sx={{
                                                            bgcolor: '#1890ff',
                                                            color: '#fff',
                                                            fontWeight: 700,
                                                            fontSize: '11px',
                                                            borderRadius: '6px',
                                                            textTransform: 'none',
                                                            px: 1.8,
                                                            py: 0.6,
                                                            boxShadow: 'none',
                                                            flexShrink: 0,
                                                            '&:hover': { bgcolor: '#096dd9', boxShadow: 'none' }
                                                        }}
                                                    >
                                                        Lưu mã
                                                    </Button>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>
                                );
                            })}
                        </Slider>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
