// src/pages/info/[slug].js
import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
    Box, Container, Typography, Breadcrumbs, Divider, Stack,
    Accordion, AccordionSummary, AccordionDetails, Chip, Button
} from '@mui/material';

import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';
import AssignmentReturnOutlinedIcon from '@mui/icons-material/AssignmentReturnOutlined';
import HelpOutlineIcon from '@mui/icons-material/Help';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';

import MainLayout from '../../layouts/MainLayout';

const COLORS = {
    primary: '#17479d',
    accent: '#fdd835',
    orange: '#ff910d',
    bgSoft: '#f5f7fa',
};

// =========================================================
// DỮ LIỆU 5 TRANG THÔNG TIN
// =========================================================
const INFO_PAGES = [
    {
        id: 'huong-dan-mua-hang',
        title: 'Hướng dẫn mua hàng',
        subtitle: 'Khi mua hàng online, bạn có thể chọn 1 trong 2 cách dưới đây.',
        icon: ShoppingCartOutlinedIcon,
        color: '#17479d',
        note: 'Cách 1 — Đặt hàng qua điện thoại: Gọi Hotline 1900 866 819, nhân viên tư vấn sẽ ghi nhận thông tin và lên đơn giúp bạn. Thời gian tiếp nhận: Thứ 2 - Thứ 6 (8h - 17h), Thứ 7 (8h - 12h).',
        steps: [
            {
                label: 'Cách 2 - Bước 1: Tìm sản phẩm',
                text: 'Bạn có thể tìm sản phẩm cần mua theo 1 trong 3 cách sau:',
                bullets: [
                    { text: 'Nhập từ khóa sản phẩm vào ô tìm kiếm, kết quả sẽ hiện ra ngay khi bạn gõ xong.', image: 'https://i.postimg.cc/rmcgMBq9/1.png' },
                    { text: 'Bấm vào các danh mục sản phẩm trên thanh menu để duyệt theo từng nhóm hàng.', image: 'https://i.postimg.cc/Sxht6tBL/Screenshot-2026-08-12-101521.png' },
                ],
            },
            {
                label: 'Bước 2: Chọn sản phẩm cần mua',
                text: 'Sau khi tìm được sản phẩm ưng ý:',
                bullets: [
                    { text: 'Ở trang danh mục, bạn có thể bấm "Xem nhanh" để xem thông tin mà không cần rời trang, chọn số lượng rồi thêm vào giỏ.', image: 'https://i.postimg.cc/nh2TvVYj/Screenshot-2026-08-12-101728.png' },
                    { text: 'Hoặc bấm vào sản phẩm để xem trang chi tiết đầy đủ hơn, chọn số lượng/phân loại (nếu có) rồi bấm "Thêm vào giỏ" hoặc "Mua ngay" để đặt luôn.', image: 'https://i.postimg.cc/wTdkZRw1/Screenshot-2026-08-12-101807.png' },
                    { text: 'Lặp lại quá trình này nhiều lần cho đến khi đã chọn đủ các sản phẩm cần mua vào giỏ hàng.', image: '' },
                ],
            },
            {
                label: 'Bước 3: Kiểm tra giỏ hàng',
                text: 'Tại trang Giỏ hàng:',
                bullets: [
                    { text: 'Xem lại số lượng và các sản phẩm đã chọn đã đúng, đủ chưa.', image: '' },
                    { text: 'Có thể xóa bớt hoặc cập nhật lại số lượng của từng sản phẩm.', image: 'https://i.postimg.cc/hjTd1pWV/Screenshot-2026-08-12-101927.png' },
                    { text: 'Nhập mã giảm giá (nếu có) trước khi chuyển sang bước thanh toán.', image: '' },
                ],
            },
            {
                label: 'Bước 4: Đặt hàng',
                text: 'Sau khi các thông tin đã chính xác:',
                bullets: [
                    { text: 'Điền đầy đủ thông tin người nhận và địa chỉ giao hàng.', image: '' },
                    { text: 'Chọn phương thức thanh toán phù hợp (COD, chuyển khoản, ví điện tử...).', image: '' },
                    { text: 'Đọc và đồng ý với Điều khoản dịch vụ, Chính sách bảo mật của website.', image: '' },
                    { text: 'Bấm "Tiến hành đặt hàng" để hoàn tất đơn.', image: '' },
                ],
            },
        ],
    },
    {
        id: 'chinh-sach-bao-mat',
        title: 'Chính sách bảo mật',
        subtitle: 'Cam kết bảo vệ tuyệt đối thông tin cá nhân của khách hàng.',
        icon: VerifiedUserOutlinedIcon,
        color: '#0f8f5c',
        steps: [
            {
                label: 'Mục đích thu thập thông tin',
                text: 'Chúng tôi thu thập một số thông tin cơ bản khi bạn đăng ký tài khoản hoặc đặt hàng, bao gồm:',
                bullets: [
                    'Họ tên, số điện thoại, địa chỉ nhận hàng, email, tên đăng nhập và mật khẩu.',
                    'Đây là thông tin bắt buộc để chúng tôi liên hệ xác nhận đơn hàng và đảm bảo quyền lợi giao nhận cho chính bạn.',
                    'Bạn tự chịu trách nhiệm bảo mật tài khoản, mật khẩu, hộp thư của mình, và cần báo ngay cho chúng tôi nếu phát hiện dấu hiệu bị lộ, sử dụng trái phép hoặc mạo danh.',
                ],
            },
            {
                label: 'Phạm vi sử dụng thông tin',
                text: 'Thông tin bạn cung cấp chỉ được dùng để:',
                bullets: [
                    'Cung cấp các dịch vụ và xử lý đơn hàng liên quan đến bạn.',
                    'Gửi thông báo về các trao đổi, giao dịch giữa bạn và cửa hàng.',
                    'Ngăn ngừa hành vi giả mạo hoặc phá hoại tài khoản của bạn.',
                    'Liên lạc, giải quyết trong các trường hợp phát sinh đặc biệt.',
                    'Chúng tôi không dùng thông tin cá nhân cho bất kỳ mục đích nào khác ngoài giao dịch tại cửa hàng, và chỉ cung cấp cho cơ quan chức năng khi có yêu cầu hợp pháp.',
                ],
            },
            {
                label: 'Thời gian lưu trữ thông tin',
                text: 'Dữ liệu cá nhân của bạn được lưu trữ trên hệ thống của chúng tôi cho đến khi bạn yêu cầu hủy bỏ hoặc xóa tài khoản.',
            },
            {
                label: 'Đơn vị thu thập và quản lý thông tin',
                text: 'Thông tin do Arts Tạp Hóa Store tiếp nhận và quản lý. Mọi thắc mắc, khiếu nại liên quan vui lòng liên hệ Hotline 1900 866 819 hoặc email support@arts.vn.',
            },
            {
                label: 'Quyền chỉnh sửa và khiếu nại',
                text: 'Bạn có quyền tiếp cận và điều chỉnh dữ liệu cá nhân của mình:',
                bullets: [
                    'Tự kiểm tra, cập nhật thông tin bằng cách đăng nhập vào tài khoản, hoặc gửi yêu cầu để chúng tôi hỗ trợ chỉnh sửa.',
                    'Có quyền gửi khiếu nại nếu nghi ngờ thông tin cá nhân bị lộ cho bên thứ ba. Khi tiếp nhận, chúng tôi sẽ xác minh, phản hồi lý do và hướng dẫn bạn khôi phục thông tin.',
                ],
            },
            {
                label: 'Cam kết bảo mật thông tin khách hàng',
                text: 'Việc thu thập, sử dụng thông tin chỉ được thực hiện khi có sự đồng ý của bạn, trừ trường hợp pháp luật có quy định khác. Chúng tôi cam kết:',
                bullets: [
                    'Không sử dụng, chuyển giao, cung cấp hay tiết lộ cho bên thứ ba về thông tin cá nhân của bạn khi chưa được cho phép.',
                    'Nếu hệ thống lưu trữ gặp sự cố tấn công dẫn đến mất mát dữ liệu, chúng tôi có trách nhiệm thông báo cho cơ quan chức năng để điều tra xử lý kịp thời, đồng thời thông báo cho bạn được biết.',
                    'Bảo mật tuyệt đối mọi thông tin giao dịch trực tuyến, bao gồm hóa đơn, chứng từ số hóa của bạn.',
                ],
            },
        ],
    },
    {
        id: 'dieu-khoan-dich-vu',
        title: 'Điều khoản dịch vụ',
        subtitle: 'Những quy định chung khi truy cập và sử dụng dịch vụ tại cửa hàng.',
        icon: GavelOutlinedIcon,
        color: '#8e24aa',
        steps: [
            {
                label: 'Phạm vi áp dụng',
                text: 'Điều khoản này áp dụng cho mọi khách hàng truy cập, đăng ký tài khoản và mua sắm trên website Arts Tạp Hóa Store (bao gồm cả phiên bản web và ứng dụng, nếu có). Việc tiếp tục sử dụng website đồng nghĩa với việc bạn đã đọc và đồng ý với toàn bộ nội dung được nêu tại đây.',
            },
            {
                label: 'Điều kiện sử dụng dịch vụ',
                bullets: [
                    'Bạn cần đủ 18 tuổi hoặc có sự đồng ý của cha mẹ/người giám hộ để tạo tài khoản và đặt hàng.',
                    'Mỗi khách hàng chỉ nên sử dụng 1 tài khoản cá nhân; chúng tôi có quyền tạm khóa các tài khoản có dấu hiệu trùng lặp bất thường nhằm trục lợi khuyến mãi.',
                    'Thông tin đăng ký (họ tên, số điện thoại, địa chỉ) cần chính xác để đảm bảo quyền lợi giao nhận hàng của chính bạn.',
                ],
            },
            {
                label: 'Quyền sở hữu trí tuệ',
                text: 'Toàn bộ nội dung, hình ảnh, logo, giao diện và mã nguồn hiển thị trên website đều thuộc quyền sở hữu của Arts Tạp Hóa Store. Nghiêm cấm sao chép, sử dụng lại vì mục đích thương mại dưới mọi hình thức khi chưa được cho phép bằng văn bản.',
            },
            {
                label: 'Trách nhiệm của khách hàng',
                text: 'Khi sử dụng website và đặt hàng, bạn cần:',
                bullets: [
                    'Cung cấp thông tin chính xác, trung thực khi đăng ký tài khoản và đặt hàng.',
                    'Tự bảo mật thông tin đăng nhập, không chia sẻ cho người khác sử dụng.',
                    'Không thực hiện các hành vi gian lận, giả mạo hoặc cố ý phá hoại hệ thống — mọi vi phạm sẽ bị từ chối phục vụ và xử lý theo quy định pháp luật.',
                    'Đối với các đơn hàng cá nhân hóa (khắc tên, in hình theo yêu cầu), bạn cần kiểm tra kỹ nội dung/hình ảnh cung cấp trước khi xác nhận đặt hàng vì các sản phẩm này thường không áp dụng đổi trả do sở thích cá nhân.',
                ],
            },
            {
                label: 'Quyền và trách nhiệm của cửa hàng',
                text: 'Chúng tôi có quyền:',
                bullets: [
                    'Thay đổi giá bán, chương trình khuyến mãi, tạm ngừng hoặc cập nhật nội dung website mà không cần báo trước.',
                    'Từ chối hoặc hủy đơn hàng trong trường hợp phát hiện dấu hiệu gian lận, hoặc sản phẩm hết hàng ngoài dự kiến (sẽ liên hệ hoàn tiền/đổi sản phẩm tương đương cho bạn).',
                    'Đồng thời có trách nhiệm đảm bảo thông tin, hình ảnh sản phẩm hiển thị chính xác nhất có thể và xử lý đơn hàng đúng cam kết về thời gian, chất lượng.',
                ],
            },
            {
                label: 'Giới hạn trách nhiệm',
                text: 'Chúng tôi không chịu trách nhiệm cho các thiệt hại phát sinh do nguyên nhân khách quan ngoài tầm kiểm soát (thiên tai, sự cố mạng, gián đoạn từ đơn vị vận chuyển thứ ba...), hoặc do khách hàng cung cấp sai thông tin nhận hàng.',
            },
            {
                label: 'Giải quyết tranh chấp và khiếu nại',
                text: 'Mọi thắc mắc, khiếu nại phát sinh trong quá trình sử dụng dịch vụ vui lòng liên hệ Hotline 1900 866 819 hoặc email support@arts.vn để được hỗ trợ giải quyết nhanh nhất. Trường hợp không thể thỏa thuận, tranh chấp sẽ được giải quyết theo quy định pháp luật Việt Nam hiện hành.',
            },
            {
                label: 'Thay đổi điều khoản',
                text: 'Điều khoản dịch vụ có thể được cập nhật theo thời gian mà không cần báo trước. Phiên bản mới nhất luôn được đăng tải công khai tại trang này.',
            },
        ],
    },
    {
        id: 'quy-dinh-doi-tra',
        title: 'Quy định đổi trả',
        subtitle: 'Chính sách đổi trả trong vòng 7 ngày, đơn giản và minh bạch.',
        icon: AssignmentReturnOutlinedIcon,
        color: '#e53935',
        note: 'Hàng hóa được chấp nhận đổi/trả trong vòng 07 ngày làm việc kể từ ngày bạn nhận được hàng. Riêng trường hợp lỗi do nhà sản xuất, việc đổi trả hoàn toàn miễn phí.',
        steps: [
            {
                label: 'Trường hợp áp dụng đổi trả',
                bullets: [
                    'Hàng giao không đúng chủng loại, mẫu mã như trên website.',
                    'Không đủ số lượng, quy cách đóng gói hoặc mô tả như đã đặt.',
                    'Hàng hóa bị hư hỏng, bể vỡ, bong tróc trong quá trình vận chuyển.',
                    'Sản phẩm hết hạn sử dụng (đối với các mặt hàng có hạn sử dụng).',
                ],
            },
            {
                label: 'Điều kiện đổi trả',
                bullets: [
                    'Sản phẩm còn nguyên vẹn, đầy đủ bao bì, hộp đựng, phụ kiện và quà tặng đi kèm (nếu có).',
                    'Có đầy đủ hóa đơn mua hàng và tem trên sản phẩm.',
                    'Sản phẩm không bị trầy xước, ẩm ướt, dính hóa chất hay tự ý sửa chữa.',
                    'Sản phẩm chưa qua sử dụng, trừ trường hợp đổi trả do lỗi kỹ thuật từ nhà sản xuất.',
                    'Chúng tôi có quyền từ chối đổi trả nếu phát hiện sản phẩm đã qua sử dụng hoặc hư hỏng do khách hàng gây ra. Nên quay video mở hộp (unbox) để thuận tiện đối chiếu khi cần.',
                ],
            },
            {
                label: 'Hình thức đổi trả',
                bullets: [
                    'Phát hiện lỗi ngay khi nhận hàng: bạn có thể từ chối nhận hoặc đổi trả trực tiếp với nhân viên giao hàng, được miễn phí vận chuyển đổi trả.',
                    'Phát hiện sau khi đã nhận hàng: vui lòng liên hệ Hotline 1900 866 819 hoặc email support@arts.vn trong vòng 7 ngày kể từ ngày nhận hàng để được hướng dẫn gửi trả.',
                    'Nếu bạn không thể tự gửi hàng đổi trả, hãy liên hệ Hotline để được hỗ trợ nhận hàng tận nơi (chi phí vận chuyển do khách hàng chi trả).',
                ],
            },
            {
                label: 'Thời gian và phương thức hoàn tiền',
                text: 'Chúng tôi cam kết hoàn tiền sau khi đã nhận và kiểm tra hàng đổi trả hợp lệ:',
                bullets: [
                    'Phương thức hoàn tiền: chuyển khoản ngân hàng.',
                    'Thời gian hoàn tiền: 05 - 07 ngày làm việc.',
                    'Nếu đã quá thời gian trên mà vẫn chưa nhận được tiền hoàn, vui lòng liên hệ Hotline 1900 866 819 để được hỗ trợ.',
                ],
            },
        ],
    },
    {
        id: 'cau-hoi-thuong-gap',
        title: 'Câu hỏi thường gặp',
        subtitle: 'Giải đáp nhanh những thắc mắc phổ biến nhất của khách hàng.',
        icon: HelpOutlineIcon,
        color: '#ff910d',
        faqs: [
            { q: 'Tôi có thể đặt hàng qua điện thoại không?', a: 'Có. Bạn gọi Hotline 1900 866 819 trong giờ làm việc (Thứ 2 - Thứ 6: 8h - 17h, Thứ 7: 8h - 12h), nhân viên sẽ hỗ trợ tư vấn và lên đơn giúp bạn.' },
            { q: 'Cửa hàng có giao hàng toàn quốc không?', a: 'Có, chúng tôi hợp tác với các đơn vị vận chuyển hàng đầu để giao hàng đến mọi tỉnh thành trên cả nước.' },
            { q: 'Thời gian giao hàng là bao lâu?', a: 'Nội thành Hà Nội (1-2 ngày), các tỉnh thành khác (3-5 ngày làm việc).' },
            { q: 'Đơn hàng bao nhiêu tiền thì được miễn phí vận chuyển?', a: 'Đơn hàng từ 100.000đ trở lên được miễn phí vận chuyển toàn quốc. Với đơn dưới 100.000đ, phí ship áp dụng từ 20.000đ (nội thành) hoặc 30.000đ (ngoại thành/tỉnh khác).' },
            { q: 'Làm sao để tôi kiểm tra tình trạng đơn hàng?', a: 'Quý khách vui lòng truy cập mục "Theo dõi đơn hàng" trên thanh menu chính và nhập mã vận đơn để theo dõi hành trình.' },
            { q: 'Tôi có thể thanh toán bằng những hình thức nào?', a: 'Cửa hàng hỗ trợ chuyển khoản ngân hàng, thanh toán khi nhận hàng (COD) và ví điện tử.' },
            { q: 'Sản phẩm có được bảo hành không?', a: 'Tùy loại sản phẩm sẽ có chính sách bảo hành riêng, thông tin chi tiết được ghi rõ trong mô tả từng sản phẩm.' },
            { q: 'Tôi có thể hủy đơn hàng sau khi đã đặt không?', a: 'Có, bạn có thể hủy đơn trước khi đơn được đóng gói/giao cho vận chuyển bằng cách liên hệ Hotline 1900 866 819 càng sớm càng tốt.' },
            { q: 'Sản phẩm quà tặng, thiệp có được đặt làm theo yêu cầu riêng không?', a: 'Có. Với các sản phẩm như thiệp, khung ảnh, ly sứ, móc khóa..., bạn có thể yêu cầu khắc tên hoặc in hình theo ý muốn. Vui lòng ghi rõ nội dung/hình ảnh mong muốn vào phần "Ghi chú đơn hàng" hoặc liên hệ Hotline để được tư vấn trước khi đặt.' },
            { q: 'Sản phẩm cá nhân hóa (khắc tên, in hình riêng) có được đổi trả không?', a: 'Do được làm riêng theo yêu cầu, các sản phẩm này chỉ được đổi trả nếu lỗi do bên sản xuất (in sai, khắc sai so với nội dung bạn đã cung cấp), không áp dụng đổi trả vì lý do không ưng ý mẫu mã.' },
            { q: 'Cửa hàng có bán sỉ / số lượng lớn không?', a: 'Có. Với đơn hàng số lượng lớn (quà tặng sự kiện, văn phòng phẩm cho trường học/công ty...), vui lòng liên hệ Hotline 1900 866 819 để được báo giá và ưu đãi riêng.' },
            { q: 'Cửa hàng có xuất hóa đơn VAT cho công ty không?', a: 'Có. Khi đặt hàng, bạn tick chọn "Xuất hóa đơn" tại trang Giỏ hàng và điền đầy đủ thông tin công ty (tên, mã số thuế, địa chỉ) để được xuất hóa đơn.' },
            { q: 'Có chương trình khách hàng thân thiết hoặc tích điểm không?', a: 'Cửa hàng thường xuyên có các chương trình ưu đãi, mã giảm giá cho khách hàng quay lại. Bạn có thể đăng ký nhận tin ở cuối trang hoặc theo dõi fanpage để cập nhật sớm nhất.' },
            { q: 'Màu sắc sản phẩm ngoài thực tế có khác trong ảnh không?', a: 'Chúng tôi cố gắng chụp ảnh sát với màu thật nhất, tuy nhiên do điều kiện ánh sáng và màn hình hiển thị khác nhau, màu sắc thực tế có thể chênh lệch nhẹ (đặc biệt với các sản phẩm màu vẽ, giấy màu).' },
        ],
    },
];

