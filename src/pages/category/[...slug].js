// src/pages/category/[...slug].js
import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
    Box, Container, Typography, Breadcrumbs, Drawer, IconButton
} from '@mui/material';

import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import CloseIcon from '@mui/icons-material/Close';

import MainLayout from '../../layouts/MainLayout';
import QuickViewDialog from '../../components/QuickViewDialog';
import CategoryFilter from '../../sections/category/CategoryFilter';
import CategoryProductList from '../../sections/category/CategoryProductList';

import { dataProducts as MOCK_PRODUCTS } from '../../data/dataProducts';
import { dataCategories } from '../../data/dataCategories';

const CATEGORY_NAMES = dataCategories.reduce((acc, cat) => {
    acc[cat.id] = cat.title;
    return acc;
}, {});

const CATEGORY_SUBITEMS = dataCategories.reduce((acc, cat) => {
    acc[cat.id] = cat.subItems;
    return acc;
}, {});

const SUB_CATEGORY_NAMES = dataCategories.reduce((acc, cat) => {
    cat.subItems.forEach((sub, idx) => {
        acc[`${cat.id}-${idx}`] = sub;
    });
    return acc;
}, {});

export default function CategoryPage() {
    const router = useRouter();
    const { slug } = router.query;

    const [quickViewProduct, setQuickViewProduct] = useState(null);
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false); // State mở/đóng Drawer bộ lọc mobile

    const handleOpenQuickView = (product) => setQuickViewProduct(product);
    const handleCloseQuickView = () => setQuickViewProduct(null);

    const handleDrawerToggle = () => {
        setMobileFilterOpen(!mobileFilterOpen);
    };

    if (!slug) return null;

    const mainCategorySlug = slug[0];
    const subCategorySlug = slug[1];

    const mainCategoryName = CATEGORY_NAMES[mainCategorySlug] || 'Sản phẩm';
    const subCategoryName = subCategorySlug ? (SUB_CATEGORY_NAMES[`${mainCategorySlug}-${subCategorySlug}`] || `Phân loại ${subCategorySlug}`) : null;
    const subItemsList = CATEGORY_SUBITEMS[mainCategorySlug] || [];

    const filteredProducts = MOCK_PRODUCTS.filter(p => {
        if (subCategorySlug) {
            return p.category === mainCategorySlug && p.subCategory === subCategorySlug;
        }
        return p.category === mainCategorySlug;
    });

    return (
        <>
            <Head>
                <title>{subCategoryName || mainCategoryName} | Tạp Hóa Store</title>
            </Head>

            <MainLayout>
                <Box sx={{ bgcolor: '#f5f7fa', minHeight: '100vh', pb: 8 }}>
                    <Container maxWidth="lg">
                        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ py: 3, fontSize: '0.9rem' }}>
                            <Link href="/" style={{ display: 'flex', alignItems: 'center', color: '#666', textDecoration: 'none' }}>
                                <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" /> Trang chủ
                            </Link>
                            {subCategorySlug ? (
                                <Link href={`/category/${mainCategorySlug}`} style={{ color: '#666', textDecoration: 'none' }}>
                                    {mainCategoryName}
                                </Link>
                            ) : (
                                <Typography sx={{ color: '#17479d', fontWeight: 600 }}>{mainCategoryName}</Typography>
                            )}
                            {subCategorySlug && (
                                <Typography sx={{ color: '#17479d', fontWeight: 600 }}>{subCategoryName}</Typography>
                            )}
                        </Breadcrumbs>

                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, alignItems: 'flex-start' }}>

                            {/* CỘT TRÁI: BỘ LỌC (CHỈ HIỂN THỊ TRÊN DESKTOP) */}
                            <Box sx={{ display: { xs: 'none', md: 'block' }, width: '260px', flexShrink: 0 }}>
                                <CategoryFilter subItemsList={subItemsList} />
                            </Box>

                            {/* MOBILE DRAWER BỘ LỌC (CHỈ HIỂN THỊ TRÊN MOBILE/TABLET) */}
                            <Drawer
                                anchor="right"
                                open={mobileFilterOpen}
                                onClose={handleDrawerToggle}
                                ModalProps={{ keepMounted: true }} // Cải thiện hiệu suất mở drawer trên mobile
                                sx={{
                                    display: { xs: 'block', md: 'none' },
                                    '& .MuiDrawer-paper': { width: 300, boxSizing: 'border-box' },
                                }}
                            >
                                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e0e0e0' }}>
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#17479d' }}>BỘ LỌC</Typography>
                                    <IconButton onClick={handleDrawerToggle}>
                                        <CloseIcon />
                                    </IconButton>
                                </Box>
                                {/* Dùng lại component filter, CSS bên trong sẽ tự fit với Drawer */}
                                <Box sx={{ p: 2 }}>
                                    <CategoryFilter subItemsList={subItemsList} />
                                </Box>
                            </Drawer>

                            {/* CỘT PHẢI: LƯỚI SẢN PHẨM */}
                            <Box sx={{ flexGrow: 1, minWidth: 0, width: '100%' }}>
                                <CategoryProductList
                                    filteredProducts={filteredProducts}
                                    categoryName={subCategoryName || mainCategoryName}
                                    onQuickView={handleOpenQuickView}
                                    onOpenFilter={handleDrawerToggle} // Truyền hàm mở Drawer xuống con
                                />
                            </Box>
                        </Box>

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