// src/components/Footer.js
import React from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Stack,
  InputBase,
  Button,
  IconButton
} from '@mui/material';
import Link from 'next/link';

// Icons
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';

const COLORS = {
  footerBg: '#17479d',     
  darkerBg: '#0f3170',     
  headingColor: '#fdd835', 
  textLight: '#ffffff',    
  textMuted: '#bce2ff'     
};

// =========================================================
// CÁC COMPONENT CON (ĐƯỢC CHIA NHỎ ĐỂ DỄ QUẢN LÝ)
// =========================================================

// 1. Component Cột Thương Hiệu & Đăng Ký
const FooterBrand = () => (
  <Grid item xs={12} sm={6} md={3}>
    <Typography variant="h5" sx={{ fontWeight: 900, mb: 2, fontStyle: 'italic', letterSpacing: '-0.5px' }}>
      Arts<span style={{ color: '#ff910d' }}>.</span> TẠP HÓA STORE
    </Typography>
    <Stack spacing={1.5}>
      <Typography variant="body2" sx={{ fontSize: '0.85rem', lineHeight: 1.6 }}>
        Hệ thống mua sắm trực tuyến chuyên cung cấp văn phòng phẩm, quà lưu niệm, búp bê, túi xách và mỹ phẩm làm đẹp chính hãng.
      </Typography>
      <Typography variant="body2" sx={{ fontSize: '0.85rem', lineHeight: 1.6, color: COLORS.textMuted }}>
        Đồ án eProject: Online Shopping Cart - Ứng dụng thực tế quy trình TMĐT.
      </Typography>
    </Stack>
    <Box sx={{ display: 'flex', mt: 3, width: '100%', borderRadius: '4px', overflow: 'hidden' }}>
      <InputBase 
        placeholder="Nhập email..." 
        sx={{ bgcolor: 'white', px: 2, py: 1, flex: 1, fontSize: '0.85rem', color: '#333' }} 
      />
      <Button 
        variant="contained" 
        sx={{ bgcolor: COLORS.darkerBg, color: 'white', borderRadius: 0, px: 2, fontWeight: 700, textTransform: 'none', '&:hover': { bgcolor: '#081c42' }, boxShadow: 'none' }}
      >
        Đăng ký
      </Button>
    </Box>
  </Grid>
);

// 2. Component Cột Địa Chỉ Công Ty
const FooterAddress = () => (
  <Grid item xs={12} sm={6} md={3}>
    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: COLORS.headingColor, mb: 2, textTransform: 'uppercase' }}>
      ĐỊA CHỈ CÔNG TY
    </Typography>
    <Typography variant="body2" sx={{ fontSize: '0.85rem', lineHeight: 1.6, mb: 2 }}>
      <strong style={{ color: COLORS.headingColor }}>Trụ sở:</strong> 123 Đường Công Nghệ, Phường Sáng Tạo, Quận Cầu Giấy, TP. Hà Nội, Việt Nam
    </Typography>
    <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
      <IconButton sx={{ bgcolor: 'white', color: COLORS.footerBg, width: 34, height: 34, '&:hover': { bgcolor: '#e0e0e0' } }}>
        <FacebookIcon fontSize="small" />
      </IconButton>
      <IconButton sx={{ bgcolor: 'white', color: COLORS.footerBg, width: 34, height: 34, '&:hover': { bgcolor: '#e0e0e0' } }}>
        <YouTubeIcon fontSize="small" />
      </IconButton>
    </Stack>
  </Grid>
);

// 3. Component Tái Sử Dụng (Dùng chung cho Cột Liên Kết như Hỗ trợ & Về chúng tôi)
const FooterLinksColumn = ({ title, extraContent, links }) => (
  <Grid item xs={12} sm={6} md={3}>
    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: COLORS.headingColor, mb: 2, textTransform: 'uppercase' }}>
      {title}
    </Typography>
    
    {/* Render các phần nội dung phụ nếu có (VD: Hotline, Email) */}
    {extraContent && <Box sx={{ mb: 2 }}>{extraContent}</Box>}

    <Stack spacing={1}>
      {links.map((item, idx) => (
        <Link key={idx} href={item.url} passHref style={{ textDecoration: 'none', color: COLORS.textLight }}>
          <Typography variant="body2" sx={{ fontSize: '0.85rem', transition: '0.2s', '&:hover': { color: COLORS.headingColor } }}>
            - {item.label}
          </Typography>
        </Link>
      ))}
    </Stack>
  </Grid>
);

// =========================================================
// COMPONENT CHÍNH (MAIN FOOTER)
// =========================================================

export default function Footer() {
  // Dữ liệu cho cột Hỗ trợ khách hàng
  const supportLinks = [
    { label: 'Thanh toán (Thẻ/Séc/VPP)', url: '#' },
    { label: 'Hoàn tiền trong 7 ngày', url: '#' },
    { label: 'Yêu cầu đổi/trả sản phẩm', url: '#' },
    { label: 'Kiểm tra trạng thái đơn', url: '#' }
  ];

  const supportExtraContent = (
    <Stack spacing={0.5}>
      <Typography variant="body2" sx={{ fontSize: '0.85rem', fontWeight: 700 }}>Hotline: 1900 866 819</Typography>
      <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>Thứ 2 - Thứ 6 (8h - 17h)</Typography>
      <Typography variant="body2" sx={{ fontSize: '0.85rem', wordBreak: 'break-word' }}>
        Email: <a href="mailto:support@taphoastore.vn" style={{ color: 'white', textDecoration: 'none' }}>support@taphoastore.vn</a>
      </Typography>
    </Stack>
  );

  // Dữ liệu cho cột Về Tạp Hóa Store
  const aboutLinks = [
    { label: 'Giới thiệu đồ án', url: '#' },
    { label: 'Cổng quản lý Admin', url: '#' },
    { label: 'Cổng nội bộ Nhân viên', url: '#' },
    { label: 'Góp ý dịch vụ (Feedback)', url: '#' }
  ];

  return (
    <Box component="footer" sx={{ mt: 'auto', width: '100%' }}>
      
      {/* KHU VỰC CÁC CỘT */}
      <Box sx={{ bgcolor: COLORS.footerBg, color: COLORS.textLight, pt: 8, pb: 6 }}>
        <Container maxWidth="xl">
          <Grid container spacing={4}>
            
            {/* Gọi các component con đã chia nhỏ */}
            <FooterBrand />
            <FooterAddress />
            <FooterLinksColumn title="HỖ TRỢ KHÁCH HÀNG" extraContent={supportExtraContent} links={supportLinks} />
            <FooterLinksColumn title="VỀ TẠP HÓA STORE" links={aboutLinks} />

          </Grid>
        </Container>
      </Box>

      {/* DẢI COPYRIGHT DƯỚI CÙNG */}
      <Box sx={{ bgcolor: COLORS.darkerBg, py: 2, textAlign: 'center', color: COLORS.textMuted }}>
        <Typography variant="caption" sx={{ fontSize: '0.8rem' }}>
          2026 © Tạp Hóa Store - Bản quyền thuộc về Dự án eProject Online Shopping Cart.
        </Typography>
      </Box>

    </Box>
  );
}