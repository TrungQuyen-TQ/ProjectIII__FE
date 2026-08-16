// src/components/Footer.js
import React, { useState, useEffect } from 'react';
import {
  Box, Container, Grid, Typography, Stack,
  InputBase, Button, IconButton, Divider
} from '@mui/material';
import Link from 'next/link';

// Icons
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import PhoneIcon from '@mui/icons-material/LocalPhone';
import EmailIcon from '@mui/icons-material/Email';

import { dataCategories } from '../data/dataCategories';
import categoryService from '../services/categoryService';

const COLORS = {
  footerBg: '#17479d',
  headingColor: '#fdd835',
  textLight: '#ffffff',
  textMuted: '#bce2ff'
};

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

const policyLinks = [
  { label: 'Hướng dẫn mua hàng', url: '/info/huong-dan-mua-hang' },
  { label: 'Chính sách bảo mật', url: '/info/chinh-sach-bao-mat' },
  { label: 'Điều khoản dịch vụ', url: '/info/dieu-khoan-dich-vu' },
  { label: 'Quy định đổi trả', url: '/info/quy-dinh-doi-tra' },
  { label: 'Câu hỏi thường gặp', url: '/info/cau-hoi-thuong-gap' },
];

// --- Sub-component cho Menu ---
const MenuColumn = ({ items }) => (
  <Stack spacing={4}>
    {items.map((group) => {
      const parentName = group.title || group.name || '';
      return (
        <Box key={group.id}>
          <Link href={`/category/${group.id}`} passHref style={{ textDecoration: 'none' }}>
            <Typography variant="body2" sx={{ fontWeight: 800, color: COLORS.headingColor, mb: 1, textTransform: 'uppercase', fontSize: '0.75rem', cursor: 'pointer', '&:hover': { color: '#ffffff' } }}>
              {parentName}
            </Typography>
          </Link>
          <Stack spacing={0.5}>
            {(group.subItems || []).map((sub) => {
              const childName = sub.title || sub.name || '';
              return (
                <Link key={sub.id} href={`/category/${group.id}/${sub.id}`} passHref style={{ textDecoration: 'none' }}>
                  <Typography variant="caption" sx={{ color: COLORS.textLight, cursor: 'pointer', '&:hover': { color: COLORS.headingColor } }}>
                    {childName}
                  </Typography>
                </Link>
              );
            })}
          </Stack>
        </Box>
      );
    })}
  </Stack>
);

export default function Footer() {
  const [categories, setCategories] = useState(() => normalizeStaticCategories(dataCategories));

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getCategories();
        if (data && data.length > 0) {
          const tree = buildCategoryTree(data);
          setCategories(tree);
        }
      } catch (err) {
        console.error("Lỗi khi tải danh mục từ API ở Footer, sử dụng dữ liệu mặc định:", err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <Box component="footer" suppressHydrationWarning sx={{ bgcolor: COLORS.footerBg, color: COLORS.textLight, pt: 8, width: '100%' }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4, lg: 6 }, display: "flex", justifyContent: "space-between", flexDirection: "column", alignItems: "center" }}>

        <Grid container spacing={8}>

          {/* CỘT 1: BRAND & SUBSCRIBE */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 900, mb: 1, fontStyle: 'italic' }}>
              Arts<span style={{ color: '#ff910d' }}>.</span> TẠP HÓA
            </Typography>
            <Typography variant="caption" display="block" sx={{ color: COLORS.textMuted, mb: 3 }}>
              Hệ thống văn phòng phẩm & quà tặng sáng tạo hàng đầu.
            </Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, fontSize: '0.8rem' }}>SUBSCRIBE NOW</Typography>
            <Box sx={{ borderBottom: '1px solid #fff', display: 'flex', mb: 2 }}>
              <InputBase placeholder="Email của bạn..." sx={{ color: 'white', fontSize: '0.75rem', flex: 1 }} />
            </Box>
            <Button variant="contained" size="small" sx={{ bgcolor: 'black', color: 'white', textTransform: 'none', fontSize: '0.7rem' }}>
              Đăng ký
            </Button>
          </Grid>

          {/* CỘT DANH MỤC (CHIA LÀM 2 HÀNG RÕ RÀNG VÀ DÓNG THẲNG HÀNG ĐỀU CỘT) */}
          <Grid item xs={12} md={6} container rowSpacing={5} columnSpacing={4}>
            {/* Hàng 1 */}
            <Grid item xs={6} sm={4}>
              <MenuColumn items={categories[0] ? [categories[0]] : []} />
            </Grid>
            <Grid item xs={6} sm={4}>
              <MenuColumn items={categories[2] ? [categories[2]] : []} />
            </Grid>
            <Grid item xs={6} sm={4}>
              <MenuColumn items={categories[4] ? [categories[4]] : []} />
            </Grid>

            {/* Hàng 2 */}
            <Grid item xs={6} sm={4}>
              <MenuColumn items={categories[1] ? [categories[1]] : []} />
            </Grid>
            <Grid item xs={6} sm={4}>
              <MenuColumn items={categories[3] ? [categories[3]] : []} />
            </Grid>
            <Grid item xs={6} sm={4}>
              <MenuColumn items={categories[5] ? [categories[5]] : []} />
            </Grid>
          </Grid>

          {/* CỘT 5: CHÍNH SÁCH */}
          <Grid item xs={6} sm={4} md={1.5}>
            <Typography variant="body2" sx={{ fontWeight: 800, color: COLORS.headingColor, mb: 1, textTransform: 'uppercase', fontSize: '0.75rem' }}>
              Thông tin
            </Typography>
            <Stack spacing={1}>
              {policyLinks.map((link, i) => (
                <Link key={i} href={link.url} passHref style={{ textDecoration: 'none' }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: COLORS.textLight,
                      cursor: 'pointer',
                      display: 'block',
                      '&:hover': { color: COLORS.headingColor }
                    }}
                  >
                    {link.label}
                  </Typography>
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* CỘT 6: LIÊN HỆ */}
          <Grid item xs={12} sm={6} md={1.5}>
            <Typography variant="body2" sx={{ fontWeight: 800, color: COLORS.headingColor, mb: 1, textTransform: 'uppercase', fontSize: '0.75rem' }}>
              Liên hệ
            </Typography>
            <Stack spacing={1.5} mb={3}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PhoneIcon sx={{ mr: 1, fontSize: 16 }} />
                <Typography variant="caption">+84 123 456 789</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', }}>
                <EmailIcon sx={{ mr: 1, fontSize: 16 }} />
                <Typography variant="caption">support@arts.vn</Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={1} sx={{ marginTop: 3 }} >
              {[FacebookIcon, GoogleIcon, TwitterIcon, InstagramIcon].map((Icon, i) => (
                <IconButton key={i} size="small" sx={{ bgcolor: 'black', color: 'white', '&:hover': { bgcolor: '#333' }, width: 30, height: 30 }}>
                  <Icon sx={{ fontSize: 16 }} />
                </IconButton>
              ))}
            </Stack>
          </Grid>

        </Grid>

        <Divider sx={{ mt: 6, borderColor: 'rgba(255,255,255,0.1)' }} />
        <Box sx={{ py: 3, textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: COLORS.textMuted }}>
            © 2026 Arts Tạp Hóa Store - Giải pháp thương mại điện tử chuyên nghiệp.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}