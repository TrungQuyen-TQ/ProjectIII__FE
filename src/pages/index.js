// src/pages/index.js
import React from 'react';
import Head from 'next/head';
import { Box, Container, Typography, Button, Grid, Card, CardMedia, CardContent, CardActions } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MainLayout from '../layouts/MainLayout';
import HeroSection from '../sections/home/HeroSection';
import ProductCategorySection from '../sections/home/ProductCategorySection';

// Import dữ liệu mẫu từ thư mục data
import { dataProducts } from '../data/dataProducts';
import { dataCategories } from '../data/dataCategories';


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