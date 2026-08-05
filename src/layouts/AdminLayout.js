import React from 'react';
import { Box } from '@mui/material';
import Sidebar from '../components/admin/Sidebar';

const DRAWER_WIDTH = 260;
const COLORS = {
    primary: '#673ab7',
    primaryLight: '#ede7f6',
    bg: '#f8f9fa'
};

export default function AdminLayout({ children }) {
    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: COLORS.bg }}>
            {/* Thanh Sidebar điều hướng bên trái (Có thông tin Admin dưới cùng) */}
            <Sidebar drawerWidth={DRAWER_WIDTH} colors={COLORS} />

            {/* Khung nội dung chính bên phải (Bỏ hoàn toàn Header cũ) */}
            <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto', p: 4 }}>
                {children}
            </Box>
        </Box>
    );
}
