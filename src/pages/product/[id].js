import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Box, Container, Typography, Breadcrumbs
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';

import MainLayout from '../../layouts/MainLayout';
import { dataProducts } from '../../data/dataProducts';
import { dataCategories } from '../../data/dataCategories';
import QuickViewDialog from '../../components/QuickViewDialog';

import ProductInfo from '../../sections/product/ProductInfo';
import ProductDescription from '../../sections/product/ProductDescription';
import ProductRelated from '../../sections/product/ProductRelated';

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [activeThumb, setActiveThumb] = useState('');
  const [qty, setQty] = useState(1);
  
  // State phục vụ cho phần Xem nhanh của mục Sản phẩm liên quan
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const handleOpenQuickView = (p) => setQuickViewProduct(p);
  const handleCloseQuickView = () => setQuickViewProduct(null);

  useEffect(() => {
    if (id) {
      const found = dataProducts.find(p => p.id === parseInt(id));
      if (found) {
        setProduct(found);
        setActiveThumb(found.image);
        setQty(1);
      }
    }
  }, [id]);

  if (!product) {
    return (
      <MainLayout>
        <Box sx={{ py: 10, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">Đang tải thông tin sản phẩm...</Typography>
        </Box>
      </MainLayout>
    );
  }

  // Lấy danh mục cha và các sản phẩm liên quan
  const categoryInfo = dataCategories.find(c => c.id === product.category);
  const relatedProducts = dataProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <>
      <Head>
        <title>{product.name} | Tạp Hóa Store</title>
      </Head>

      <MainLayout>
        <Box sx={{ bgcolor: '#f5f7fa', minHeight: '100vh', pb: 8 }}>
          <Container maxWidth="lg">
            
            {/* BREADCRUMBS ĐIỀU HƯỚNG */}
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ py: 3, fontSize: '0.9rem' }}>
              <Link href="/" style={{ display: 'flex', alignItems: 'center', color: '#666', textDecoration: 'none' }}>
                <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" /> Trang chủ
              </Link>
              {categoryInfo && (
                <Link href={`/category/${categoryInfo.id}`} style={{ color: '#666', textDecoration: 'none' }}>
                  {categoryInfo.title}
                </Link>
              )}
              <Typography sx={{ color: '#17479d', fontWeight: 600 }}>{product.name}</Typography>
            </Breadcrumbs>

            {/* KHU VỰC CHI TIẾT SẢN PHẨM CHÍNH */}
            <ProductInfo 
              product={product} 
              activeThumb={activeThumb} 
              setActiveThumb={setActiveThumb} 
              qty={qty} 
              setQty={setQty} 
            />

            {/* MÔ TẢ CHI TIẾT SẢN PHẨM */}
            <ProductDescription product={product} />

            {/* SẢN PHẨM LIÊN QUAN */}
            <ProductRelated 
              relatedProducts={relatedProducts} 
              onQuickView={handleOpenQuickView} 
            />

            {/* DIALOG XEM NHANH SẢN PHẨM LIÊN QUAN */}
            <QuickViewDialog 
              open={Boolean(quickViewProduct)}
              onClose={handleCloseQuickView}
              product={quickViewProduct}
            />

          </Container>
        </Box>
      </MainLayout>
    </>
  );
}
