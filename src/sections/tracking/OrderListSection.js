import React, { useState, useEffect } from 'react';
import { Box, Typography, Stack, Paper, Card, CardContent, Chip, Button, Menu, MenuItem, IconButton, Dialog, DialogContent, Pagination } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FilterListIcon from '@mui/icons-material/FilterList';

const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' VND';
};

export default function OrderListSection({ 
    orders, 
    selectedOrderId, 
    setSelectedOrderId, 
    COLORS, 
    getStatusLabel,
    selectedStatusTab,
    onStatusTabChange
}) {
    const [page, setPage] = useState(1);
    const itemsPerPage = 6;
    const totalPages = Math.ceil(orders.length / itemsPerPage);
    const paginatedOrders = orders.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    useEffect(() => {
        setPage(1);
    }, [orders]);

    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);

    const handleClickFilter = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleSelectFilter = (status) => {
        onStatusTabChange(status);
        handleCloseMenu();
    };

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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: COLORS.primaryBlue }}>
                        Lịch sử đơn hàng ({orders.length})
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {selectedStatusTab !== 'ALL' && (
                            <Chip 
                                label={selectedStatusTab} 
                                size="small" 
                                onDelete={() => onStatusTabChange('ALL')}
                                sx={{ bgcolor: COLORS.activeOrange + '15', color: COLORS.activeOrange, fontWeight: 700 }}
                            />
                        )}
                        <IconButton 
                            onClick={handleClickFilter}
                            sx={{ 
                                bgcolor: openMenu ? COLORS.activeOrange + '15' : '#f8fafc',
                                color: openMenu ? COLORS.activeOrange : COLORS.primaryBlue,
                                border: '1px solid #e0eaf5',
                                borderRadius: '8px',
                                p: 1,
                                '&:hover': {
                                    bgcolor: COLORS.activeOrange + '10'
                                }
                            }}
                        >
                            <FilterListIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>

                <Menu
                    anchorEl={anchorEl}
                    open={openMenu}
                    onClose={handleCloseMenu}
                    disableScrollLock
                    PaperProps={{
                        sx: {
                            borderRadius: '12px',
                            boxShadow: '0 8px 30px rgba(23, 71, 157, 0.08)',
                            border: '1px solid #e0eaf5',
                            minWidth: 150,
                            mt: 1
                        }
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <MenuItem onClick={() => handleSelectFilter('ALL')} selected={selectedStatusTab === 'ALL'} sx={{ fontWeight: 600, fontSize: '0.88rem', py: 1 }}>Tất cả</MenuItem>
                    <MenuItem onClick={() => handleSelectFilter('Mới')} selected={selectedStatusTab === 'Mới'} sx={{ fontWeight: 600, fontSize: '0.88rem', py: 1 }}>Mới</MenuItem>
                    <MenuItem onClick={() => handleSelectFilter('Đang xử lý')} selected={selectedStatusTab === 'Đang xử lý'} sx={{ fontWeight: 600, fontSize: '0.88rem', py: 1 }}>Đang xử lý</MenuItem>
                    <MenuItem onClick={() => handleSelectFilter('Hoàn tất')} selected={selectedStatusTab === 'Hoàn tất'} sx={{ fontWeight: 600, fontSize: '0.88rem', py: 1 }}>Hoàn tất</MenuItem>
                    <MenuItem onClick={() => handleSelectFilter('Đã hủy')} selected={selectedStatusTab === 'Đã hủy'} sx={{ fontWeight: 600, fontSize: '0.88rem', py: 1 }}>Đã hủy</MenuItem>
                </Menu>

                <Stack spacing={2} sx={{ maxHeight: '75vh', overflowY: 'auto', pr: 1 }}>
                    {paginatedOrders.map((order) => {
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
                                        boxShadow: '0 6px 18px rgba(0,0,0,0.06)'
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
                                    
                                    <Stack spacing={0.5} sx={{ mt: 1 }}>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <AccessTimeIcon sx={{ fontSize: '0.9rem' }} /> Ngày đặt: {orderDate}
                                        </Typography>
                                    </Stack>
                                </CardContent>
                            </Card>
                        );
                    })}
                </Stack>

                {totalPages > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                        <Pagination 
                            count={totalPages} 
                            page={page} 
                            onChange={(e, value) => setPage(value)} 
                            size="small" 
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
            </Paper>
        </Box>
    );
}
