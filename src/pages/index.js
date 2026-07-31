// src/pages/index.js
import React from 'react';
import Head from 'next/head';
import { Box, Container, Typography, Button, Grid, Card, CardMedia, CardContent, CardActions } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MainLayout from '../layouts/MainLayout';
import HeroSection from '../sections/home/HeroSection';
import ProductCategorySection from '../sections/home/ProductCategorySection';

// Mock data sản phẩm mẫu
const products = [
  { id: 1, name: 'Sản phẩm mẫu 1', price: '150.000đ', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80' },
  { id: 2, name: 'Sản phẩm mẫu 2', price: '250.000đ', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80' },
  { id: 3, name: 'Sản phẩm mẫu 3', price: '99.000đ', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80' },
  { id: 4, name: 'Sản phẩm mẫu 4', price: '350.000đ', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80' },
];

const categories = [
  { title: '🎁 QUÀ TẶNG Ý NGHĨA', id: 'qua-tang' },
  { title: '📚 VĂN PHÒNG PHẨM', id: 'van-phong-pham' },
  { title: '💄 ĐỒ LÀM ĐẸP', id: 'lam-dep' },
  { title: '🧸 ĐỒ TRANG TRÍ', id: 'trang-tri' },
];

export default function Home() {
  return (
    <>
      <Head>
        <title>Tạp Hóa Store | Mua sắm tiện lợi</title>
      </Head>

      <MainLayout>
        {/* HERO BANNER */}
        <HeroSection />


        {/* CÁC DÃY SẢN PHẨM THEO DANH MỤC */}
        <ProductCategorySection/>
      </MainLayout>
    </>
  );
}