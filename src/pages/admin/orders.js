// src/pages/admin/orders.js
import React, { useState } from 'react';
import Head from 'next/head';
import {
    Box, Paper, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Chip, IconButton, TextField, InputAdornment, Menu, MenuItem
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import AdminLayout from '../../layouts/AdminLayout';

const dummyOrders = [
    { id: 'ORD001', customer: 'Ngô Đức Huy', date: '2026-08-05', total: 314000, payment: 'COD', status: 'shipping' },
    { id: 'ORD002', customer: 'Nguyễn Văn A', date: '2026-08-04', total: 64800, payment: 'Chuyển khoản', status: 'pending' },
    { id: 'ORD003', customer: 'Trần Thị B', date: '2026-08-03', total: 120000, payment: 'COD', status: 'completed' },
    { id: 'ORD004', customer: 'Lê Văn C', date: '2026-08-02', total: 95000, payment: 'Chuyển khoản', status: 'cancelled' }
];

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState(dummyOrders);
    const [searchQuery, setSearchQuery] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [activeOrderId, setActiveOrderId] = useState(null);

    const handleOpenMenu = (event, id) => {
        setAnchorEl(event.currentTarget);
        setActiveOrderId(id);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
        setActiveOrderId(null);
    };

    const handleStatusChange = (status) => {
        setOrders(prev => prev.map(o => {
            if (o.id === activeOrderId) {
                return { ...o, status };
            }
            return o;
        }));
        handleCloseMenu();
    };

    const filteredOrders = orders.filter(o => 
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
        o.customer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
    };

    // Chi tiết dịch nghĩa trạng thái sang màu sắc
    const getStatusChip = (status) => {
        switch (status) {
            case 'pending':
                return <Chip label="Chờ xử lý" size="small" sx={{ bgcolor: '#fff3e0', color: '#e65100', fontWeight: 700 }} />;
            case 'shipping':
                return <Chip label="Đang giao hàng" size="small" sx={{ bgcolor: '#e3f2fd', color: '#0d47a1', fontWeight: 700 }} />;
            case 'completed':
                return <Chip label="Hoàn thành" size="small" sx={{ bgcolor: '#e8f5e9', color: '#1b5e20', fontWeight: 700 }} />;
            case 'cancelled':
                return <Chip label="Đã hủy" size="small" sx={{ bgcolor: '#ffebee', color: '#b71c1c', fontWeight: 700 }} />;
            default:
                return <Chip label={status} size="small" />;
        }
    };

    return (
        <AdminLayout>
            <Head>
                <title>Quản lý Đơn hàng | Admin</title>
            </Head>

            <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
                {/* Header */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#1a0933' }}>Quản lý đơn hàng</Typography>
                    <Typography variant="body2" color="text.secondary">Xem chi tiết hóa đơn mua hàng và cập nhật tình trạng giao nhận.</Typography>
                </Box>

                {/* Search Bar */}
                <TextField
                    fullWidth
                    placeholder="Tìm kiếm bằng Mã đơn hoặc Tên khách hàng..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{ mb: 4, '& .MuiOutlinedInput-root': { borderRadius: '10px', bgcolor: 'white' } }}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: 'text.secondary' }} />
                                </InputAdornment>
                            )
                        }
                    }}
                />

                {/* Orders Table */}
                <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '12px', border: '1px solid #e0e0e0', overflow: 'hidden' }}>
                    <Table>
                        <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>Mã Đơn</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Khách hàng</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Ngày đặt</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Tổng tiền</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Hình thức</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Trạng thái</TableCell>
                                <TableCell sx={{ fontWeight: 700 }} align="right">Cập nhật</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredOrders.map((order) => (
                                <TableRow key={order.id} hover>
                                    <TableCell sx={{ fontWeight: 700, color: '#1a0933' }}>{order.id}</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>{order.customer}</TableCell>
                                    <TableCell sx={{ fontSize: '0.88rem', color: '#555' }}>{order.date}</TableCell>
                                    <TableCell sx={{ fontWeight: 700, color: '#673ab7' }}>{formatPrice(order.total)}</TableCell>
                                    <TableCell sx={{ fontSize: '0.85rem', color: '#666', fontWeight: 600 }}>{order.payment}</TableCell>
                                    <TableCell>{getStatusChip(order.status)}</TableCell>
                                    <TableCell align="right">
                                        <IconButton onClick={(e) => handleOpenMenu(e, order.id)} color="primary" title="Đổi trạng thái">
                                            <EditIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Menu chuyển đổi trạng thái */}
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleCloseMenu}
                    PaperProps={{ sx: { borderRadius: '8px', minWidth: 150 } }}
                >
                    <MenuItem onClick={() => handleStatusChange('pending')}>Chờ xử lý</MenuItem>
                    <MenuItem onClick={() => handleStatusChange('shipping')}>Đang giao hàng</MenuItem>
                    <MenuItem onClick={() => handleStatusChange('completed')}>Hoàn thành</MenuItem>
                    <MenuItem onClick={() => handleStatusChange('cancelled')}>Hủy đơn</MenuItem>
                </Menu>
            </Box>
        </AdminLayout>
    );
}
