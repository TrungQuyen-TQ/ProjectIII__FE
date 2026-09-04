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

    // Filter states
    const [selectedSubId, setSelectedSubId] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [appliedFilters, setAppliedFilters] = useState({
        selectedSubId: '',
        minPrice: '',
        maxPrice: ''
    });

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

    // Sync filter states when slug changes
    useEffect(() => {
        if (slug) {
            const subId = slug[1] || '';
            setSelectedSubId(subId);
            setMinPrice('');
            setMaxPrice('');
            setAppliedFilters({
                selectedSubId: subId,
                minPrice: '',
                maxPrice: ''
            });
        }
    }, [slug]);

    // Fetch products based on dynamic category slug & applied filters
    useEffect(() => {
        if (!slug) return;
        const isUuid = (str) => {
            return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
        };

        const fetchCategoryProducts = async () => {
            setLoading(true);
            try {
                const mainCategorySlug = slug[0];
                const subCategorySlug = slug[1];
                const targetCategoryId = appliedFilters.selectedSubId || subCategorySlug || mainCategorySlug;
                const searchParam = router.query.Search;

                let apiProducts = [];
                if (mainCategorySlug === 'search' || searchParam) {
                    const params = {};
                    if (searchParam) params.Search = searchParam;
                    if (appliedFilters.minPrice) params.minPrice = parseFloat(appliedFilters.minPrice);
                    if (appliedFilters.maxPrice) params.maxPrice = parseFloat(appliedFilters.maxPrice);

                    apiProducts = await productService.getProducts(params);
                } else if (isUuid(targetCategoryId)) {
                    // Check if this is the parent category and has subcategories
                    const currentCat = categories.find(cat => String(cat.id) === String(targetCategoryId));
                    const subItems = currentCat ? (currentCat.subItems || []) : [];

                    if (!appliedFilters.selectedSubId && subItems.length > 0) {
                        // Gather parent ID and all child IDs
                        const idsToFetch = [targetCategoryId, ...subItems.map(sub => sub.id)];
                        
                        // Query all categories in parallel
                        const apiRequests = idsToFetch.map(id => {
                            const params = { categoryId: id };
                            if (appliedFilters.minPrice) params.minPrice = parseFloat(appliedFilters.minPrice);
                            if (appliedFilters.maxPrice) params.maxPrice = parseFloat(appliedFilters.maxPrice);
                            return productService.getProducts(params);
                        });

                        const results = await Promise.all(apiRequests);

                        // Merge products and remove duplicates
                        const merged = [];
                        const seenIds = new Set();
                        results.flat().forEach(prod => {
                            if (prod && prod.id && !seenIds.has(prod.id)) {
                                seenIds.add(prod.id);
                                merged.push(prod);
                            }
                        });
                        apiProducts = merged;
                    } else {
                        // Single category query (child category or parent without child categories)
                        const params = { categoryId: targetCategoryId };
                        if (appliedFilters.minPrice) params.minPrice = parseFloat(appliedFilters.minPrice);
                        if (appliedFilters.maxPrice) params.maxPrice = parseFloat(appliedFilters.maxPrice);

                        apiProducts = await productService.getProducts(params);
                    }
                }
                
                if (apiProducts && apiProducts.length > 0) {
                    setProducts(apiProducts);
                } else {
                    // Fallback to filtering mock products
                    const mockFiltered = MOCK_PRODUCTS.filter(p => {
                        const price = p.price || 0;
                        if (appliedFilters.minPrice && price < parseFloat(appliedFilters.minPrice)) return false;
                        if (appliedFilters.maxPrice && price > parseFloat(appliedFilters.maxPrice)) return false;

                        if (searchParam) {
                            const term = String(searchParam).toLowerCase();
                            return String(p.title || p.name || '').toLowerCase().includes(term);
                        }

                        if (appliedFilters.selectedSubId) {
                            return String(p.subCategory) === String(appliedFilters.selectedSubId);
                        }
                        return String(p.category) === String(mainCategorySlug);
                    });
                    setProducts(mockFiltered);
                }
            } catch (err) {
                console.error("Lỗi khi tải sản phẩm theo danh mục/tìm kiếm:", err);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchCategoryProducts();
    }, [slug, appliedFilters, categories, router.query.Search]);

    if (!slug) return null;

    const mainCategorySlug = slug[0];
    const subCategorySlug = slug[1];

    let mainCategory = categories.find(cat => String(cat.id) === String(mainCategorySlug));
    let subCategory = null;

    if (!mainCategory && mainCategorySlug !== 'search') {
        for (const cat of categories) {
            const foundSub = (cat.subItems || []).find(sub => String(sub.id) === String(mainCategorySlug));
            if (foundSub) {
                mainCategory = cat;
                subCategory = foundSub;
                break;
            }
        }
    }

    const mainCategoryName = mainCategorySlug === 'search' ? `Tìm kiếm: "${router.query.Search || ''}"` : (mainCategory ? (mainCategory.title || mainCategory.name) : 'Sản phẩm');
    const subItemsListRaw = mainCategory ? (mainCategory.subItems || []) : [];

    if (!subCategory) {
        subCategory = subItemsListRaw.find(sub => String(sub.id) === String(appliedFilters.selectedSubId || subCategorySlug));
    }
    const subCategoryName = subCategory ? (subCategory.title || subCategory.name) : (appliedFilters.selectedSubId || subCategorySlug ? `Phân loại` : null);

    const handleApplyFilters = () => {
        setAppliedFilters({
            selectedSubId,
            minPrice,
            maxPrice
        });
        setMobileFilterOpen(false);
    };

    const handleResetFilters = () => {
        const subId = slug[1] || '';
        setSelectedSubId(subId);
        setMinPrice('');
        setMaxPrice('');
        setAppliedFilters({
            selectedSubId: subId,
            minPrice: '',
            maxPrice: ''
        });
        setMobileFilterOpen(false);
    };

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
                            {subCategoryName && mainCategory && (
                                <Link href={`/category/${mainCategory.id}`} style={{ color: '#666', textDecoration: 'none' }}>
                                    {mainCategoryName}
                                </Link>
                            )}
                            <Typography sx={{ color: '#17479d', fontWeight: 600 }}>
                                {subCategoryName || mainCategoryName}
                            </Typography>
                        </Breadcrumbs>

                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, alignItems: 'flex-start' }}>

                            {/* CỘT TRÁI: BỘ LỌC (CHỈ HIỂN THỊ TRÊN DESKTOP) */}
                            <Box sx={{ display: { xs: 'none', md: 'block' }, width: '260px', flexShrink: 0 }}>
                                <CategoryFilter
                                    subCategories={subItemsListRaw}
                                    selectedSubId={selectedSubId}
                                    onSelectSubId={setSelectedSubId}
                                    minPrice={minPrice}
                                    maxPrice={maxPrice}
                                    onMinPriceChange={setMinPrice}
                                    onMaxPriceChange={setMaxPrice}
                                    onApply={handleApplyFilters}
                                    onReset={handleResetFilters}
                                />
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
                                    <CategoryFilter
                                        subCategories={subItemsListRaw}
                                        selectedSubId={selectedSubId}
                                        onSelectSubId={setSelectedSubId}
                                        minPrice={minPrice}
                                        maxPrice={maxPrice}
                                        onMinPriceChange={setMinPrice}
                                        onMaxPriceChange={setMaxPrice}
                                        onApply={handleApplyFilters}
                                        onReset={handleResetFilters}
                                    />
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