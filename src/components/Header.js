// src/components/Header.js
import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, InputBase, IconButton, Badge,
  Button, Stack, Drawer, List, ListItem, ListItemButton,
  ListItemText, Divider, Collapse
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { dataCategories } from '../data/dataCategories';
import categoryService from '../services/categoryService';

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
import PhoneIcon from '@mui/icons-material/LocalPhone';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../redux/slices/authSlice';
import { toast } from 'react-hot-toast';

const buildCategoryTree = (flatCategories) => {
  if (!Array.isArray(flatCategories)) return [];

  const map = {};
  flatCategories.forEach(cat => {
    map[cat.id] = {
      ...cat,
      title: cat.title || cat.name,
      subItems: []
    };
  });

  const roots = [];
  flatCategories.forEach(cat => {
    const mapped = map[cat.id];
    const parentId = cat.parent_id || cat.parentId;
    if (parentId && map[parentId]) {
      map[parentId].subItems.push(mapped);
    } else {
      roots.push(mapped);
    }
  });

  return roots;
};

const normalizeStaticCategories = (staticCats) => {
  return staticCats.map(cat => ({
    ...cat,
    subItems: (cat.subItems || []).map((sub, idx) => {
      if (typeof sub === 'string') {
        return { id: `${cat.id}-${idx}`, title: sub };
      }
      return sub;
    })
  }));
};

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

  const dispatch = useDispatch();
  const router = useRouter();

  // Lấy dữ liệu từ Redux
  const { user, loading } = useSelector((state) => state.auth);
  const { totalQuantity } = useSelector((state) => state.cart);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

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
                toast.success("Đăng xuất thành công!");
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

  // Khởi tạo ban đầu bằng dữ liệu tĩnh đã chuẩn hóa
  const [categories, setCategories] = useState(() => normalizeStaticCategories(dataCategories));

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getCategories();
        if (data && data.length > 0) {
          // Xây dựng cấu trúc cây (Parent-Child) dựa trên parent_id
          const tree = buildCategoryTree(data);
          setCategories(tree);
        }
      } catch (err) {
        console.error("Lỗi khi tải danh mục từ API, sử dụng dữ liệu mặc định:", err);
      }
    };
    fetchCategories();
  }, []);

  // --- DỮ LIỆU MENU TRUNG TÂM ---
  const MAX_VISIBLE_CATEGORIES = 7;
  const visibleCategories = categories.slice(0, MAX_VISIBLE_CATEGORIES);
  const extraCategories = categories.slice(MAX_VISIBLE_CATEGORIES);

  const navItems = visibleCategories.map(cat => ({
    label: `${cat.title || cat.name}`,
    href: `/category/${cat.id}`,
    // Chuẩn hóa subItems thành danh sách object { label, href }
    subItems: (cat.subItems || []).map(sub => ({
      label: `${sub.icon || ''} ${sub.title || sub.name}`.trim(),
      href: `/category/${sub.id}`
    })),
    isExtra: false
  }));

  if (extraCategories.length > 0) {
    navItems.push({
      label: '➕ Xem thêm',
      href: '#',
      isExtra: true,
      subItems: extraCategories.map(cat => ({
        label: `${cat.icon || '📁'} ${cat.title || cat.name}`,
        href: `/category/${cat.id}`
      }))
    });
  }

  // --- COMPONENT CON CHO USER ---
  const UserLoggedIn = () => (
    <Link href="/profile" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1 }}>
        <Box sx={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          bgcolor: 'rgba(255,255,255,0.15)', borderRadius: '50%', width: 36, height: 36
        }}>
          <PersonIcon sx={{ fontSize: 18, color: 'white' }} />
        </Box>
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 800, color: 'white', lineHeight: 1.2 }}>
            Hi, {user.firstName || user.email}
          </Typography>
          <Typography
            variant="caption"
            onClick={handleLogout}
            sx={{
              color: 'rgba(255,255,255,0.7)', display: 'block', lineHeight: 1.2,
              fontSize: '0.7rem', cursor: 'pointer', '&:hover': { color: COLORS.accent, textDecoration: 'underline' }
            }}
          >
            Đăng xuất
          </Typography>
        </Box>
      </Box>
    </Link>

  );

  const drawerContent = (
    <Box sx={{ width: 300, bgcolor: '#ffffff', height: '100%', overflowY: 'auto' }}>
      <Box sx={{ bgcolor: COLORS.headerBg, color: COLORS.headerColor, p: 2.5, display: 'flex', alignItems: 'center', gap: 2, position: 'relative' }}>

        {/* Vòng tròn Avatar */}
        <Link href={user ? "/profile" : "/auth/login"} onClick={handleDrawerToggle} style={{ textDecoration: 'none' }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(255,255,255,0.2)',
            borderRadius: '50%',
            width: 44,
            height: 44,
            flexShrink: 0
          }}>
            <PersonIcon sx={{ fontSize: 24, color: 'white' }} />
          </Box>
        </Link>

        {/* Khối Text thẳng hàng cột */}
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Link href={user ? "/profile" : "/auth/login"} onClick={handleDrawerToggle} style={{ textDecoration: 'none', color: 'white' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2, color: 'white', '&:hover': { textDecoration: 'underline' } }}>
              {user ? (user.firstName ? `Hi, ${user.firstName}` : 'Tài khoản') : 'Tài khoản'}
            </Typography>
          </Link>

          {user ? (
            <Typography
              variant="body2"
              onClick={(e) => {
                handleLogout(e);
                handleDrawerToggle();
              }}
              sx={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: '0.8rem',
                cursor: 'pointer',
                textDecoration: 'underline',
                mt: 0.4,
                alignSelf: 'flex-start'
              }}
            >
              Đăng xuất
            </Typography>
          ) : (
            <Link href="/auth/login" onClick={handleDrawerToggle} style={{ textDecoration: 'none' }}>
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: '0.8rem',
                  textDecoration: 'underline',
                  mt: 0.4,
                  cursor: 'pointer'
                }}
              >
                Đăng nhập / Đăng ký
              </Typography>
            </Link>
          )}
        </Box>

        <IconButton onClick={handleDrawerToggle} sx={{ color: 'white', position: 'absolute', top: 12, right: 8 }}>
          <CloseIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>

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
                    <ListItemButton key={subIdx} component={Link} href={sub.href} onClick={handleDrawerToggle} sx={{ pl: 4, py: 1.2 }}>
                      <ListItemText primary={sub.label} primaryTypographyProps={{ fontSize: '0.85rem', color: '#444' }} />
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
            <Box component="img" src="/outlet.gif" sx={{ width: 20, height: 20, mr: 1 }} />
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
          <Container maxWidth={false}>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'space-between', gap: 3 }}>

              <Link href="/" style={{ textDecoration: 'none', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '10px', marginRight: '24px' }}>
                <Box component="img" src="/logo-art-white.svg" alt="Logo" sx={{ height: 'auto', width: 120, objectFit: 'contain' }} />
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

                {user ? (
                  <UserLoggedIn />
                ) : (
                  <Button
                    component={Link}
                    href="/auth/login"
                    startIcon={<PersonIcon />}
                    sx={{ color: 'white', textTransform: 'none', fontWeight: 600, border: '1px solid rgba(255,255,255,0.4)', px: 2, borderRadius: '8px' }}
                  >
                    Đăng nhập
                  </Button>
                )}
                <IconButton component={Link} href="/cart" aria-label="cart" sx={{ color: COLORS.headerColor, p: 0.5, ml: 0.5 }}>
                  <Badge badgeContent={mounted ? totalQuantity : 0} sx={{ '& .MuiBadge-badge': { bgcolor: COLORS.accent, color: 'white', fontWeight: 'bold' } }}><ShoppingCartIcon sx={{ fontSize: '1.8rem' }} /></Badge>
                </IconButton>
              </Stack>
            </Box>

            {/* GIAO DIỆN MOBILE */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <IconButton color="inherit" onClick={handleDrawerToggle} sx={{ p: 0.5, ml: -0.5, mr: 1 }}><MenuIcon sx={{ fontSize: '2.2rem' }} /></IconButton>
                <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Box component="img" src="/logo-art-white.svg" alt="Logo" sx={{ height: 26, width: 'auto', objectFit: 'contain' }} />
                </Link>
                <IconButton component={Link} href="/cart" aria-label="cart" sx={{ color: COLORS.headerColor, p: 0.5, mr: -0.5 }}>
                  <Badge badgeContent={mounted ? totalQuantity : 0} sx={{ '& .MuiBadge-badge': { bgcolor: COLORS.accent, color: 'white', fontWeight: 'bold' } }}><ShoppingCartIcon sx={{ fontSize: '1.8rem' }} /></Badge>
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
                          href={subItem.href}
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
                          {subItem.label}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                ))}

                {/* MỤC KHUYẾN MÃI / OUTLET ĐẶC BIỆT GÓC PHẢI */}
                <Box
                  component={Link}
                  href="/outlet"
                  sx={{
                    display: 'flex', alignItems: 'center', color: '#e53935',
                    py: 1.5, px: 2, fontWeight: 800, fontSize: '0.88rem',
                    textDecoration: 'none', transition: 'all 0.2s', whiteSpace: 'nowrap',
                    '&:hover': { color: '#b71c1c' }
                  }}
                >
                  <Box component="img" src="/outlet.gif" sx={{ width: 20, height: 20, mr: 0.5 }} />
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