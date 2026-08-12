// src/pages/tracking.js
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { Box, Container, Typography, Button, CircularProgress, Paper } from '@mui/material';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

import MainLayout from '../layouts/MainLayout';
import toast from 'react-hot-toast';
import orderService from '../services/orderService';
import OrderListSection from '../sections/tracking/OrderListSection';
import OrderDetailSection from '../sections/tracking/OrderDetailSection';

const COLORS = {
    primaryBlue: '#17479d',
    activeOrange: '#ff910d',
    bgLight: '#e5f2fb',
    borderGray: '#e0eaf5',
    textMuted: '#666',
    success: '#2e7d32',
    error: '#d32f2f',
    warning: '#ed6c02',
    info: '#0288d1'
};

const trackingSteps = [
    'Chờ xác nhận',
    'Đã xác nhận',
    'Đang giao hàng',
    'Giao thành công'
];

export default function TrackingPage() {
    const router = useRouter();
    const { user } = useSelector((state) => state.auth);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(false);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const fetchOrders = async () => {
            try {
                const data = await orderService.getMyOrders();
                console.log("MY ORDERS API RESPONSE:", data);
                const fetchedOrders = Array.isArray(data) ? data : (data.items || data.Items || []);
                
                const sortedOrders = fetchedOrders.sort((a, b) => {
                    const dateA = new Date(a.createdAt || a.CreatedAt || 0);
                    const dateB = new Date(b.createdAt || b.CreatedAt || 0);
                    return dateB - dateA;
                });
                
                setOrders(sortedOrders);
                if (sortedOrders.length > 0) {
                    setSelectedOrderId(sortedOrders[0].id || sortedOrders[0].Id);
                }
            } catch (err) {
                console.error("Lỗi khi tải đơn hàng của tôi:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    useEffect(() => {
        if (!selectedOrderId) {
            setSelectedOrderDetails(null);
            return;
        }

        const fetchOrderDetails = async () => {
            setLoadingDetails(true);
            try {
                const data = await orderService.getOrderById(selectedOrderId);
                console.log("ORDER DETAILS API RESPONSE:", data);
                setSelectedOrderDetails(data);
            } catch (err) {
                console.error("Lỗi khi tải chi tiết đơn hàng:", err);
            } finally {
                setLoadingDetails(false);
            }
        };

        fetchOrderDetails();
    }, [selectedOrderId]);

    const handleCancelOrder = async () => {
        if (!selectedOrderId) return;
        if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) return;

        try {
            const loadingToast = toast.loading("Đang tiến hành hủy đơn hàng...");
            await orderService.cancelOrder(selectedOrderId);
            toast.dismiss(loadingToast);
            toast.success("Hủy đơn hàng thành công!");

            // Reload order list
            const data = await orderService.getMyOrders();
            const fetchedOrders = Array.isArray(data) ? data : (data.items || data.Items || []);
            const sortedOrders = fetchedOrders.sort((a, b) => {
                const dateA = new Date(a.createdAt || a.CreatedAt || 0);
                const dateB = new Date(b.createdAt || b.CreatedAt || 0);
                return dateB - dateA;
            });
            setOrders(sortedOrders);

            // Reload current details
            const detailData = await orderService.getOrderById(selectedOrderId);
            setSelectedOrderDetails(detailData);
        } catch (err) {
            toast.error(err.response?.data?.message || err.message || "Hủy đơn hàng thất bại. Vui lòng thử lại!");
        }
    };

    const getStatusLabel = (order) => {
        if (!order) return { label: 'Không xác định', color: COLORS.textMuted, stepIndex: -1 };
        const status = order.orderStatus;
        const label = order.orderStatusName || 'Không xác định';
        
        switch (status) {
            case 0:
                return { label: label, color: COLORS.warning, stepIndex: 0 };
            case 1:
                return { label: label, color: COLORS.info, stepIndex: 1 };
            case 2:
                return { label: label, color: COLORS.activeOrange, stepIndex: 2 };
            case 3:
                return { label: label, color: COLORS.success, stepIndex: 3 };
            case 4:
                return { label: label, color: COLORS.error, stepIndex: -1 };
            default:
                return { label: label, color: COLORS.textMuted, stepIndex: -1 };
        }
    };

    if (loading) {
        return (
            <MainLayout>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', bgcolor: COLORS.bgLight }}>
                    <CircularProgress />
                </Box>
            </MainLayout>
        );
    }

    return (
        <>
            <Head>
                <title>Theo dõi đơn hàng | Arts</title>
            </Head>

            <MainLayout>
                <Box sx={{ bgcolor: COLORS.bgLight, minHeight: '100vh', py: { xs: 4, md: 6 } }}>
                    <Container maxWidth="lg">
                        
                        {/* CHƯA ĐĂNG NHẬP */}
                        {!user ? (
                            <Paper elevation={0} sx={{ p: 5, textCenter: 'center', borderRadius: '16px', border: '1px solid #e0eaf5', textAlign: 'center', maxWidth: 600, mx: 'auto' }}>
                                <ShoppingBagIcon sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                                    Bạn chưa đăng nhập
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                    Vui lòng đăng nhập tài khoản của bạn để truy cập danh sách và theo dõi hành trình đơn hàng.
                                </Typography>
                                <Button
                                    variant="contained"
                                    onClick={() => router.push('/auth/login')}
                                    sx={{ bgcolor: COLORS.primaryBlue, px: 4, borderRadius: '8px', textTransform: 'none', fontWeight: 700 }}
                                >
                                    Đăng nhập ngay
                                </Button>
                            </Paper>
                        ) : orders.length === 0 ? (
                            /* KHÔNG CÓ ĐƠN HÀNG */
                            <Paper elevation={0} sx={{ p: 6, textAlign: 'center', borderRadius: '16px', border: '1px solid #e0eaf5', maxWidth: 600, mx: 'auto' }}>
                                <ShoppingBagIcon sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                                    Bạn chưa có đơn hàng nào
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                    Hãy tham khảo các mặt hàng đặc biệt của chúng tôi và đặt đơn hàng đầu tiên!
                                </Typography>
                                <Button
                                    variant="contained"
                                    onClick={() => router.push('/')}
                                    sx={{ bgcolor: COLORS.primaryBlue, px: 4, borderRadius: '8px', textTransform: 'none', fontWeight: 700 }}
                                >
                                    Mua sắm ngay
                                </Button>
                            </Paper>
                        ) : (
                            <Box>
                                <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' }, alignItems: 'flex-start', width: '100%' }}>
                                    
                                    {/* CỘT TRÁI - DANH SÁCH ĐƠN HÀNG */}
                                    <OrderListSection
                                        orders={orders}
                                        selectedOrderId={selectedOrderId}
                                        setSelectedOrderId={setSelectedOrderId}
                                        COLORS={COLORS}
                                        getStatusLabel={getStatusLabel}
                                    />

                                    {/* CỘT PHẢI - CHI TIẾT HÀNH TRÌNH ĐƠN HÀNG */}
                                    <OrderDetailSection
                                        selectedOrder={selectedOrderDetails}
                                        loadingDetails={loadingDetails}
                                        COLORS={COLORS}
                                        getStatusLabel={getStatusLabel}
                                        trackingSteps={trackingSteps}
                                        onCancelOrder={handleCancelOrder}
                                    />
                                </Box>

                                {/* DEBUG BOX HỒ SƠ TRẢ VỀ CỦA API */}
                                <Box sx={{ mt: 4, p: 3, bgcolor: '#ffffff', borderRadius: '16px', border: '1px solid #e0eaf5', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: COLORS.primaryBlue, mb: 2 }}>
                                        🔧 DỮ LIỆU THỰC TẾ API TRẢ VỀ (DEBUG)
                                    </Typography>
                                    <Box component="pre" sx={{ m: 0, p: 2, bgcolor: '#f8fafc', borderRadius: '8px', border: '1px solid #eef2f6', overflowX: 'auto', fontSize: '12px', fontFamily: 'monospace' }}>
                                        {JSON.stringify({ orders, selectedOrderDetails }, null, 2)}
                                    </Box>
                                </Box>
                            </Box>
                        )}

                    </Container>
                </Box>
            </MainLayout>
        </>
    );
}