// =========================================================
// COMPONENT: SIDEBAR ĐIỀU HƯỚNG NHANH GIỮA CÁC TRANG
// =========================================================
const InfoSidebar = ({ currentId }) => (
    <Box sx={{ bgcolor: 'white', borderRadius: '16px', border: '1px solid #eef1f5', overflow: 'hidden', position: { md: 'sticky' }, top: { md: 24 } }}>
        <Box sx={{ bgcolor: COLORS.primary, px: 2.5, py: 2 }}>
            <Typography sx={{ color: 'white', fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase' }}>
                Chính sách khác
            </Typography>
        </Box>
        <Stack divider={<Divider />}>
            {INFO_PAGES.map((p) => {
                const Icon = p.icon;
                const active = p.id === currentId;
                return (
                    <Link key={p.id} href={`/info/${p.id}`} style={{ textDecoration: 'none' }}>
                        <Box
                            sx={{
                                display: 'flex', alignItems: 'center', gap: 1.5, px: 2.5, py: 1.6,
                                bgcolor: active ? '#eef4ff' : 'transparent',
                                borderLeft: active ? `3px solid ${COLORS.primary}` : '3px solid transparent',
                                transition: '0.2s',
                                '&:hover': { bgcolor: '#f5f8ff' }
                            }}
                        >
                            <Icon sx={{ fontSize: 20, color: active ? COLORS.primary : '#8a94a6' }} />
                            <Typography sx={{ fontSize: '0.85rem', fontWeight: active ? 700 : 500, color: active ? COLORS.primary : '#444', flexGrow: 1 }}>
                                {p.title}
                            </Typography>
                            <ArrowForwardIosIcon sx={{ fontSize: 12, color: '#c0c7d1' }} />
                        </Box>
                    </Link>
                );
            })}
        </Stack>
    </Box>
);

// =========================================================
// COMPONENT: NỘI DUNG DẠNG CÁC BƯỚC / MỤC (dùng cho 4 trang chính sách)
// =========================================================
const StepsContent = ({ steps, color, note }) => (
    <Stack spacing={2.5}>
        {note && (
            <Box sx={{
                p: 2, borderRadius: '12px', bgcolor: `${color}0d`, border: `1px solid ${color}33`,
                display: 'flex', gap: 1.5, alignItems: 'flex-start'
            }}>
                <Box sx={{ fontSize: '1.1rem', lineHeight: 1 }}>📞</Box>
                <Typography sx={{ color: '#444', fontSize: '0.88rem', lineHeight: 1.7 }}>{note}</Typography>
            </Box>
        )}
        {steps.map((s, idx) => (
            <Box key={idx} sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{
                    minWidth: 34, height: 34, borderRadius: '50%', bgcolor: `${color}1a`,
                    color: color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: '0.85rem', flexShrink: 0
                }}>
                    {idx + 1}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 700, color: '#1a1a1a', mb: 0.5 }}>{s.label}</Typography>
                    {s.text && <Typography sx={{ color: '#555', lineHeight: 1.8, fontSize: '0.95rem' }}>{s.text}</Typography>}
                    {s.bullets && (
                        <Stack component="ul" spacing={1.2} sx={{ mt: 1, mb: 0, pl: 2.2 }}>
                            {s.bullets.map((b, bi) => {
                                const bulletText = typeof b === 'string' ? b : b.text;
                                const bulletImage = typeof b === 'string' ? null : b.image;
                                return (
                                    <Box component="li" key={bi} sx={{ listStyle: 'disc' }}>
                                        <Typography sx={{ color: '#555', lineHeight: 1.75, fontSize: '0.95rem' }}>
                                            {bulletText}
                                        </Typography>
                                        {bulletImage && (
                                            <Box
                                                component="img"
                                                src={bulletImage}
                                                alt={bulletText}
                                                sx={{
                                                    mt: 1, width: '100%', maxWidth: 380, height: 180, objectFit: 'cover',
                                                    borderRadius: '10px', border: '1px solid #eef1f5', display: 'block'
                                                }}
                                            />
                                        )}
                                    </Box>
                                );
                            })}
                        </Stack>
                    )}
                    {s.image && (
                        <Box
                            component="img"
                            src={s.image}
                            alt={s.label}
                            sx={{
                                mt: 1.5, width: '100%', maxWidth: 420, height: 200, objectFit: 'cover',
                                borderRadius: '12px', border: '1px solid #eef1f5', display: 'block'
                            }}
                        />
                    )}
                </Box>
            </Box>
        ))}
    </Stack>
);

