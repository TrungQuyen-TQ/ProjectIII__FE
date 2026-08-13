// src/pages/admin/users.js
import React, { useState } from 'react';
import Head from 'next/head';
import {
    Box, Paper, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Avatar, Chip, Button, IconButton, TextField, 
    InputAdornment, Tabs, Tab, Dialog, DialogTitle, DialogContent, 
    DialogActions, Stack, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import AdminLayout from '../../layouts/AdminLayout';

// Mock initial data for Customers (Khách hàng)
const initialCustomers = [
    { id: 'CUST001', name: 'Nguyễn Văn A', email: 'vana@gmail.com', phone: '0912345678', status: 'active', avatar: 'https://i.pravatar.cc/150?img=12' },
    { id: 'CUST002', name: 'Trần Thị B', email: 'thib@gmail.com', phone: '0987654321', status: 'blocked', avatar: 'https://i.pravatar.cc/150?img=5' },
    { id: 'CUST003', name: 'Lê Văn C', email: 'vanc@gmail.com', phone: '0905555555', status: 'active', avatar: 'https://i.pravatar.cc/150?img=8' }
];

// Mock initial data for Staff (Nhân viên)
const initialStaff = [
    { id: 'STAFF001', name: 'Ngô Đức Huy', email: 'huy20@gmail.com', phone: '0966666666', role: 'Super Admin', status: 'active', avatar: 'https://i.pravatar.cc/150?img=11' },
    { id: 'STAFF002', name: 'Phạm Minh D', email: 'minhd@gmail.com', phone: '0977777777', role: 'Admin', status: 'active', avatar: 'https://i.pravatar.cc/150?img=15' },
    { id: 'STAFF003', name: 'Đỗ Hoàng E', email: 'hoange@gmail.com', phone: '0988888888', role: 'Nhân viên kho', status: 'active', avatar: 'https://i.pravatar.cc/150?img=13' }
];

export default function AdminUsersPage() {
    const [tabIndex, setTabIndex] = useState(0); // 0: Khách hàng, 1: Nhân viên
    const [customers, setCustomers] = useState(initialCustomers);
    const [staffList, setStaffList] = useState(initialStaff);
    const [searchQuery, setSearchQuery] = useState('');

    // CRUD Dialog States
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMode, setDialogMode] = useState('create'); // 'create', 'view', 'edit'
    const [selectedUser, setSelectedUser] = useState(null);

    // Form inputs state
    const [formInputs, setFormInputs] = useState({
        name: '',
        email: '',
        phone: '',
        status: 'active',
        role: 'Nhân viên kho' // Chỉ dành cho Staff
    });

    const handleTabChange = (event, newIndex) => {
        setTabIndex(newIndex);
        setSearchQuery('');
    };

    // Mở Dialog CRUD
    const handleOpenDialog = (mode, userObj = null) => {
        setDialogMode(mode);
        setSelectedUser(userObj);
        if (mode === 'create') {
            setFormInputs({
                name: '',
                email: '',
                phone: '',
                status: 'active',
                role: 'Nhân viên kho'
            });
        } else if (userObj) {
            setFormInputs({
                name: userObj.name,
                email: userObj.email,
                phone: userObj.phone,
                status: userObj.status,
                role: userObj.role || 'Nhân viên kho'
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedUser(null);
    };

    // Thực hiện Thêm mới hoặc Cập nhật
    const handleSaveUser = (e) => {
        e.preventDefault();
        
        if (tabIndex === 0) {
            // Khách hàng
            if (dialogMode === 'create') {
                const newCust = {
                    id: `CUST${Math.floor(100 + Math.random() * 900)}`,
                    name: formInputs.name,
                    email: formInputs.email,
                    phone: formInputs.phone,
                    status: formInputs.status,
                    avatar: `https://i.pravatar.cc/150?img=${Math.floor(1 + Math.random() * 70)}`
                };
                setCustomers(prev => [...prev, newCust]);
            } else if (dialogMode === 'edit') {
                setCustomers(prev => prev.map(c => c.id === selectedUser.id ? { ...c, ...formInputs } : c));
            }
        } else {
            // Nhân viên
            if (dialogMode === 'create') {
                const newStaff = {
                    id: `STAFF${Math.floor(100 + Math.random() * 900)}`,
                    name: formInputs.name,
                    email: formInputs.email,
                    phone: formInputs.phone,
                    role: formInputs.role,
                    status: formInputs.status,
                    avatar: `https://i.pravatar.cc/150?img=${Math.floor(1 + Math.random() * 70)}`
                };
                setStaffList(prev => [...prev, newStaff]);
            } else if (dialogMode === 'edit') {
                setStaffList(prev => prev.map(s => s.id === selectedUser.id ? { ...s, ...formInputs } : s));
            }
        }
        handleCloseDialog();
    };

    // Xóa tài khoản
    const handleDeleteUser = (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) {
            if (tabIndex === 0) {
                setCustomers(prev => prev.filter(c => c.id !== id));
            } else {
                setStaffList(prev => prev.filter(s => s.id !== id));
            }
        }
    };

    // Lọc dữ liệu tìm kiếm
    const filteredCustomers = customers.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery)
    );

    const filteredStaff = staffList.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.phone.includes(searchQuery)
    );

    return (
        <AdminLayout>
            <Head>
                <title>Quản lý Tài khoản | Admin</title>
            </Head>

            <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
                
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: '#1a0933' }}>Quản lý tài khoản</Typography>
                        <Typography variant="body2" color="text.secondary">Xem, thêm mới, phân quyền và điều chỉnh trạng thái tài khoản Khách hàng / Nhân viên.</Typography>
                    </Box>
                    <Button 
                        variant="contained" 
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenDialog('create')}
                        sx={{ bgcolor: '#673ab7', textTransform: 'none', borderRadius: '8px', fontWeight: 700 }}
                    >
                        {tabIndex === 0 ? 'Thêm khách hàng' : 'Thêm nhân viên'}
                    </Button>
                </Box>

                {/* Tabs chuyển đổi */}
                <Tabs value={tabIndex} onChange={handleTabChange} sx={{ borderBottom: '1px solid #e0e0e0', mb: 3 }}>
                    <Tab label="Khách hàng" sx={{ fontWeight: 700, textTransform: 'none', fontSize: '0.95rem' }} />
                    <Tab label="Nhân viên & Quản trị" sx={{ fontWeight: 700, textTransform: 'none', fontSize: '0.95rem' }} />
                </Tabs>

                {/* Thanh tìm kiếm */}
                <TextField
                    fullWidth
                    placeholder="Tìm kiếm tài khoản theo tên, email hoặc số điện thoại..."
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

                {/* BẢNG HIỂN THỊ */}
                <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '12px', border: '1px solid #e0e0e0', overflow: 'hidden' }}>
                    <Table>
                        <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>Tài khoản</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Số điện thoại</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                                {tabIndex === 1 && <TableCell sx={{ fontWeight: 700 }}>Vai trò</TableCell>}
                                <TableCell sx={{ fontWeight: 700 }}>Trạng thái</TableCell>
                                <TableCell sx={{ fontWeight: 700 }} align="right">Hành động</TableCell>
                            </TableRow>
                        </TableHead>
                        
                        <TableBody>
                            {tabIndex === 0 ? (
                                // TAB 1: KHÁCH HÀNG
                                filteredCustomers.map((cust) => (
                                    <TableRow key={cust.id} hover>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Avatar src={cust.avatar} sx={{ width: 40, height: 40 }} />
                                                <Box>
                                                    <Typography sx={{ fontWeight: 700, fontSize: '0.88rem' }}>{cust.name}</Typography>
                                                    <Typography variant="caption" color="text.secondary">{cust.id}</Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ fontSize: '0.85rem' }}>{cust.phone}</TableCell>
                                        <TableCell sx={{ fontSize: '0.85rem', color: '#555' }}>{cust.email}</TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={cust.status === 'active' ? 'Hoạt động' : 'Bị khóa'} 
                                                size="small" 
                                                sx={{ 
                                                    bgcolor: cust.status === 'active' ? '#e8f5e9' : '#ffebee', 
                                                    color: cust.status === 'active' ? '#2e7d32' : '#c62828',
                                                    fontWeight: 700 
                                                }} 
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton color="default" onClick={() => handleOpenDialog('view', cust)} title="Chi tiết"><VisibilityIcon /></IconButton>
                                            <IconButton color="primary" onClick={() => handleOpenDialog('edit', cust)} title="Chỉnh sửa"><EditIcon /></IconButton>
                                            <IconButton color="error" onClick={() => handleDeleteUser(cust.id)} title="Xóa"><DeleteIcon /></IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                // TAB 2: NHÂN VIÊN
                                filteredStaff.map((staff) => (
                                    <TableRow key={staff.id} hover>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Avatar src={staff.avatar} sx={{ width: 40, height: 40 }} />
                                                <Box>
                                                    <Typography sx={{ fontWeight: 700, fontSize: '0.88rem' }}>{staff.name}</Typography>
                                                    <Typography variant="caption" color="text.secondary">{staff.id}</Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ fontSize: '0.85rem' }}>{staff.phone}</TableCell>
                                        <TableCell sx={{ fontSize: '0.85rem', color: '#555' }}>{staff.email}</TableCell>
                                        <TableCell>
                                            <Chip label={staff.role} size="small" sx={{ bgcolor: '#ede7f6', color: '#673ab7', fontWeight: 700 }} />
                                        </TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={staff.status === 'active' ? 'Hoạt động' : 'Bị khóa'} 
                                                size="small" 
                                                sx={{ 
                                                    bgcolor: staff.status === 'active' ? '#e8f5e9' : '#ffebee', 
                                                    color: staff.status === 'active' ? '#2e7d32' : '#c62828',
                                                    fontWeight: 700 
                                                }} 
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton color="default" onClick={() => handleOpenDialog('view', staff)} title="Chi tiết"><VisibilityIcon /></IconButton>
                                            <IconButton color="primary" onClick={() => handleOpenDialog('edit', staff)} title="Chỉnh sửa"><EditIcon /></IconButton>
                                            <IconButton color="error" onClick={() => handleDeleteUser(staff.id)} disabled={staff.role === 'Super Admin'} title="Xóa"><DeleteIcon /></IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* DIALOG CRUD (THÊM / XEM / SỬA) */}
                <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: '12px' } }}>
                    <form onSubmit={handleSaveUser}>
                        <DialogTitle sx={{ fontWeight: 800, borderBottom: '1px solid #f0f0f0', pb: 2 }}>
                            {dialogMode === 'create' ? (tabIndex === 0 ? 'Thêm khách hàng mới' : 'Thêm nhân viên mới') :
                             dialogMode === 'view' ? 'Thông tin chi tiết tài khoản' : 'Chỉnh sửa tài khoản'}
                        </DialogTitle>

                        <DialogContent sx={{ pt: 3 }}>
                            <Stack spacing={3}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Họ và Tên"
                                    value={formInputs.name}
                                    onChange={(e) => setFormInputs(prev => ({ ...prev, name: e.target.value }))}
                                    slotProps={{ input: { readOnly: dialogMode === 'view' } }}
                                />
                                <TextField
                                    required
                                    fullWidth
                                    type="email"
                                    label="Địa chỉ Email"
                                    value={formInputs.email}
                                    onChange={(e) => setFormInputs(prev => ({ ...prev, email: e.target.value }))}
                                    slotProps={{ input: { readOnly: dialogMode === 'view' } }}
                                />
                                <TextField
                                    required
                                    fullWidth
                                    label="Số điện thoại"
                                    value={formInputs.phone}
                                    onChange={(e) => setFormInputs(prev => ({ ...prev, phone: e.target.value }))}
                                    slotProps={{ input: { readOnly: dialogMode === 'view' } }}
                                />

                                {tabIndex === 1 && (
                                    <FormControl fullWidth disabled={dialogMode === 'view'}>
                                        <InputLabel id="role-select-label">Vai trò / Chức vụ</InputLabel>
                                        <Select
                                            labelId="role-select-label"
                                            value={formInputs.role}
                                            label="Vai trò / Chức vụ"
                                            onChange={(e) => setFormInputs(prev => ({ ...prev, role: e.target.value }))}
                                        >
                                            <MenuItem value="Admin">Admin</MenuItem>
                                            <MenuItem value="Nhân viên kho">Nhân viên kho</MenuItem>
                                            <MenuItem value="Nhân viên đóng gói">Nhân viên đóng gói</MenuItem>
                                            <MenuItem value="Chăm sóc khách hàng">Chăm sóc khách hàng</MenuItem>
                                        </Select>
                                    </FormControl>
                                )}

                                <FormControl fullWidth disabled={dialogMode === 'view'}>
                                    <InputLabel id="status-select-label">Trạng thái tài khoản</InputLabel>
                                    <Select
                                        labelId="status-select-label"
                                        value={formInputs.status}
                                        label="Trạng thái tài khoản"
                                        onChange={(e) => setFormInputs(prev => ({ ...prev, status: e.target.value }))}
                                    >
                                        <MenuItem value="active">Hoạt động (Active)</MenuItem>
                                        <MenuItem value="blocked">Khóa tạm thời (Blocked)</MenuItem>
                                    </Select>
                                </FormControl>
                            </Stack>
                        </DialogContent>

                        <DialogActions sx={{ p: 3, borderTop: '1px solid #f0f0f0' }}>
                            <Button onClick={handleCloseDialog} sx={{ textTransform: 'none', fontWeight: 700 }}>Đóng</Button>
                            {dialogMode !== 'view' && (
                                <Button 
                                    type="submit" 
                                    variant="contained" 
                                    sx={{ bgcolor: '#673ab7', textTransform: 'none', fontWeight: 700 }}
                                >
                                    Lưu lại
                                </Button>
                            )}
                        </DialogActions>
                    </form>
                </Dialog>

            </Box>
        </AdminLayout>
    );
}
