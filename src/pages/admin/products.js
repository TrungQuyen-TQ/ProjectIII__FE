// src/pages/admin/products.js
import React, { useState } from 'react';
import Head from 'next/head';
import {
    Box, Paper, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Avatar, Button, IconButton, TextField, InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import AdminLayout from '../../layouts/AdminLayout';
import { getProductImageUrl } from '../../utils/imageHelper';

const dummyProducts = [
    { id: 1, name: 'Bút Gel Thiên Long Pokémon GEL-045/PKM – Mực Xanh 0.5mm', category: 'Bút học sinh', price: 10800, stock: 245, image: 'https://images.unsplash.com/photo-1583485088034-697b5a624f47?w=150&q=80' },
    { id: 2, name: 'Bút Gel Thiên Long GOAL GEL-052 Quick Dry – 0.5mm', category: 'Bút văn phòng', price: 10800, stock: 128, image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=150&q=80' },
    { id: 3, name: 'Tập Học Sinh 96 Trang Arts cao cấp', category: 'Vở viết', price: 9000, stock: 450, image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=150&q=80' },
    { id: 4, name: 'Hộp Màu Vẽ Acrylic 12 Màu Đa Năng', category: 'Họa cụ', price: 79000, stock: 85, image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=150&q=80' }
];

export default function AdminProductsPage() {
    const [products, setProducts] = useState(dummyProducts);
    const [searchQuery, setSearchQuery] = useState('');

    const handleDelete = (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
            setProducts(prev => prev.filter(p => p.id !== id));
        }
    };

    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price) + ' VND';
    };

    return (
        <AdminLayout>
            <Head>
                <title>Quản lý Sản phẩm | Admin</title>
            </Head>

            <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
                {/* Header & Button */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: '#1a0933' }}>Quản lý sản phẩm</Typography>
                        <Typography variant="body2" color="text.secondary">Xem danh sách, thêm mới, sửa đổi hoặc xóa các mặt hàng trong kho.</Typography>
                    </Box>
                    <Button 
                        variant="contained" 
                        startIcon={<AddIcon />}
                        sx={{ bgcolor: '#673ab7', textTransform: 'none', borderRadius: '8px', fontWeight: 700 }}
                    >
                        Thêm sản phẩm
                    </Button>
                </Box>

                {/* Search Bar */}
                <TextField
                    fullWidth
                    placeholder="Tìm kiếm sản phẩm bằng tên hoặc danh mục..."
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

                {/* Products Table */}
                <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '12px', border: '1px solid #e0e0e0', overflow: 'hidden' }}>
                    <Table>
                        <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>Ảnh</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Tên sản phẩm</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Danh mục</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Đơn giá</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Tồn kho</TableCell>
                                <TableCell sx={{ fontWeight: 700 }} align="right">Hành động</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredProducts.map((product) => (
                                <TableRow key={product.id} hover>
                                    <TableCell>
                                        <Avatar src={getProductImageUrl(product.image)} variant="rounded" sx={{ width: 45, height: 45, border: '1px solid #e0e0e0' }} />
                                    </TableCell>
                                    <TableCell>
                                        <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#1a1a1a', maxWidth: 450, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.3 }}>
                                            {product.name}
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ fontSize: '0.85rem', color: '#555', fontWeight: 600 }}>{product.category}</TableCell>
                                    <TableCell sx={{ fontSize: '0.88rem', color: '#673ab7', fontWeight: 700 }}>{formatPrice(product.price)}</TableCell>
                                    <TableCell sx={{ fontSize: '0.88rem', fontWeight: 600, color: product.stock < 100 ? 'red' : 'text.secondary' }}>{product.stock} pcs</TableCell>
                                    <TableCell align="right">
                                        <IconButton color="primary" title="Sửa">
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton color="error" onClick={() => handleDelete(product.id)} title="Xóa">
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </AdminLayout>
    );
}
