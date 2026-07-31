import React from 'react';
import { Box, IconButton } from '@mui/material';
import Slider from 'react-slick';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// ĐÃ SỬA: Khai báo mảng chứa tên các file ảnh đã có trong thư mục public
const bannerImages = [
  "banner/bannerbupbe.png",
  "banner/bannerthiepchucmung.png",
  "banner/bannerluuniem.png",
  "banner/bannercaptailieu.png",
  "banner/bannertuixach.png",
  "banner/bannerdolamdep.png"
];

// --- NÚT MŨI TÊN BÊN TRÁI ---
const PrevArrow = ({ onClick }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: 'absolute',
      zIndex: 2,
      top: '50%',
      left: { xs: '5%', md: '18%' }, // Canh lùi vào trong một chút để đè lên ảnh giữa
      transform: 'translateY(-50%)',
      bgcolor: 'rgba(255, 255, 255, 0.9)',
      boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
      width: 44, height: 44,
      '&:hover': { bgcolor: 'white' }
    }}
  >
    <ArrowBackIosNewIcon sx={{ fontSize: 20, color: '#17479d' }} />
  </IconButton>
);

// --- NÚT MŨI TÊN BÊN PHẢI ---
const NextArrow = ({ onClick }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: 'absolute',
      zIndex: 2,
      top: '50%',
      right: { xs: '5%', md: '18%' }, // Canh lùi vào trong
      transform: 'translateY(-50%)',
      bgcolor: 'rgba(255, 255, 255, 0.9)',
      boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
      width: 44, height: 44,
      '&:hover': { bgcolor: 'white' }
    }}
  >
    <ArrowForwardIosIcon sx={{ fontSize: 20, color: '#17479d' }} />
  </IconButton>
);


export default function HeroSection() {
  // CẤU HÌNH SLIDER (Center Mode)
  const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "20%", // Khoảng cách chừa ra 2 bên để lộ ảnh kế tiếp
    slidesToShow: 1,      // Số ảnh hiển thị rõ ở giữa
    speed: 500,
    autoplay: true,       // Tự động trượt
    autoplaySpeed: 3000,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    dots: true,           // Bật dấu chấm phân trang ở dưới
    responsive: [
      {
        breakpoint: 768,  // Cấu hình riêng cho điện thoại
        settings: {
          centerPadding: "10%", // Điện thoại màn nhỏ nên chừa ít thôi
          arrows: false         // Ẩn mũi tên trên điện thoại để vuốt bằng tay
        }
      }
    ]
  };

  return (
    <Box 
      className="hero-slider-container"
      sx={{ 
        width: '100%', 
        bgcolor: '#e5f2fb', // Nền màu xanh siêu nhạt phía sau Banner
        py: { xs: 2, md: 4 },
        overflow: 'hidden'  // Giấu thanh cuộn ngang nếu có
      }}
    >
      <Slider {...settings}>
        {bannerImages.map((img, index) => (
          <Box key={index} sx={{ outline: 'none' }}>
            <Box 
              component="img"
              src={img}
              alt={`Banner ${index + 1}`}
              sx={{
                width: '100%',
                // Đã điều chỉnh chiều cao một chút để banner chuẩn tỷ lệ nằm ngang hơn
                height: { xs: 150, sm: 250, md: 350 }, 
                objectFit: 'cover',
                borderRadius: '16px', // Bo tròn góc ảnh
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                display: 'block',
                cursor: 'pointer'
              }}
            />
          </Box>
        ))}
      </Slider>
    </Box>
  );
}