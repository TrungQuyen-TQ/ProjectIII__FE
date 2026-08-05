import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Stack,
  Chip,
} from '@mui/material';
import MainLayout from '../layouts/MainLayout';
import OutletProductCard from '../components/OutletProductCard';
import QuickViewDialog from '../components/QuickViewDialog';
import {
  getOutletCategorySections,
  TARGET_CATEGORIES,
} from '../utils/outletHelpers';

import { dataProducts as productsData } from '../data/dataProducts';
import { dataCategories as categoriesData } from '../data/dataCategories';

// --- COMPONENT GIAN HÀNG & NÚT XEM THÊM (MUI VERSION) ---
function CategorySectionBlock({ section, onQuickView, onResetTab }) {
  const [visibleCount, setVisibleCount] = useState(4);
  const hasMore = section.products.length > visibleCount;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  return (
    <Box
      sx={{
        bgcolor: '#ffffff',
        borderRadius: 4,
        p: { xs: 2, md: 3 },
        mb: 4,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
      }}
    >
      {/* ẢNH BANNER MỤC */}
      {section.bannerImage && (
        <Box
          sx={{
            width: '100%',
            borderRadius: 3,
            overflow: 'hidden',
            mb: 3,
            border: '1px solid #eef2f6',
            boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
            '& img': {
              width: '100%',
              height: 'auto',
              display: 'block',
              transition: 'transform 0.4s ease',
            },
            '&:hover img': {
              transform: 'scale(1.01)',
            },
          }}
        >
          <img src={section.bannerImage} alt={section.name} />
        </Box>
      )}

      {/* TIÊU ĐỀ & PILL LỌC */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 1.5,
          mb: 2.5,
          pb: 2,
          borderBottom: '2px solid #f0f3f8',
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 800, color: '#003366', m: 0 }}
        >
          {section.bannerTitle}
        </Typography>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {['Sinh nhật', 'Lễ Tết', 'Tình yêu'].map((item) => (
            <Chip
              key={item}
              label={item}
              size="small"
              variant="outlined"
              sx={{ fontWeight: 500, borderColor: '#dcdfe6', color: '#555' }}
            />
          ))}
          <Chip
            label="Xem tất cả"
            size="small"
            onClick={onResetTab}
            sx={{
              fontWeight: 600,
              bgcolor: '#fffaf0',
              color: '#ff9900',
              borderColor: '#ff9900',
              border: '1px solid #ff9900',
            }}
          />
        </Stack>
      </Box>

      {/* LƯỚI 4 CỘT CHUẨN RESPONSIVE MUI */}
      <Grid container spacing={2.5}>
        {section.products.slice(0, visibleCount).map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <OutletProductCard
              product={product}
              onQuickView={onQuickView}
            />
          </Grid>
        ))}
      </Grid>

      {/* NÚT XEM THÊM MÀU ĐỔ */}
      {hasMore && (
        <Box sx={{ textAlign: 'center', mt: 3.5, pt: 1 }}>
          <Button
            variant="contained"
            onClick={handleLoadMore}
            sx={{
              bgcolor: '#ff1a3c',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '14px',
              textTransform: 'none',
              px: 4,
              py: 1.2,
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(255, 26, 60, 0.3)',
              '&:hover': {
                bgcolor: '#e01030',
                boxShadow: '0 6px 16px rgba(255, 26, 60, 0.4)',
              },
            }}
          >
            Xem thêm ({section.products.length - visibleCount} sản phẩm)
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default function OutletPage() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('ALL');

  const outletSections = getOutletCategorySections(productsData, categoriesData);

  const displayedSections =
    activeTab === 'ALL'
      ? outletSections
      : outletSections.filter((sec) => sec.id === activeTab);

  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  return (
    <MainLayout title="Outlet - Xả Kho Giá Hời | Thiên Long">
      <Box sx={{ bgcolor: '#f4f7fb', minHeight: '100vh', pb: 8 }}>
        {/* ================= HERO BANNER ================= */}
        <Box
          sx={{
            background: 'linear-gradient(105deg, #4da81d 0%, #29820f 50%, #166005 100%)',
            color: '#fff',
            py: { xs: 4, md: 5 },
            px: 2,
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 6px 20px rgba(22, 96, 5, 0.25)',
          }}
        >
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 4,
              }}
            >
              <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
                <Box sx={{ mb: 1.5 }}>
                  <Box
                    component="span"
                    sx={{
                      bgcolor: '#ffc107',
                      color: '#1a5c04',
                      fontWeight: 800,
                      fontSize: '13px',
                      px: 2,
                      py: 0.8,
                      borderRadius: 5,
                      textTransform: 'uppercase',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                    }}
                  >
                    🔥 SIÊU SALE CHỚP NHOÁNG
                  </Box>
                </Box>

                <Box sx={{ mb: 2.5, fontFamily: "'Arial Black', sans-serif" }}>
                  <Typography
                    component="div"
                    sx={{
                      fontSize: { xs: '40px', md: '60px' },
                      fontWeight: 900,
                      color: '#ffffff',
                      textShadow: '0 4px 12px rgba(0, 0, 0, 0.35)',
                      lineHeight: 1.05,
                    }}
                  >
                    OUTLET
                  </Typography>
                  <Typography
                    component="div"
                    sx={{
                      fontSize: { xs: '30px', md: '46px' },
                      fontWeight: 900,
                      color: '#fff000',
                      textShadow: '0 4px 12px rgba(0, 0, 0, 0.35)',
                      lineHeight: 1.05,
                    }}
                  >
                    XẢ KHO GIÁ HỜI
                  </Typography>
                </Box>

                <Stack
                  direction="row"
                  spacing={1.5}
                  flexWrap="wrap"
                  useFlexGap
                  justifyContent={{ xs: 'center', md: 'flex-start' }}
                >
                  {[
                    { icon: '🎁', small: 'Mua Nhiều', big: 'Giá Tốt', bg: 'linear-gradient(135deg, #ff6b00, #ff9500)' },
                    { icon: '🏷️', small: 'Giảm Đến', big: '50%', bg: 'linear-gradient(135deg, #4834d4, #686de0)' },
                    { icon: '🚚', small: 'Ưu Đãi', big: 'Vận Chuyển', bg: 'linear-gradient(135deg, #009432, #2ed573)' },
                  ].map((badge, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.2,
                        px: 2.2,
                        py: 1.2,
                        borderRadius: 3,
                        background: badge.bg,
                        border: '1.5px solid rgba(255,255,255,0.3)',
                        boxShadow: '0 6px 14px rgba(0,0,0,0.22)',
                      }}
                    >
                      <Typography sx={{ fontSize: '26px' }}>{badge.icon}</Typography>
                      <Box sx={{ lineHeight: 1.2 }}>
                        <Typography sx={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>
                          {badge.small}
                        </Typography>
                        <Typography sx={{ fontSize: '16px', fontWeight: 800 }}>
                          {badge.big}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Box>

              {/* Ảnh phải banner */}
              <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <Box
                  sx={{
                    width: 270,
                    borderRadius: 4,
                    overflow: 'hidden',
                    border: '3px solid rgba(255,255,255,0.8)',
                    boxShadow: '0 12px 28px rgba(0,0,0,0.25)',
                    transform: 'rotate(2deg)',
                    bgcolor: '#fff',
                  }}
                >
                  <img
                    src="/banner/bannerbupbe.avif"
                    alt="Outlet Sale"
                    style={{ width: '100%', height: 170, objectFit: 'cover', display: 'block' }}
                  />
                </Box>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* ================= BANNER CAM KẾT OUTLET ================= */}
        <Container maxWidth="md" sx={{ mt: -3, mb: 3, position: 'relative', zIndex: 10 }}>
          <Box
            sx={{
              background: 'linear-gradient(180deg, #5fc425 0%, #3e9a14 100%)',
              border: '3px solid #9cf879',
              borderRadius: 5,
              py: 2,
              px: 3,
              textAlign: 'center',
              boxShadow: '0 8px 20px rgba(22, 96, 5, 0.2), inset 0 0 15px rgba(255, 255, 255, 0.25)',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 900,
                color: '#fff000',
                textTransform: 'uppercase',
                fontFamily: "'Arial Black', sans-serif",
                textShadow: '0 2px 6px rgba(0, 0, 0, 0.25)',
              }}
            >
              CHÍNH HÃNG GIÁ OUTLET — ⚡ CHỐT DEAL NGAY KHÔNG CẦN NGHĨ! ⚡
            </Typography>
          </Box>
        </Container>

        {/* ================= THANH LỌC DANH MỤC (STICKY) ================= */}
        <Box
          sx={{
            bgcolor: '#ffffff',
            borderTop: '1px solid #e2e8f0',
            borderBottom: '2px solid #e2e8f0',
            mb: 4,
            position: 'sticky',
            top: 0,
            zIndex: 50,
            boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
          }}
        >
          <Container maxWidth="lg">
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                py: 1.5,
                overflowX: 'auto',
                whiteSpace: 'nowrap',
                '&::-webkit-scrollbar': { display: 'none' },
              }}
            >
              <Button
                variant={activeTab === 'ALL' ? 'contained' : 'outlined'}
                onClick={() => setActiveTab('ALL')}
                sx={{
                  borderRadius: 5,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '14px',
                  px: 2.2,
                  py: 0.8,
                  borderColor: '#e2e8f0',
                  bgcolor: activeTab === 'ALL' ? '#0066cc' : '#f8fafc',
                  color: activeTab === 'ALL' ? '#fff' : '#1e293b',
                  '&:hover': {
                    borderColor: '#0066cc',
                    color: activeTab === 'ALL' ? '#fff' : '#0066cc',
                  },
                }}
              >
                🔥 Tất cả gian hàng
              </Button>

              {TARGET_CATEGORIES.map((cat) => {
                const isActive = activeTab === cat.id;
                return (
                  <Button
                    key={cat.id}
                    variant={isActive ? 'contained' : 'outlined'}
                    onClick={() => setActiveTab(cat.id)}
                    sx={{
                      borderRadius: 5,
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '14px',
                      px: 2.2,
                      py: 0.8,
                      borderColor: '#e2e8f0',
                      bgcolor: isActive ? '#0066cc' : '#f8fafc',
                      color: isActive ? '#fff' : '#1e293b',
                      '&:hover': {
                        borderColor: '#0066cc',
                        color: isActive ? '#fff' : '#0066cc',
                      },
                    }}
                  >
                    <span style={{ marginRight: 6 }}>{cat.icon}</span> {cat.name}
                  </Button>
                );
              })}
            </Box>
          </Container>
        </Box>

        {/* ================= CÁC GIAN HÀNG ================= */}
        <Container maxWidth="lg">
          {displayedSections.map((section) => (
            <CategorySectionBlock
              key={section.id}
              section={section}
              onQuickView={handleQuickView}
              onResetTab={() => setActiveTab('ALL')}
            />
          ))}

          {displayedSections.length === 0 && (
            <Box
              sx={{
                textAlign: 'center',
                py: 8,
                bgcolor: '#fff',
                borderRadius: 4,
                color: '#666',
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                Không có sản phẩm giảm giá nào thuộc mục này!
              </Typography>
            </Box>
          )}
        </Container>

        {/* ================= MODAL XEM NHANH ================= */}
        {isQuickViewOpen && selectedProduct && (
          <QuickViewDialog
            product={selectedProduct}
            isOpen={isQuickViewOpen}
            onClose={() => setIsQuickViewOpen(false)}
          />
        )}
      </Box>
    </MainLayout>
  );
}
