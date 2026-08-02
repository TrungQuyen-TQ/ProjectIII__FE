// src/pages/info/[slug].js
import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
    Box, Container, Typography, Breadcrumbs, Divider
} from '@mui/material';

import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';

import MainLayout from '../../layouts/MainLayout';

// DỮ LIỆU 5 TRANG THÔNG TIN
const INFO_PAGES = [
    {
        id: 'huong-dan-mua-hang',
        title: 'Hướng dẫn mua hàng',
        content: (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="body1">Để mua hàng tại Tạp Hóa Store, quý khách vui lòng thực hiện theo các bước sau:</Typography>
                <Typography variant="body1"><strong>Bước 1:</strong> Truy cập website, tìm kiếm sản phẩm thông qua thanh tìm kiếm hoặc menu danh mục.</Typography>
                <Typography variant="body1"><strong>Bước 2:</strong> Chọn sản phẩm mong muốn, kiểm tra thông tin, giá cả và bấm nút "Thêm vào giỏ" hoặc "Mua ngay".</Typography>
                <Typography variant="body1"><strong>Bước 3:</strong> Tại trang Giỏ hàng, kiểm tra lại số lượng, điền thông tin giảm giá (nếu có) và bấm "Tiến hành thanh toán".</Typography>
                <Typography variant="body1"><strong>Bước 4:</strong> Điền đầy đủ thông tin giao hàng, chọn phương thức thanh toán (Thẻ/Séc/VPP) và hoàn tất đơn hàng.</Typography>
            </Box>
        )
    },
    {
        id: 'chinh-sach-bao-mat',
        title: 'Chính sách bảo mật',
        content: (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="body1">Tạp Hóa Store cam kết bảo mật tuyệt đối thông tin cá nhân của khách hàng theo quy định của pháp luật.</Typography>
                <Typography variant="body1"><strong>1. Mục đích thu thập:</strong> Chúng tôi chỉ thu thập thông tin để hỗ trợ xử lý đơn hàng, giao hàng và gửi các thông báo khuyến mãi (nếu quý khách đồng ý).</Typography>
                <Typography variant="body1"><strong>2. Phạm vi sử dụng:</strong> Thông tin cá nhân chỉ được lưu hành nội bộ và chia sẻ với đối tác vận chuyển để thực hiện giao hàng.</Typography>
                <Typography variant="body1"><strong>3. Cam kết bảo mật:</strong> Hệ thống sử dụng chứng chỉ SSL để mã hóa dữ liệu. Chúng tôi tuyệt đối không bán hoặc trao đổi thông tin khách hàng cho bên thứ ba.</Typography>
            </Box>
        )
    },
    {
        id: 'dieu-khoan-dich-vu',
        title: 'Điều khoản dịch vụ',
        content: (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="body1">Khi truy cập và sử dụng dịch vụ tại Tạp Hóa Store, quý khách đồng ý với các điều khoản sau:</Typography>
                <Typography variant="body1"><strong>1. Quyền sở hữu trí tuệ:</strong> Mọi nội dung, hình ảnh, mã nguồn trên website đều thuộc bản quyền của hệ thống (Đồ án eProject).</Typography>
                <Typography variant="body1"><strong>2. Trách nhiệm người dùng:</strong> Khách hàng cần cung cấp thông tin chính xác khi đặt hàng. Mọi hành vi gian lận, phá hoại hệ thống sẽ bị xử lý.</Typography>
                <Typography variant="body1"><strong>3. Quyền của Tạp Hóa Store:</strong> Chúng tôi có quyền thay đổi giá bán, cập nhật nội dung website mà không cần báo trước.</Typography>
            </Box>
        )
    },
    {
        id: 'quy-dinh-doi-tra',
        title: 'Quy định đổi trả',
        content: (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="body1">Nhằm đảm bảo quyền lợi khách hàng, chúng tôi áp dụng chính sách đổi trả trong vòng 7 ngày kể từ khi nhận hàng.</Typography>
                <Typography variant="body1"><strong>Điều kiện áp dụng:</strong></Typography>
                <ul style={{ paddingLeft: '20px', margin: 0, color: '#444' }}>
                    <li style={{ marginBottom: '8px' }}>Sản phẩm bị lỗi do nhà sản xuất hoặc hư hỏng trong quá trình vận chuyển.</li>
                    <li style={{ marginBottom: '8px' }}>Sản phẩm phải còn nguyên tem mác, hộp đựng và chưa qua sử dụng.</li>
                    <li style={{ marginBottom: '8px' }}>Quý khách cần cung cấp video quay lại quá trình mở hộp (Unbox).</li>
                </ul>
                <Typography variant="body1"><strong>Quy trình thực hiện:</strong> Vui lòng liên hệ Hotline 1900 866 819 hoặc gửi email về support@taphoastore.vn để được hỗ trợ thủ tục hoàn tiền/đổi hàng miễn phí.</Typography>
            </Box>
        )
    },
    {
        id: 'cau-hoi-thuong-gap',
        title: 'Câu hỏi thường gặp',
        content: (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body1"><strong>1. Tạp Hóa Store có giao hàng toàn quốc không?</strong></Typography>
                <Typography variant="body1" sx={{ color: '#666' }}>Có, chúng tôi hợp tác với các đơn vị vận chuyển hàng đầu để giao hàng đến mọi tỉnh thành trên cả nước.</Typography>

                <Typography variant="body1"><strong>2. Thời gian giao hàng là bao lâu?</strong></Typography>
                <Typography variant="body1" sx={{ color: '#666' }}>Nội thành Hà Nội (1-2 ngày), các tỉnh thành khác (3-5 ngày làm việc).</Typography>

                <Typography variant="body1"><strong>3. Làm sao để tôi kiểm tra tình trạng đơn hàng?</strong></Typography>
                <Typography variant="body1" sx={{ color: '#666' }}>Quý khách vui lòng truy cập mục "Đơn hàng" trên thanh Menu chính và nhập mã vận đơn để theo dõi hành trình.</Typography>
            </Box>
        )
    }
];