// =========================================================
// COMPONENT: FAQ DẠNG ACCORDION + MỤC LỤC NHẢY NHANH
// =========================================================
const FaqContent = ({ faqs, color }) => {
    const [expanded, setExpanded] = useState('faq-0');

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const jumpTo = (idx) => {
        setExpanded(`faq-${idx}`);
        const el = document.getElementById(`faq-${idx}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    return (
        <Box>
            {/* MỤC LỤC */}
            <Box sx={{ mb: 3, p: 2, bgcolor: '#fff8ea', borderRadius: '12px', border: '1px solid #ffe6ad' }}>
                <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#7a5a00', mb: 1.2 }}>
                    📌 Mục lục — bấm để xem nhanh
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, width: '100%' }}>
                    {faqs.map((f, idx) => (
                        <Chip
                            key={idx}
                            label={f.q}
                            size="small"
                            onClick={() => jumpTo(idx)}
                            sx={{
                                bgcolor: 'white', border: `1px solid ${color}55`, color: color,
                                fontWeight: 600, cursor: 'pointer', maxWidth: '100%',
                                '& .MuiChip-label': { whiteSpace: 'normal', lineHeight: 1.4, py: 0.4 },
                                '&:hover': { bgcolor: `${color}12` }
                            }}
                        />
                    ))}
                </Box>
            </Box>

            {/* DANH SÁCH CÂU HỎI */}
            <Stack spacing={1.2}>
                {faqs.map((f, idx) => (
                    <Accordion
                        key={idx}
                        id={`faq-${idx}`}
                        expanded={expanded === `faq-${idx}`}
                        onChange={handleChange(`faq-${idx}`)}
                        disableGutters
                        elevation={0}
                        sx={{
                            border: '1px solid #eef1f5', borderRadius: '10px !important',
                            '&:before': { display: 'none' }, overflow: 'hidden'
                        }}
                    >
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 2.5 }}>
                            <Typography sx={{ fontWeight: 700, color: '#1a1a1a', fontSize: '0.95rem' }}>
                                {f.q}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ px: 2.5, pb: 2.5 }}>
                            <Typography sx={{ color: '#555', lineHeight: 1.8, fontSize: '0.9rem' }}>
                                {f.a}
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Stack>
        </Box>
    );
};

// =========================================================
// COMPONENT: TRANG KHÔNG TÌM THẤY (SLUG SAI)
// =========================================================
const NotFoundInfo = () => (
    <MainLayout>
        <Box sx={{ bgcolor: COLORS.bgSoft, minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', py: 8 }}>
            <Container maxWidth="sm">
                <Box sx={{ bgcolor: 'white', borderRadius: '20px', p: { xs: 4, md: 6 }, textAlign: 'center', border: '1px solid #eef1f5' }}>
                    <SentimentDissatisfiedIcon sx={{ fontSize: 64, color: COLORS.primary, mb: 2 }} />
                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
                        Không tìm thấy trang chính sách này
                    </Typography>
                    <Typography sx={{ color: '#666', mb: 4 }}>
                        Đường dẫn bạn truy cập không tồn tại hoặc đã bị thay đổi. Hãy chọn 1 trong các trang thông tin bên dưới.
                    </Typography>
                    <Stack spacing={1} sx={{ mb: 3 }}>
                        {INFO_PAGES.map((p) => (
                            <Link key={p.id} href={`/info/${p.id}`} style={{ textDecoration: 'none' }}>
                                <Box sx={{
                                    py: 1.2, borderRadius: '10px', bgcolor: '#f5f7fa', color: '#333', fontWeight: 600,
                                    fontSize: '0.9rem', '&:hover': { bgcolor: '#eef4ff', color: COLORS.primary }
                                }}>
                                    {p.title}
                                </Box>
                            </Link>
                        ))}
                    </Stack>
                    <Link href="/" style={{ textDecoration: 'none' }}>
                        <Button variant="contained" sx={{ bgcolor: COLORS.primary, borderRadius: '10px', textTransform: 'none', fontWeight: 700, px: 4 }}>
                            Về trang chủ
                        </Button>
                    </Link>
                </Box>
            </Container>
        </Box>
    </MainLayout>
);

// =========================================================
// COMPONENT CHÍNH
// =========================================================
export default function InfoPage() {
    const router = useRouter();
    const { slug } = router.query;

    // Đang tải route lần đầu (Next.js chưa kịp trả query) -> không vội báo lỗi
    if (!router.isReady) {
        return <MainLayout><Box sx={{ minHeight: '60vh' }} /></MainLayout>;
    }

    const currentPage = INFO_PAGES.find((page) => page.id === slug);

    if (!currentPage) {
        return <NotFoundInfo />;
    }

    const Icon = currentPage.icon;

    return (
        <>
            <Head>
                <title>{currentPage.title} | Arts Tạp Hóa Store</title>
            </Head>

            <MainLayout>
                <Box sx={{ bgcolor: COLORS.bgSoft, minHeight: '100vh', pb: 8 }}>

                    {/* BANNER MÀU RIÊNG THEO TỪNG TRANG */}
                    <Box sx={{ background: `linear-gradient(135deg, ${currentPage.color} 0%, ${COLORS.primary} 100%)` }}>
                        <Container maxWidth="xl">
                            <Box sx={{ py: { xs: 4, md: 5 } }}>
                                <Breadcrumbs
                                    separator={<NavigateNextIcon fontSize="small" sx={{ color: 'rgba(255,255,255,0.6)' }} />}
                                    aria-label="breadcrumb"
                                    sx={{ mb: 2, fontSize: '0.85rem' }}
                                >
                                    <Link href="/" style={{ display: 'flex', alignItems: 'center', color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>
                                        <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                                        Trang chủ
                                    </Link>
                                    <Typography sx={{ color: 'white', fontWeight: 600, fontSize: '0.85rem' }}>
                                        {currentPage.title}
                                    </Typography>
                                </Breadcrumbs>

                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Box sx={{
                                        width: 56, height: 56, borderRadius: '16px', bgcolor: 'rgba(255,255,255,0.15)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                                    }}>
                                        <Icon sx={{ fontSize: 30, color: 'white' }} />
                                    </Box>
                                    <Box>
                                        <Typography variant="h4" sx={{ fontWeight: 800, color: 'white', fontSize: { xs: '1.4rem', md: '1.8rem' } }}>
                                            {currentPage.title}
                                        </Typography>
                                        <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', mt: 0.5 }}>
                                            {currentPage.subtitle}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Box>
                        </Container>
                    </Box>

                    {/* NỘI DUNG + SIDEBAR */}
                    <Container maxWidth="xl" sx={{ mt: 4 }}>
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, alignItems: 'flex-start' }}>
                            <Box sx={{ width: { xs: '100%', md: '24%' }, flexShrink: 0 }}>
                                <InfoSidebar currentId={currentPage.id} />
                            </Box>
                            <Box sx={{ width: { xs: '100%', md: '76%' }, minWidth: 0 }}>
                                <Box sx={{ bgcolor: 'white', p: { xs: 3, md: 4.5 }, borderRadius: '16px', border: '1px solid #eef1f5' }}>
                                    {currentPage.faqs
                                        ? <FaqContent faqs={currentPage.faqs} color={currentPage.color} />
                                        : <StepsContent steps={currentPage.steps} color={currentPage.color} note={currentPage.note} />
                                    }
                                </Box>

                                {/* KHỐI HỖ TRỢ THÊM */}
                                <Box sx={{
                                    mt: 3, p: 3, borderRadius: '16px', bgcolor: '#eef4ff',
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2
                                }}>
                                    <Box>
                                        <Typography sx={{ fontWeight: 700, color: COLORS.primary }}>Vẫn còn thắc mắc?</Typography>
                                        <Typography sx={{ fontSize: '0.85rem', color: '#555' }}>Liên hệ hotline 1900 866 819 để được hỗ trợ trực tiếp.</Typography>
                                    </Box>
                                    <Button variant="contained" sx={{ bgcolor: COLORS.primary, borderRadius: '10px', textTransform: 'none', fontWeight: 700 }}>
                                        Liên hệ ngay
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    </Container>
                </Box>
            </MainLayout>
        </>
    );
}
