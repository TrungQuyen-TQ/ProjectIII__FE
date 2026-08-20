import React, { useState } from 'react';
import {
    Box, Container, Paper, Typography, Avatar,
    Button, Breadcrumbs, Divider, List, ListItem, ListItemButton,
    ListItemIcon, ListItemText
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { logoutUser } from '../../redux/slices/authSlice';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

// Icons
import PersonIcon from '@mui/icons-material/Person';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MainLayout from '@/layouts/MainLayout';

// Import components con từ folder sections/profile
import ProfileInfo from '../../sections/profile/ProfileInfo';
import AddressBook from '../../sections/profile/AddressBook';
import OrderHistory from '../../sections/profile/OrderHistory';

const COLORS = {
    primaryBlue: '#17479d',       // Tone xanh đặc trưng của Arts
    activeOrange: '#ff910d',      // Tone cam đặc trưng
    bgLight: '#e5f2fb',          // Tone nền siêu nhạt ăn nhập trang chủ
    borderGray: '#e0eaf5',
    textMuted: '#666'
};

export default function ProfilePage() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { user } = useSelector((state) => state.auth);

    // State quản lý Tab hiện tại - Mặc định là Thông tin tài khoản
    const [activeTab, setActiveTab] = useState('info');

    // Số lượng địa chỉ đã lưu (do AddressBook tự tải qua addressService và báo lên để hiển thị ở menu)
    const [addressCount, setAddressCount] = useState(0);

    const handleLogout = () => {
        toast((t) => (
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, p: 0.5, minWidth: 280 }}>
                <Box sx={{ 
                    bgcolor: 'rgba(239, 68, 68, 0.1)', 
                    color: '#ef4444', 
                    borderRadius: '50%', 
                    p: 1, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexShrink: 0
                }}>
                    <ExitToAppIcon sx={{ fontSize: 20 }} />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, flexGrow: 1 }}>
                    <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b', mb: 0.5, lineHeight: 1.2 }}>
                            Xác nhận đăng xuất
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.82rem', lineHeight: 1.4 }}>
                            Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        <Button 
                            size="small" 
                            variant="text" 
                            onClick={() => toast.dismiss(t.id)}
                            sx={{ 
                                textTransform: 'none', 
                                fontWeight: 600, 
                                color: '#64748b',
                                borderRadius: '8px',
                                px: 2,
                                '&:hover': { bgcolor: '#f1f5f9' }
                            }}
                        >
                            Hủy
                        </Button>
                        <Button 
                            size="small" 
                            variant="contained" 
                            onClick={() => {
                                toast.dismiss(t.id);
                                dispatch(logoutUser());
                                 router.push('/');
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
                                                     Thông báo
                                                 </div>
                                                 <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 500, lineHeight: 1.3 }}>
                                                     Đăng xuất thành công!
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
                                     duration: 3000
                                 });
                            }}
                            sx={{ 
                                textTransform: 'none', 
                                borderRadius: '8px', 
                                px: 2.5, 
                                bgcolor: '#ef4444',
                                fontWeight: 600,
                                boxShadow: 'none',
                                '&:hover': { bgcolor: '#dc2626', boxShadow: 'none' } 
                            }}
                        >
                            Đăng xuất
                        </Button>
                    </Box>
                </Box>
            </Box>
        ), {
            duration: 6000,
            position: 'top-center',
            style: {
                borderRadius: '16px',
                background: '#ffffff',
                color: '#1e293b',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                padding: '16px',
                border: '1px solid #f1f5f9',
                maxWidth: '380px'
            }
        });
    };

    // Lấy chữ cái đầu (Ví dụ: Ngô Đức Huy -> NĐ)
    const getInitials = () => {
        if (!user) return "U";
        const first = user.firstName?.charAt(0) || "";
        const last = user.lastName?.charAt(0) || "";
        return (last + first).toUpperCase();
    };

    const getFullName = () => {
        if (!user) return "";
        const parts = [];
        if (user.lastName) parts.push(user.lastName);
        if (user.middleName) parts.push(user.middleName);
        if (user.firstName) parts.push(user.firstName);
        return parts.join(' ') || user.email;
    };

    if (!user) {
        return (
            <MainLayout>
                <Container maxWidth="xl" sx={{ py: 10, textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ mb: 3 }}>Vui lòng đăng nhập để xem thông tin cá nhân.</Typography>
                    <Button variant="contained" component={Link} href="/auth/login" sx={{ bgcolor: COLORS.primaryBlue }}>Đăng nhập ngay</Button>
                </Container>
            </MainLayout>
        );
    }

    // Danh sách Menu dọc bên trái
    const menuItems = [
        { id: 'info', label: 'Thông tin tài khoản', icon: <PersonIcon fontSize="small" /> },
        { id: 'address', label: `Sổ địa chỉ (${addressCount})`, icon: <LocationOnIcon fontSize="small" /> },
        { id: 'orders', label: 'Danh sách đơn hàng', icon: <ShoppingBagIcon fontSize="small" /> }
    ];

    const getTabName = () => {
        const found = menuItems.find(item => item.id === activeTab);
        return found ? found.label : 'Tài khoản';
    };

    return (
        <MainLayout>
            <Box sx={{ bgcolor: COLORS.bgLight, minHeight: '100vh', pb: { xs: 6, md: 10 } }}>
                
                {/* 1. BREADCRUMBS PHÍA TRÊN */}
                <Box sx={{ bgcolor: '#ffffff', py: 1.5, mb: 4, borderBottom: '1px solid #e0eaf5' }}>
                    <Container maxWidth="xl">
                        <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: '0.88rem' }}>
                            <Link href="/" style={{ textDecoration: 'none', color: '#17479d', fontWeight: 500 }}>
                                Trang chủ
                            </Link>
                            <Typography color="text.secondary" sx={{ fontSize: '0.88rem' }}>Tài khoản</Typography>
                            <Typography color="text.primary" sx={{ fontWeight: 600, fontSize: '0.88rem' }}>{getTabName()}</Typography>
                        </Breadcrumbs>
                    </Container>
                </Box>

                <Container maxWidth="xl">
                    {/* Bố cục Flexbox thuần CSS */}
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, alignItems: 'flex-start' }}>

                        {/* 2. CỘT MENU TRÁI (Chiếm 1/3 ~ 4 phần) */}
                        <Box sx={{ 
                            width: { xs: '100%', md: '33.333%' }, 
                            flexShrink: 0,
                            position: { xs: 'static', md: 'sticky' },
                            top: { xs: 'auto', md: 140 },
                            zIndex: 10
                        }}>
                            <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: `1px solid ${COLORS.borderGray}`, bgcolor: '#ffffff' }}>
                                {/* Avatar & Lời chào */}
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                                    <Avatar sx={{ width: 80, height: 80, bgcolor: COLORS.activeOrange, fontSize: '2rem', mb: 2, fontWeight: 800, color: 'white' }}>
                                        {getInitials()}
                                    </Avatar>
                                    <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#555', fontWeight: 500, textAlign: 'center' }}>
                                        Xin chào, <span style={{ fontWeight: 700, color: COLORS.primaryBlue }}>{getFullName()}</span>
                                    </Typography>
                                </Box>

                                <Divider sx={{ mb: 2 }} />

                                {/* List Menu dọc */}
                                <List sx={{ p: 0 }}>
                                    {menuItems.map((item) => (
                                        <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
                                            <ListItemButton
                                                onClick={() => setActiveTab(item.id)}
                                                sx={{
                                                    borderRadius: '8px',
                                                    py: 1.2,
                                                    bgcolor: activeTab === item.id ? COLORS.activeOrange : COLORS.primaryBlue,
                                                    color: 'white',
                                                    '&:hover': {
                                                        bgcolor: activeTab === item.id ? '#e07d00' : '#0f3170',
                                                    }
                                                }}
                                            >
                                                <ListItemIcon sx={{ color: 'white', minWidth: 35 }}>
                                                    {item.icon}
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={item.label}
                                                    primaryTypographyProps={{ fontSize: '0.88rem', fontWeight: 700 }}
                                                />
                                            </ListItemButton>
                                        </ListItem>
                                    ))}

                                    {/* Nút Đăng xuất */}
                                    <ListItem disablePadding sx={{ mt: 1 }}>
                                        <ListItemButton
                                            onClick={handleLogout}
                                            sx={{
                                                borderRadius: '8px',
                                                py: 1.2,
                                                bgcolor: COLORS.primaryBlue,
                                                color: 'white',
                                                '&:hover': {
                                                    bgcolor: '#0f3170',
                                                }
                                            }}
                                        >
                                            <ListItemIcon sx={{ color: 'white', minWidth: 35 }}>
                                                <ExitToAppIcon fontSize="small" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary="Đăng xuất"
                                                primaryTypographyProps={{ fontSize: '0.88rem', fontWeight: 700 }}
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                </List>
                            </Paper>
                        </Box>

                        {/* 3. CỘT NỘI DUNG PHẢI (Chiếm 2/3 ~ 8 phần) */}
                        <Box sx={{ flexGrow: 1, width: '100%' }}>
                            <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', border: `1px solid ${COLORS.borderGray}`, bgcolor: '#ffffff', minHeight: 450 }}>
                                
                                {/* TAB 1: THÔNG TIN TÀI KHOẢN */}
                                {activeTab === 'info' && (
                                    <ProfileInfo user={user} />
                                )}

                                {/* TAB 2: SỔ ĐỊA CHỈ */}
                                {activeTab === 'address' && (
                                    <AddressBook onCountChange={setAddressCount} />
                                )}

                                {/* TAB 3: DANH SÁCH ĐƠN HÀNG */}
                                {activeTab === 'orders' && (
                                    <OrderHistory />
                                )}

                            </Paper>
                        </Box>

                    </Box>
                </Container>
            </Box>
        </MainLayout>
    );
}