export default function InfoPage() {
    const router = useRouter();
    const { slug } = router.query;

    // Tìm data của trang hiện tại dựa vào URL (slug)
    const currentPage = INFO_PAGES.find(page => page.id === slug);

    // Nếu nhập sai URL (hoặc đang tải), hiển thị trống hoặc báo lỗi 404
    if (!currentPage) {
        return <MainLayout><Box sx={{ minHeight: '50vh' }}></Box></MainLayout>;
    }

    return (
        <>
            <Head>
                <title>{currentPage.title} | Tạp Hóa Store</title>
            </Head>

            <MainLayout>
                <Box sx={{ bgcolor: '#f5f7fa', minHeight: '100vh', pb: 8 }}>
                    {/* Giảm maxWidth xuống 'md' để chữ không bị kéo dài quá mức khi không còn menu */}
                    <Container maxWidth="md">

                        {/* THÀNH PHẦN BREADCRUMBS (ĐIỀU HƯỚNG) */}
                        <Breadcrumbs
                            separator={<NavigateNextIcon fontSize="small" />}
                            aria-label="breadcrumb"
                            sx={{ py: 3, fontSize: '0.9rem' }}
                        >
                            <Link href="/" style={{ display: 'flex', alignItems: 'center', color: '#666', textDecoration: 'none' }}>
                                <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                                Trang chủ
                            </Link>
                            <Typography sx={{ color: '#17479d', fontWeight: 600 }}>
                                {currentPage.title}
                            </Typography>
                        </Breadcrumbs>

                        {/* NỘI DUNG CHÍNH CỦA CHÍNH SÁCH (Đã bỏ Grid, chiếm 100% width của Container) */}
                        <Box sx={{ bgcolor: 'white', p: { xs: 3, md: 5 }, borderRadius: '8px', border: '1px solid #e0e0e0', minHeight: '500px' }}>

                            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a1a', mb: 2, fontSize: { xs: '1.5rem', md: '1.8rem' } }}>
                                {currentPage.title}
                            </Typography>

                            <Divider sx={{ mb: 4, borderColor: '#eee' }} />

                            {/* Vùng Render Nội Dung */}
                            <Box sx={{ color: '#444', lineHeight: 1.8, fontSize: '0.95rem' }}>
                                {currentPage.content}
                            </Box>

                        </Box>

                    </Container>
                </Box>
            </MainLayout>
        </>
    );
}