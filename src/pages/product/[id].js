import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Box, Container, Typography, Breadcrumbs, CircularProgress
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

import productService from '../../services/productService';
import categoryService from '../../services/categoryService';

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [activeThumb, setActiveThumb] = useState('');
  const [qty, setQty] = useState(1);
  const [categoryInfo, setCategoryInfo] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State phục vụ cho phần Xem nhanh của mục Sản phẩm liên quan
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const handleOpenQuickView = (p) => setQuickViewProduct(p);
  const handleCloseQuickView = () => setQuickViewProduct(null);

  useEffect(() => {
    if (!id) return;

    const isUuid = (str) => {
      return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
    };

    const fetchProductData = async () => {
      setLoading(true);
      try {
        let foundProduct = null;
        if (isUuid(id)) {
          foundProduct = await productService.getProductById(id);
        }

        if (!foundProduct) {
          // Fallback to mock data
          foundProduct = dataProducts.find(p => p.id === parseInt(id) || String(p.id) === String(id));
        }

        if (foundProduct) {
          setProduct(foundProduct);
          setActiveThumb(foundProduct.image || foundProduct.thumbnail || '');
          setQty(1);

          // Tải danh mục cha
          const catId = foundProduct.categoryId || foundProduct.category;
          let foundCategory = null;
          const allCategories = await categoryService.getCategories();
          if (allCategories && allCategories.length > 0) {
            foundCategory = allCategories.find(c => String(c.id) === String(catId));
          }
          if (!foundCategory) {
            foundCategory = dataCategories.find(c => String(c.id) === String(catId));
          }
          setCategoryInfo(foundCategory);

          // Tải sản phẩm liên quan
          let related = [];
          if (isUuid(catId)) {
            const apiRelated = await productService.getProducts({ categoryId: catId });
            related = (apiRelated || []).filter(p => String(p.id) !== String(foundProduct.id)).slice(0, 4);
          }
          if (related.length === 0) {
            related = dataProducts
              .filter(p => String(p.category) === String(catId) && String(p.id) !== String(foundProduct.id))
              .slice(0, 4);
          }
          setRelatedProducts(related);
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error("Error loading product detail:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <Box sx={{ py: 10, textAlign: 'center' }}>
          <CircularProgress />
          <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>Đang tải thông tin sản phẩm...</Typography>
        </Box>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <Box sx={{ py: 10, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">Không tìm thấy sản phẩm yêu cầu.</Typography>
        </Box>
      </MainLayout>
    );
  }

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
                  {categoryInfo.title || categoryInfo.name}
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
