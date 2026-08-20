import { Box, Typography, Stack, Paper, Card, CardContent, Chip, Button, Divider, CircularProgress, Pagination } from '@mui/material';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Link from 'next/link';
import orderService from '../../services/orderService';

const COLORS = {
    primaryBlue: '#17479d',
    activeOrange: '#ff910d',
    warning: '#ed6c02',
    info: '#0288d1',
    success: '#2e7d32',
    error: '#d32f2f',
    textMuted: '#666'
};

import React, { useState, useEffect } from 'react';

export default function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [page, setPage] = useState(1);
    const itemsPerPage = 6;
    const totalPages = Math.ceil(orders.length / itemsPerPage);
    const paginatedOrders = orders.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    useEffect(() => {
        setPage(1);
    }, [orders]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await orderService.getMyOrders();
                const fetchedOrders = Array.isArray(data) ? data : (data.items || data.Items || []);
                
                // Sắp xếp mới nhất lên đầu
                const sortedOrders = fetchedOrders.sort((a, b) => {
                    const dateA = new Date(a.createdAt || a.CreatedAt || 0);
                    const dateB = new Date(b.createdAt || b.CreatedAt || 0);
                    return dateB - dateA;
                });
                
                setOrders(sortedOrders);
            } catch (err) {
                console.error("Lỗi khi tải lịch sử đơn hàng:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const getStatusLabel = (status) => {
        const s = typeof status === 'string' ? status.toUpperCase() : status;
        switch (s) {
            case 0:
            case 'PENDING':
                return { label: 'Chờ xác nhận', color: COLORS.warning };
            case 1:
            case 'CONFIRMED':
                return { label: 'Đã xác nhận', color: COLORS.info };
            case 2:
            case 'SHIPPING':
                return { label: 'Đang giao hàng', color: COLORS.activeOrange };
            case 3:
            case 'COMPLETED':
            case 'DELIVERED':
                return { label: 'Giao thành công', color: COLORS.success };
            case 4:
            case 'CANCELLED':
                return { label: 'Đã hủy', color: COLORS.error };
            default:
                return { label: 'Không xác định', color: COLORS.textMuted };
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress size={40} sx={{ color: COLORS.primaryBlue }} />
            </Box>
        );
    }

    if (orders.length === 0) {
        return (
            <Box sx={{ width: '100%' }}>
                <Typography variant="h6" sx={{ color: COLORS.activeOrange, fontWeight: 800, mb: 3, textTransform: 'uppercase', fontSize: '1.1rem', letterSpacing: '0.5px' }}>
                    LỊCH SỬ ĐƠN HÀNG
                </Typography>

                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <ShoppingBagIcon sx={{ fontSize: '4rem', color: '#ccc', mb: 2 }} />
                    <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 600 }}>
                        Bạn chưa thực hiện đơn hàng nào.
                    </Typography>
                    <Button variant="outlined" component={Link} href="/" sx={{ mt: 2, borderRadius: '8px', textTransform: 'none', color: COLORS.primaryBlue, borderColor: COLORS.primaryBlue, fontWeight: 700 }}>
                        Tiếp tục mua sắm
                    </Button>
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant="h6" sx={{ color: COLORS.activeOrange, fontWeight: 800, mb: 3, textTransform: 'uppercase', fontSize: '1.1rem', letterSpacing: '0.5px' }}>
                LỊCH SỬ ĐƠN HÀNG ({orders.length})
            </Typography>

            <Stack spacing={3}>
                {paginatedOrders.map((order) => {
                    const statusInfo = getStatusLabel(order.status !== undefined ? order.status : order.Status);
                    const displayStatusLabel = statusInfo.label === 'Không xác định' 
                        ? (order.orderStatusName || order.OrderStatusName || '') 
                        : statusInfo.label;
                    const statusColor = statusInfo.color || COLORS.textMuted;

                    const orderDate = new Date(order.createdAt || order.CreatedAt).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });

                    const orderTotal = order.total !== undefined ? order.total : (order.Total !== undefined ? order.Total : (order.totalAmount || order.TotalAmount || 0));
                    const orderItems = order.items || order.Items || [];

                    return (
                        <Card key={order.id || order.Id} sx={{ borderRadius: '12px', border: '1px solid #e0eaf5', boxShadow: 'none' }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                                    {/* Bên trái: Mã đơn và Thời gian đặt */}
                                    <Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: COLORS.primaryBlue, lineHeight: 1.2 }}>
                                            Mã đơn: #{order.orderCode || order.id || order.Id}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.8 }}>
                                            <AccessTimeIcon sx={{ fontSize: '1rem' }} /> Thời gian đặt: {orderDate}
                                        </Typography>
                                    </Box>

                                    {/* Bên phải: Tổng thanh toán, trạng thái, và Nút theo dõi hành trình */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, flexWrap: 'wrap' }}>
                                        <Box sx={{ textAlign: 'left' }}>
                                            <Typography variant="caption" color="text.secondary" display="block" sx={{ fontSize: '0.75rem', lineHeight: 1.1 }}>
                                                Tổng thanh toán:
                                            </Typography>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: COLORS.activeOrange, lineHeight: 1.2 }}>
                                                {orderTotal.toLocaleString('vi-VN')} VND
                                            </Typography>
                                        </Box>

                                        {displayStatusLabel && (
                                            <Chip
                                                label={displayStatusLabel}
                                                size="small"
                                                sx={{
                                                    bgcolor: statusColor + '15',
                                                    color: statusColor,
                                                    fontWeight: 700,
                                                    borderRadius: '6px'
                                                }}
                                            />
                                        )}

                                        <Button
                                            variant="outlined"
                                            component={Link}
                                            href="/tracking"
                                            sx={{
                                                borderRadius: '8px',
                                                textTransform: 'none',
                                                color: COLORS.primaryBlue,
                                                borderColor: COLORS.primaryBlue,
                                                fontSize: '0.85rem',
                                                fontWeight: 700,
                                                py: 0.6
                                            }}
                                        >
                                            Theo dõi hành trình
                                        </Button>
                                    </Box>
                                </Box>

                                {orderItems.length > 0 && (
                                    <>
                                        <Divider sx={{ my: 2, borderStyle: 'dashed' }} />
                                        <Stack spacing={1.5}>
                                            {orderItems.map((item, idx) => (
                                                <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Typography variant="body2" sx={{ color: '#333', maxWidth: '70%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {item.product?.name || item.Product?.Name || 'Sản phẩm'} {item.variantName ? `(${item.variantName})` : ''} x {item.quantity}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                                        {((item.price || item.Price || 0) * item.quantity).toLocaleString('vi-VN')} VND
                                                    </Typography>
                                                </Box>
                                            ))}
                                        </Stack>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </Stack>

            {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination 
                        count={totalPages} 
                        page={page} 
                        onChange={(e, value) => setPage(value)} 
                        color="primary"
                        sx={{
                            '& .MuiPaginationItem-root': {
                                fontWeight: 700,
                                color: COLORS.primaryBlue
                            },
                            '& .Mui-selected': {
                                bgcolor: COLORS.primaryBlue + ' !important',
                                color: '#ffffff !important'
                            }
                        }}
                    />
                </Box>
            )}
        </Box>
    );
}
