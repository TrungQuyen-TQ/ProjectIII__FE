// src/components/Header.js
import React, { useState } from 'react';
import {
  Box, Container, Typography, InputBase, IconButton, Badge,
  Button, Stack, Drawer, List, ListItem, ListItemButton,
  ListItemText, Divider, Collapse
} from '@mui/material';
import Link from 'next/link';
import { dataCategories } from '../data/dataCategories';

// --- ICONS ---
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import PhoneIcon from '@mui/icons-material/LocalPhone';

const COLORS = {
  headerBg: '#17479d',
  headerColor: '#ffffff',
  bottomMenuBg: '#f2f8ff', // Chỉnh màu nền menu dưới sáng hơn một chút để nổi bật text
  bottomMenuText: '#17479d',
  accent: '#ff910d',
  accentHover: '#e07d00',
  primaryBlue: '#2659f3',
  secondaryBlue: '#0d5cb6'
};

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  // State quản lý mở/đóng menu con trên Mobile
  const [openSubMenu, setOpenSubMenu] = useState({});

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleToggleSubMenu = (index) => {
    setOpenSubMenu((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  // --- DỮ LIỆU MENU TRUNG TÂM ---
  const navItems = dataCategories.map(cat => ({
    label: `${cat.icon} ${cat.title}`,
    href: `/category/${cat.id}`,
    subItems: cat.subItems
  }));

  const drawerContent = (
    <Box sx={{ width: 300, bgcolor: '#ffffff', height: '100%', overflowY: 'auto' }}>
      <Box sx={{ bgcolor: COLORS.headerBg, color: COLORS.headerColor, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box component="img" src="/logo-art-white.svg" alt="Logo" sx={{ height: 'auto', width: '100px' }} />
        <IconButton onClick={handleDrawerToggle} sx={{ color: 'white' }}><CloseIcon /></IconButton>
      </Box>

      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Button component={Link} href="/auth/login" fullWidth variant="contained" startIcon={<PersonIcon />} sx={{ bgcolor: COLORS.primaryBlue, textTransform: 'none', fontWeight: 700, '&:hover': { bgcolor: COLORS.secondaryBlue }, boxShadow: 'none' }}>
          Đăng nhập / Đăng ký
        </Button>
      </Box>
      <Divider />

      {/* MENU TRUYỀN THỐNG TRÊN MOBILE CÓ ACCORDION */}
      <List sx={{ pt: 0 }}>
        {navItems.map((item, index) => (
          <React.Fragment key={index}>
            <ListItem disablePadding sx={{ borderBottom: '1px solid #f0f0f0' }}>
              <ListItemButton onClick={() => handleToggleSubMenu(index)} sx={{ py: 1.5 }}>
                <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 600, color: COLORS.headerBg, fontSize: '0.95rem' }} />
                {item.subItems ? (openSubMenu[index] ? <ExpandLess sx={{ color: COLORS.headerBg }} /> : <ExpandMore sx={{ color: COLORS.headerBg }} />) : null}
              </ListItemButton>
            </ListItem>

            {/* Danh mục con (Mobile) */}
            {item.subItems && (
              <Collapse in={openSubMenu[index]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding sx={{ bgcolor: '#fafafa' }}>
                  {item.subItems.map((sub, subIdx) => (
                    <ListItemButton key={subIdx} component={Link} href={`${item.href}/${subIdx}`} onClick={handleDrawerToggle} sx={{ pl: 4, py: 1.2 }}>
                      <ListItemText primary={sub} primaryTypographyProps={{ fontSize: '0.85rem', color: '#444' }} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
        {/* Nút Khuyến mãi trên Mobile */}
        <ListItem disablePadding>
          <ListItemButton component={Link} href="/khuyen-mai" onClick={handleDrawerToggle} sx={{ py: 1.5 }}>
            <WhatshotIcon sx={{ color: '#e53935', mr: 1, fontSize: '1.2rem' }} />
            <ListItemText primary="KHUYẾN MÃI" primaryTypographyProps={{ fontWeight: 800, color: '#e53935', fontSize: '0.95rem' }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box component="header" sx={{ position: 'sticky', top: 0, left: 0, width: '100%', zIndex: 1100, boxShadow: '0 4px 12px rgba(23, 71, 157, 0.15)' }}>
      <Box sx={{ bgcolor: COLORS.headerBg }}>
        {/* =========================================
          MAIN HEADER (THANH TÌM KIẾM CỐ ĐỊNH)
          ========================================= */}
        <Box sx={{ bgcolor: COLORS.headerBg, color: COLORS.headerColor, py: { xs: 1.2, md: 1.5 } }}>
          <Container maxWidth="xl">
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'space-between', gap: 3 }}>

              <Link href="/" style={{ textDecoration: 'none', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '10px', marginRight: '24px' }}>
                <Box component="img" src="/logo-art-white.svg" alt="Logo" sx={{ height: 'auto', width: 150, objectFit: 'contain' }} />
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase', fontSize: '1.2rem' }}>
                </Typography>
              </Link>

              <Box sx={{ display: 'flex', bgcolor: '#fff', borderRadius: '8px', overflow: 'hidden', height: 44, flexGrow: 1, maxWidth: 550 }}>
                <InputBase placeholder="Tìm kiếm sản phẩm, quà lưu niệm..." sx={{ ml: 2, flex: 1, fontSize: '0.95rem', color: '#17479d' }} />
                <Button variant="contained" sx={{ bgcolor: COLORS.accent, color: 'white', borderRadius: 0, minWidth: 60, px: 2, '&:hover': { bgcolor: COLORS.accentHover }, boxShadow: 'none' }}><SearchIcon /></Button>
              </Box>

              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flexShrink: 0 }}>
                <Button component={Link} href="/tracking" sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1, color: 'white', '&:hover': { color: '#ff910d' } }}>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'rgba(255,255,255,0.15)',
                    borderRadius: '50%',
                    width: 36,
                    height: 36
                  }}>
                    <LocalShippingIcon sx={{ fontSize: 18, color: 'white' }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                      Đơn hàng
                    </Typography>
                    <Typography variant="caption" sx={{ display: 'block', lineHeight: 1.2, fontSize: '0.7rem' }}>
                      Theo dõi đơn hàng
                    </Typography>
                  </Box>
                </Button>
                {/* HỖ TRỢ KHÁCH HÀNG */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1 }}>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'rgba(255,255,255,0.15)',
                    borderRadius: '50%',
                    width: 36,
                    height: 36
                  }}>
                    <PhoneIcon sx={{ fontSize: 18, color: 'white' }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: 'white', lineHeight: 1.2 }}>
                      1900 866 819
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', display: 'block', lineHeight: 1.2, fontSize: '0.7rem' }}>
                      Hỗ trợ khách hàng
                    </Typography>
                  </Box>
                </Box>

                <Button component={Link} href="/auth/login" startIcon={<PersonIcon sx={{ fontSize: 24 }} />} sx={{ color: COLORS.headerColor, textTransform: 'none', fontWeight: 600, border: '1px solid rgba(255,255,255,0.4)', px: 2, borderRadius: '8px', '&:hover': { bgcolor: 'rgba(255,255,255,0.15)', borderColor: 'white' } }}>Đăng nhập</Button>
                <IconButton component={Link} href="/cart" aria-label="cart" sx={{ color: COLORS.headerColor, p: 0.5, ml: 0.5 }}>
                  <Badge badgeContent={1} sx={{ '& .MuiBadge-badge': { bgcolor: COLORS.accent, color: 'white', fontWeight: 'bold' } }}><ShoppingCartIcon sx={{ fontSize: '1.8rem' }} /></Badge>
                </IconButton>
              </Stack>
            </Box>

            {/* GIAO DIỆN MOBILE */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <IconButton color="inherit" onClick={handleDrawerToggle} sx={{ p: 0.5, ml: -0.5, mr: 1 }}><MenuIcon sx={{ fontSize: '2.2rem' }} /></IconButton>
                <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Box component="img" src="/logo-art-white.svg" alt="Logo" sx={{ height: 32, width: 'auto', objectFit: 'contain' }} />
                </Link>
                <IconButton component={Link} href="/cart" aria-label="cart" sx={{ color: COLORS.headerColor, p: 0.5, mr: -0.5 }}>
                  <Badge badgeContent={1} sx={{ '& .MuiBadge-badge': { bgcolor: COLORS.accent, color: 'white', fontWeight: 'bold' } }}><ShoppingCartIcon sx={{ fontSize: '1.8rem' }} /></Badge>
                </IconButton>
              </Box>
              <Box sx={{ display: 'flex', bgcolor: '#fff', borderRadius: '8px', overflow: 'hidden', height: 42, width: '100%' }}>
                <InputBase placeholder="Tìm kiếm sản phẩm..." sx={{ ml: 2, flex: 1, fontSize: '0.95rem', color: '#17479d' }} />
                <Button variant="contained" sx={{ bgcolor: COLORS.accent, color: 'white', borderRadius: 0, minWidth: 50, px: 2, '&:hover': { bgcolor: COLORS.accentHover }, boxShadow: 'none' }}><SearchIcon /></Button>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* =========================================
          BOTTOM MENU (CÓ THÊM DROPDOWN MEGA MENU CHUẨN THIÊN LONG)
          ========================================= */}
        <Box sx={{ bgcolor: COLORS.bottomMenuBg, display: { xs: 'none', md: 'block' }, borderBottom: '1px solid #e0eaf5' }}>
          <Box sx={{ bgcolor: COLORS.bottomMenuBg }}>
            <Container maxWidth="xl">
              <Stack direction="row" spacing={0} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>

                {navItems.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      position: 'relative',
                      // Kích hoạt hiển thị Menu con khi Hover
                      '&:hover .meta-menu': {
                        opacity: 1,
                        visibility: 'visible',
                        transform: 'translateY(0)'
                      }
                    }}
                  >
                    {/* NÚT DANH MỤC CHÍNH */}
                    <Box
                      component={Link}
                      href={item.href}
                      sx={{
                        display: 'flex', alignItems: 'center', color: COLORS.bottomMenuText,
                        py: 1.5, px: 1.5, fontWeight: 700, fontSize: '0.88rem', textDecoration: 'none',
                        transition: 'all 0.2s', whiteSpace: 'nowrap',
                        '&:hover': { color: COLORS.accent }
                      }}
                    >
                      {item.label}
                      <KeyboardArrowDownIcon sx={{ ml: 0.2, fontSize: '1.1rem', color: '#7ea1ce' }} />
                    </Box>

                    {/* KHỐI DROPDOWN MENU (META MENU) */}
                    <Box
                      className="meta-menu"
                      sx={{
                        position: 'absolute',
                        top: '100%', left: 0,
                        minWidth: '220px',
                        bgcolor: 'white',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                        borderRadius: '0 0 8px 8px',
                        borderTop: `3px solid ${COLORS.accent}`,
                        py: 1,
                        // Cấu hình ban đầu để ẩn mượt mà
                        opacity: 0, visibility: 'hidden', transform: 'translateY(10px)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        zIndex: 1200
                      }}
                    >
                      {item.subItems.map((subItem, subIdx) => (
                        <Box
                          key={subIdx}
                          component={Link}
                          href={`${item.href}/${subIdx}`}
                          sx={{
                            display: 'block', px: 2.5, py: 1.2, color: '#444',
                            fontSize: '0.88rem', fontWeight: 500, textDecoration: 'none',
                            transition: '0.2s',
                            '&:hover': {
                              bgcolor: 'rgba(255, 145, 13, 0.08)',
                              color: COLORS.accent,
                              pl: 3 // Hiệu ứng hover nhích nhẹ sang phải giống Thiên Long
                            }
                          }}
                        >
                          {subItem}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                ))}

                {/* MỤC KHUYẾN MÃI / OUTLET ĐẶC BIỆT GÓC PHẢI */}
                <Box
                  component={Link}
                  href="/khuyen-mai"
                  sx={{
                    display: 'flex', alignItems: 'center', color: '#e53935',
                    py: 1.5, px: 2, fontWeight: 800, fontSize: '0.88rem',
                    textDecoration: 'none', transition: 'all 0.2s', whiteSpace: 'nowrap',
                    '&:hover': { color: '#b71c1c' }
                  }}
                >
                  <WhatshotIcon sx={{ fontSize: '1.2rem', mr: 0.5 }} />
                  OUTLET
                </Box>

              </Stack>
            </Container>
          </Box>
        </Box>
        <Drawer variant="temporary" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }} sx={{ display: { xs: 'block', md: 'none' } }}>{drawerContent}</Drawer>
      </Box>
    </Box>
  );
}