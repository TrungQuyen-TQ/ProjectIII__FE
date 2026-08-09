// src/pages/category/[...slug].js
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
    Box, Container, Typography, Breadcrumbs, Drawer, IconButton, CircularProgress
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
import categoryService from '../../services/categoryService';
import productService from '../../services/productService';

// Helpers to build tree structure
const buildCategoryTree = (flatCategories) => {
    if (!Array.isArray(flatCategories)) return [];
    const map = {};
    flatCategories.forEach(cat => {
        map[cat.id] = {
            ...cat,
            title: cat.title || cat.name,
            subItems: []
        };
    });

    const roots = [];
    flatCategories.forEach(cat => {
        const mapped = map[cat.id];
        const parentId = cat.parent_id || cat.parentId;
        if (parentId && map[parentId]) {
            map[parentId].subItems.push(mapped);
        } else {
            roots.push(mapped);
        }
    });
    return roots;
};

const normalizeStaticCategories = (staticCats) => {
    return staticCats.map(cat => ({
        ...cat,
        subItems: (cat.subItems || []).map((sub, idx) => {
            if (typeof sub === 'string') {
                return { id: `${cat.id}-${idx}`, title: sub };
            }
            return sub;
        })
    }));
};

export default function CategoryPage() {
    const router = useRouter();
    const { slug } = router.query;

    const [quickViewProduct, setQuickViewProduct] = useState(null);
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

    // Dynamic states
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleOpenQuickView = (product) => setQuickViewProduct(product);
    const handleCloseQuickView = () => setQuickViewProduct(null);
    const handleDrawerToggle = () => setMobileFilterOpen(!mobileFilterOpen);

    // Fetch categories list
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoryService.getCategories();
                if (data && data.length > 0) {
                    setCategories(buildCategoryTree(data));
                } else {
                    setCategories(normalizeStaticCategories(dataCategories));
                }
            } catch (err) {
                console.error("Lỗi khi tải danh mục:", err);
                setCategories(normalizeStaticCategories(dataCategories));
            }
        };
        fetchCategories();
    }, []);

    // Fetch products based on dynamic category slug
    useEffect(() => {
        if (!slug) return;
        const fetchCategoryProducts = async () => {
            setLoading(true);
            try {
                const mainCategorySlug = slug[0];
                const subCategorySlug = slug[1];
                const targetCategoryId = subCategorySlug || mainCategorySlug;

                // Call API with the active category ID
                const apiProducts = await productService.getProducts({ categoryId: targetCategoryId });
                
                if (apiProducts && apiProducts.length > 0) {
                    setProducts(apiProducts);
                } else {
                    // Fallback to filtering mock products
                    const mockFiltered = MOCK_PRODUCTS.filter(p => {
                        if (subCategorySlug) {
                            return String(p.category) === String(mainCategorySlug) && String(p.subCategory) === String(subCategorySlug);
                        }
                        return String(p.category) === String(mainCategorySlug);
                    });
                    setProducts(mockFiltered);
                }
            } catch (err) {
                console.error("Lỗi khi tải sản phẩm theo danh mục:", err);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchCategoryProducts();
    }, [slug]);

    if (!slug) return null;

    const mainCategorySlug = slug[0];
    const subCategorySlug = slug[1];

    const mainCategory = categories.find(cat => String(cat.id) === String(mainCategorySlug));
    const mainCategoryName = mainCategory ? (mainCategory.title || mainCategory.name) : 'Sản phẩm';
    const subItemsListRaw = mainCategory ? (mainCategory.subItems || []) : [];
    
    // Map objects to strings so CategoryFilter renders correctly without crashes
    const subItemsList = subItemsListRaw.map(sub => sub.title || sub.name);

    const subCategory = subItemsListRaw.find(sub => String(sub.id) === String(subCategorySlug));
    const subCategoryName = subCategory ? (subCategory.title || subCategory.name) : (subCategorySlug ? `Phân loại ${subCategorySlug}` : null);

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

                            {/* MOBILE DRAWER BỘ LỌC */}
                            <Drawer
                                anchor="right"
                                open={mobileFilterOpen}
                                onClose={handleDrawerToggle}
                                ModalProps={{ keepMounted: true }}
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
                                <Box sx={{ p: 2 }}>
                                    <CategoryFilter subItemsList={subItemsList} />
                                </Box>
                            </Drawer>

                            {/* CỘT PHẢI: LƯỚI SẢN PHẨM HOẶC LOADING */}
                            <Box sx={{ flexGrow: 1, minWidth: 0, width: '100%' }}>
                                {loading ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 10 }}>
                                        <CircularProgress sx={{ color: '#17479d' }} />
                                    </Box>
                                ) : (
                                    <CategoryProductList
                                        filteredProducts={products}
                                        categoryName={subCategoryName || mainCategoryName}
                                        onQuickView={handleOpenQuickView}
                                        onOpenFilter={handleDrawerToggle}
                                    />
                                )}
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