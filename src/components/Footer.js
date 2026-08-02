// src/components/Footer.js
import React from 'react';
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

const COLORS = {
  footerBg: '#17479d',
  headingColor: '#fdd835',
  textLight: '#ffffff',
  textMuted: '#bce2ff'
};

const navItems = [
  { label: '🎁 Quà lưu niệm', subItems: ['Đồ Handmade', 'Khung ảnh', 'Móc khóa', 'Gấu bông'] },
  { label: '💌 Thiệp chúc mừng', subItems: ['Sinh nhật', 'Lễ Tết', 'Tình yêu', '3D Pop-up'] },
  { label: '🎎 Búp bê', subItems: ['Barbie', 'Len Amigurumi', 'Trang trí', 'Phụ kiện'] },
  { label: '📁 Cặp tài liệu', subItems: ['Bìa còng', 'Cặp da', 'Clear bag', 'Trình ký'] },
  { label: '👜 Túi xách', subItems: ['Balo', 'Túi Tote', 'Đeo chéo', 'Ví cầm tay'] },
  { label: '💄 Mỹ phẩm', subItems: ['Son môi', 'Chăm sóc da', 'Trang điểm', 'Dụng cụ'] },
];

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
    {items.map((group, idx) => (
      <Box key={idx}>
        <Typography variant="body2" sx={{ fontWeight: 800, color: COLORS.headingColor, mb: 1, textTransform: 'uppercase', fontSize: '0.75rem' }}>
          {group.label}
        </Typography>
        <Stack spacing={0.5}>
          {group.subItems.map((sub, sIdx) => (
            <Typography key={sIdx} variant="caption" sx={{ color: COLORS.textLight, cursor: 'pointer', '&:hover': { color: COLORS.headingColor } }}>
              {sub}
            </Typography>
          ))}
        </Stack>
      </Box>
    ))}
  </Stack>
);

export default function Footer() {
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

          {/* CỘT 2, 3, 4: CHIA MENU RA */}
          <Grid item xs={6} sm={4} md={2}>
            <MenuColumn items={[navItems[0], navItems[1]]} />
          </Grid>

          <Grid item xs={6} sm={4} md={2}>
            <MenuColumn items={[navItems[2], navItems[3]]} />
          </Grid>

          <Grid item xs={6} sm={4} md={2}>
            <MenuColumn items={[navItems[4], navItems[5]]} />
          </Grid>

          {/* CỘT 5: CHÍNH SÁCH */}
          <Grid item xs={6} sm={4} md={1.5}>
            <Typography variant="body2" sx={{ fontWeight: 800, color: COLORS.headingColor, mb: 1, textTransform: 'uppercase', fontSize: '0.75rem' }}>
              Thông tin
            </Typography>
            <Stack spacing={1}>
              {policyLinks.map((link, i) => (
                // ĐÃ SỬA: Đưa thẻ Link bọc ra ngoài Typography
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