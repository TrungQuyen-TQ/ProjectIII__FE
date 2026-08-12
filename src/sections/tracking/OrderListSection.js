import React, { useState } from 'react';
import { Box, Typography, Stack, Paper, Card, CardContent, Chip, Button } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export default function OrderListSection({ orders, selectedOrderId, setSelectedOrderId, COLORS, getStatusLabel }) {
    const [visibleCount, setVisibleCount] = useState(7);
    const visibleOrders = orders.slice(0, visibleCount);

    return (
        <Box sx={{ width: { xs: '100%', md: '33.333%' }, flexShrink: 0 }}>
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    borderRadius: '16px',
                    border: '1px solid #e0eaf5',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                    bgcolor: '#ffffff'
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: 800, color: COLORS.primaryBlue, mb: 2 }}>
                    Lịch sử đơn hàng ({orders.length})
                </Typography>
                <Stack spacing={2} sx={{ maxHeight: '70vh', overflowY: 'auto', pr: 1 }}>
                    {visibleOrders.map((order) => {
                        const statusInfo = getStatusLabel(order);
                        const isActive = (order.id || order.Id) === selectedOrderId;
                        const orderDate = new Date(order.createdAt || order.CreatedAt).toLocaleDateString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                        });

                        return (
                            <Card
                                key={order.id || order.Id}
                                onClick={() => setSelectedOrderId(order.id || order.Id)}
                                sx={{
                                    cursor: 'pointer',
                                    borderRadius: '12px',
                                    border: `2px solid ${isActive ? COLORS.activeOrange : 'transparent'}`,
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                                    transition: '0.3s',
                                    bgcolor: '#f8fafc',
                                    '&:hover': {
                                        boxShadow: '0 6px 18px rgba(0,0,0,0.06)',
                                        transform: 'translateY(-2px)'
                                    }
                                }}
                            >
                                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: COLORS.primaryBlue }}>
                                            #{order.orderCode || order.id || order.Id}
                                        </Typography>
                                        <Chip
                                            label={statusInfo.label}
                                            size="small"
                                            sx={{
                                                bgcolor: statusInfo.color + '15',
                                                color: statusInfo.color,
                                                fontWeight: 700,
                                                borderRadius: '6px'
                                            }}
                                        />
                                    </Box>
                                    
                                    <Stack spacing={0.5}>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <AccessTimeIcon sx={{ fontSize: '0.9rem' }} /> Ngày đặt: {orderDate}
                                        </Typography>
                                    </Stack>
                                </CardContent>
                            </Card>
                        );
                    })}
                    
                    {orders.length > visibleCount && (
                        <Button
                            variant="text"
                            fullWidth
                            onClick={() => setVisibleCount(prev => prev + 7)}
                            sx={{ mt: 1, fontWeight: 700, textTransform: 'none', color: COLORS.primaryBlue }}
                        >
                            Xem thêm đơn hàng...
                        </Button>
                    )}
                </Stack>
            </Paper>
        </Box>
    );
}
