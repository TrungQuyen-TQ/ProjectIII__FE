import React, { useState } from 'react';
import {
    Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Collapse, Typography, Divider, Avatar
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { logoutUser } from '../../redux/slices/authSlice';
import Link from 'next/link';

// Icons
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

export default function Sidebar({ drawerWidth, colors }) {
    const dispatch = useDispatch();
    const router = useRouter();
    const [productOpen, setProductOpen] = useState(router.pathname.startsWith('/admin/products'));

    const handleAdminLogout = () => {
        if (window.confirm("Bạn có chắc chắn muốn đăng xuất khỏi quyền Admin?")) {
            dispatch(logoutUser());
            router.push('/');
        }
    };

    const isActive = (path) => {
        return router.pathname === path;
    };

    return (
        <Box sx={{
            width: drawerWidth,
            height: '100vh',
            bgcolor: '#1a0933', // Nền tím đậm sang trọng làm nổi bật logo trắng
            color: 'rgba(255, 255, 255, 0.7)',
            display: 'flex',
            flexDirection: 'column',
            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
            position: 'sticky',
            top: 0
        }}>
            {/* Logo area */}
            <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box component="img" src="/logo-art-white.svg" alt="Arts Logo" sx={{ height: 36, width: 'auto', objectFit: 'contain' }} />
            </Box>

            {/* Menu List */}
            <List sx={{ px: 2, flexGrow: 1, overflowY: 'auto', '&::-webkit-scrollbar': { width: 0 } }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'rgba(255, 255, 255, 0.4)', ml: 2, mb: 1, display: 'block', textTransform: 'uppercase', fontSize: '0.7rem' }}>
                    Quản lý chung
                </Typography>

                {/* 1. Dashboard */}
                <ListItem disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton 
                        component={Link} 
                        href="/admin" 
                        selected={isActive('/admin')} 
                        sx={{
                            borderRadius: '8px',
                            color: isActive('/admin') ? 'white' : 'rgba(255, 255, 255, 0.7)',
                            '&.Mui-selected': { bgcolor: colors.primary, color: 'white' },
                            '&.Mui-selected:hover': { bgcolor: colors.primary }
                        }}
                    >
                        <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}><DashboardOutlinedIcon /></ListItemIcon>
                        <ListItemText primary="Dashboard" primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }} />
                    </ListItemButton>
                </ListItem>

                {/* 2. Quản lý tài khoản */}
                <ListItem disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton 
                        component={Link} 
                        href="/admin/users" 
                        selected={isActive('/admin/users')} 
                        sx={{
                            borderRadius: '8px',
                            color: isActive('/admin/users') ? 'white' : 'rgba(255, 255, 255, 0.7)',
                            '&.Mui-selected': { bgcolor: colors.primary, color: 'white' },
                            '&.Mui-selected:hover': { bgcolor: colors.primary },
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' }
                        }}
                    >
                        <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}><PeopleOutlinedIcon /></ListItemIcon>
                        <ListItemText primary="Quản lý tài khoản" primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }} />
                    </ListItemButton>
                </ListItem>

                <Typography variant="caption" sx={{ fontWeight: 700, color: 'rgba(255, 255, 255, 0.4)', ml: 2, mt: 2.5, mb: 1, display: 'block', textTransform: 'uppercase', fontSize: '0.7rem' }}>
                    Sản phẩm & Danh mục
                </Typography>

                {/* 3. Danh mục */}
                <ListItem disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton 
                        component={Link} 
                        href="/admin/categories" 
                        selected={isActive('/admin/categories')} 
                        sx={{
                            borderRadius: '8px',
                            color: isActive('/admin/categories') ? 'white' : 'rgba(255, 255, 255, 0.7)',
                            '&.Mui-selected': { bgcolor: colors.primary, color: 'white' },
                            '&.Mui-selected:hover': { bgcolor: colors.primary },
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' }
                        }}
                    >
                        <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}><CategoryOutlinedIcon /></ListItemIcon>
                        <ListItemText primary="Danh mục" primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }} />
                    </ListItemButton>
                </ListItem>

                {/* 4. Sản phẩm */}
                <ListItem disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton 
                        onClick={() => setProductOpen(!productOpen)} 
                        sx={{ 
                            borderRadius: '8px', 
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } 
                        }}
                    >
                        <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}><Inventory2OutlinedIcon /></ListItemIcon>
                        <ListItemText primary="Sản phẩm" primaryTypographyProps={{ fontSize: '0.9rem' }} />
                        {productOpen ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                </ListItem>
                <Collapse in={productOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding sx={{ pl: 4 }}>
                        <ListItemButton 
                            component={Link} 
                            href="/admin/products" 
                            selected={isActive('/admin/products')}
                            sx={{ 
                                borderRadius: '6px', 
                                mb: 0.5, 
                                color: isActive('/admin/products') ? 'white' : 'inherit',
                                '&.Mui-selected': { bgcolor: 'rgba(103, 58, 183, 0.4)', color: 'white' },
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } 
                            }}
                        >
                            <ListItemText primary="Danh sách sản phẩm" primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: isActive('/admin/products') ? 700 : 500 }} />
                        </ListItemButton>
                    </List>
                </Collapse>

                <Typography variant="caption" sx={{ fontWeight: 700, color: 'rgba(255, 255, 255, 0.4)', ml: 2, mt: 2.5, mb: 1, display: 'block', textTransform: 'uppercase', fontSize: '0.7rem' }}>
                    Kinh doanh
                </Typography>

                {/* 5. Đơn hàng */}
                <ListItem disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton 
                        component={Link} 
                        href="/admin/orders" 
                        selected={isActive('/admin/orders')}
                        sx={{ 
                            borderRadius: '8px', 
                            color: isActive('/admin/orders') ? 'white' : 'rgba(255, 255, 255, 0.7)',
                            '&.Mui-selected': { bgcolor: colors.primary, color: 'white' },
                            '&.Mui-selected:hover': { bgcolor: colors.primary },
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } 
                        }}
                    >
                        <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}><ReceiptLongOutlinedIcon /></ListItemIcon>
                        <ListItemText primary="Đơn hàng" primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }} />
                    </ListItemButton>
                </ListItem>

                {/* 6. Thanh toán */}
                <ListItem disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton 
                        component={Link} 
                        href="/admin/payments" 
                        selected={isActive('/admin/payments')}
                        sx={{ 
                            borderRadius: '8px', 
                            color: isActive('/admin/payments') ? 'white' : 'rgba(255, 255, 255, 0.7)',
                            '&.Mui-selected': { bgcolor: colors.primary, color: 'white' },
                            '&.Mui-selected:hover': { bgcolor: colors.primary },
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } 
                        }}
                    >
                        <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}><PaymentOutlinedIcon /></ListItemIcon>
                        <ListItemText primary="Thanh toán" primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }} />
                    </ListItemButton>
                </ListItem>

                {/* 7. Đánh giá */}
                <ListItem disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton 
                        component={Link} 
                        href="/admin/reviews" 
                        selected={isActive('/admin/reviews')}
                        sx={{ 
                            borderRadius: '8px', 
                            color: isActive('/admin/reviews') ? 'white' : 'rgba(255, 255, 255, 0.7)',
                            '&.Mui-selected': { bgcolor: colors.primary, color: 'white' },
                            '&.Mui-selected:hover': { bgcolor: colors.primary },
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } 
                        }}
                    >
                        <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}><StarBorderIcon /></ListItemIcon>
                        <ListItemText primary="Đánh giá" primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }} />
                    </ListItemButton>
                </ListItem>
            </List>

            <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.08)', mx: 2, mb: 1.5 }} />

            {/* Khối Admin đặt ở dưới cùng Sidebar */}
            <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar 
                    src="https://i.pravatar.cc/150?img=11" 
                    sx={{ width: 38, height: 38, border: '1px solid rgba(255, 255, 255, 0.15)' }} 
                />
                <Box>
                    <Typography 
                        variant="subtitle2" 
                        sx={{ fontWeight: 800, color: 'white', lineHeight: 1.2, fontSize: '0.85rem' }}
                    >
                        Huy Admin
                    </Typography>
                    <Typography 
                        variant="caption" 
                        sx={{ color: '#ff910d', display: 'block', fontSize: '0.7rem', mt: 0.2, fontWeight: 700 }}
                    >
                        Super Admin
                    </Typography>
                    <Typography
                        variant="caption"
                        onClick={handleAdminLogout}
                        sx={{
                            color: 'rgba(255, 255, 255, 0.5)',
                            display: 'inline-block',
                            fontSize: '0.7rem',
                            cursor: 'pointer',
                            mt: 0.5,
                            textDecoration: 'underline',
                            '&:hover': { color: '#ef4444' }
                        }}
                    >
                        Đăng xuất
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}
