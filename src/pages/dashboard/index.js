// src/pages/dashboard/index.js
import React from 'react';
import Head from 'next/head';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, Toolbar, AppBar, Grid, Card, CardContent, Button } from '@mui/material';
import Link from 'next/link';

// Icons cho Dashboard
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import PeopleIcon from '@mui/icons-material/People';
import FeedbackIcon from '@mui/icons-material/Feedback';
import LockResetIcon from '@mui/icons-material/LockReset';
import LogoutIcon from '@mui/icons-material/Logout';

const drawerWidth = 260;

export default function Dashboard() {
  // Giả lập quyền hiện tại (Trong thực tế sẽ lấy từ Context/Redux/Token)
  const role = 'ADMIN'; // Có thể đổi thành 'STAFF' để xem sự khác biệt quyền hạn

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f5f7fa', minHeight: '100vh' }}>
      <Head>
        <title>Hệ thống Quản trị | Tạp Hóa Store</title>
      </Head>

      {/* APP BAR - Thanh điều hướng trên cùng */}
      <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`, bgcolor: 'white', color: '#17479d', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 800 }}>
            {role === 'ADMIN' ? 'Bảng Điều Khiển Quản Trị Viên (Admin)' : 'Bảng Điều Khiển Nhân Viên (Staff)'}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* SIDEBAR - Cột Menu bên trái */}
      <Drawer
        sx={{
          width: drawerWidth, flexShrink: 0,
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', bgcolor: '#17479d', color: 'white' },
        }}
        variant="permanent"
        anchor="left"
      >
        <Box sx={{ p: 3, textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <Typography variant="h5" sx={{ fontWeight: 900, fontStyle: 'italic' }}>
            TẠP HÓA <span style={{ color: '#ff910d' }}>STORE</span>
          </Typography>
          <Typography variant="caption" sx={{ color: '#bce2ff' }}>Hệ thống nội bộ</Typography>
        </Box>

        <List sx={{ pt: 2 }}>
          <ListItem button sx={{ mb: 1, '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemIcon><DashboardIcon sx={{ color: 'white' }} /></ListItemIcon>
            <ListItemText primary="Tổng quan" />
          </ListItem>

          {/* QUYỀN CHUNG: Cả Admin và Nhân viên đều thấy */}
          <ListItem button sx={{ mb: 1, '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemIcon><ShoppingBagIcon sx={{ color: 'white' }} /></ListItemIcon>
            <ListItemText primary="Quản lý Đơn hàng" secondary="Xem & cập nhật trạng thái" secondaryTypographyProps={{ color: '#bce2ff', fontSize: '0.75rem' }} />
          </ListItem>
          
          <ListItem button sx={{ mb: 1, '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemIcon><FeedbackIcon sx={{ color: 'white' }} /></ListItemIcon>
            <ListItemText primary="Đánh giá & Góp ý" secondary="Xem feedback khách hàng" secondaryTypographyProps={{ color: '#bce2ff', fontSize: '0.75rem' }} />
          </ListItem>

          {/* QUYỀN ADMIN: Chỉ Admin mới thấy Quản lý Sản phẩm và Quản lý Nhân viên */}
          {role === 'ADMIN' && (
            <>
              <ListItem button sx={{ mb: 1, '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
                <ListItemIcon><InventoryIcon sx={{ color: '#ff910d' }} /></ListItemIcon>
                <ListItemText primary="Quản lý Sản phẩm" secondary="Thêm, sửa, xóa" secondaryTypographyProps={{ color: '#ff910d', fontSize: '0.75rem' }} />
              </ListItem>
              <ListItem button sx={{ mb: 1, '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
                <ListItemIcon><PeopleIcon sx={{ color: '#ff910d' }} /></ListItemIcon>
                <ListItemText primary="Quản lý Nhân viên" secondary="Tạo tài khoản NV mới" secondaryTypographyProps={{ color: '#ff910d', fontSize: '0.75rem' }} />
              </ListItem>
            </>
          )}
        </List>

        <Box sx={{ mt: 'auto', p: 2 }}>
          <Button fullWidth variant="outlined" startIcon={<LockResetIcon />} sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)', mb: 2 }}>
            Đổi mật khẩu
          </Button>
          <Button component={Link} href="/" fullWidth variant="contained" startIcon={<LogoutIcon />} sx={{ bgcolor: '#ff910d', '&:hover': { bgcolor: '#e07d00' } }}>
            Thoát hệ thống
          </Button>
        </Box>
      </Drawer>

      {/* MAIN CONTENT - Vùng hiển thị dữ liệu */}
      <Box component="main" sx={{ flexGrow: 1, p: 4, mt: 8 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#17479d', mb: 4 }}>
          Tóm tắt hoạt động hôm nay
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2, borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderLeft: '4px solid #17479d' }}>
              <Typography color="text.secondary" variant="subtitle2">Đơn hàng mới chờ xử lý</Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, mt: 1 }}>24</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2, borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderLeft: '4px solid #ff910d' }}>
              <Typography color="text.secondary" variant="subtitle2">Đơn đang giao (Nhân viên cập nhật)</Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, mt: 1 }}>12</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2, borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderLeft: '4px solid #2e7d32' }}>
              <Typography color="text.secondary" variant="subtitle2">Feedback / Đánh giá mới</Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, mt: 1 }}>5</Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}