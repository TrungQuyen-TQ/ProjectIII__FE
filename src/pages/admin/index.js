// src/pages/admin/index.js
import React from 'react';
import Head from 'next/head';
import { Box, Grid, Paper, Typography, Stack, Button } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AdminLayout from '../../layouts/AdminLayout';

const COLORS = {
    textMain: '#1a1a1a',
    textMuted: '#6c757d',
    success: '#10b981',
    error: '#ef4444',
    primary: '#673ab7',
    primaryLight: '#ede7f6'
};

// Sub-component Card Thống kê
const StatCard = ({ title, value, percent, isUp, subtitle }) => (
    <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #e0e0e0', display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Typography variant="subtitle2" sx={{ color: COLORS.textMain, fontWeight: 600, mb: 2 }}>{title}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mb: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: COLORS.textMain }}>{value}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: isUp ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: isUp ? COLORS.success : COLORS.error, px: 1, py: 0.2, borderRadius: '4px' }}>
                {isUp ? <TrendingUpIcon sx={{ fontSize: 16, mr: 0.5 }} /> : <TrendingDownIcon sx={{ fontSize: 16, mr: 0.5 }} />}
                <Typography variant="caption" sx={{ fontWeight: 700 }}>{percent}%</Typography>
            </Box>
        </Box>
        <Typography variant="caption" color="text.secondary">{subtitle}</Typography>
    </Paper>
);

export default function AdminDashboard() {
    return (
        <AdminLayout>
            <Head>
                <title>Overview Analytics | Admin Dashboard</title>
            </Head>

            <Box sx={{ maxWidth: 1400, mx: 'auto' }}>

                {/* ROW 1: 4 STAT CARDS */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard title="Doanh thu" value="124.5M" percent="24.5" isUp={true} subtitle="So với tuần trước" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard title="Tổng đơn hàng" value="1,245" percent="15.2" isUp={true} subtitle="So với tuần trước" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard title="Đơn chờ xử lý" value="142" percent="5.4" isUp={false} subtitle="So với tuần trước" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard title="Tổng khách hàng" value="8,642" percent="12.0" isUp={true} subtitle="So với tuần trước" />
                    </Grid>
                </Grid>

                {/* ROW 2: CHART AREA */}
                <Paper elevation={0} sx={{ p: 4, borderRadius: '12px', border: '1px solid #e0e0e0' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>Phân tích doanh thu</Typography>
                            <Typography variant="body2" color="text.secondary">Phân tích tương tác và cải thiện sản phẩm với dữ liệu thời gian thực.</Typography>
                        </Box>
                        <Stack direction="row" spacing={0} sx={{ border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
                            <Button sx={{ bgcolor: 'white', color: COLORS.textMain, px: 3, borderRight: '1px solid #e0e0e0', borderRadius: 0, textTransform: 'none', fontWeight: 600 }}>Daily</Button>
                            <Button sx={{ bgcolor: COLORS.primaryLight, color: COLORS.primary, px: 3, borderRight: '1px solid #e0e0e0', borderRadius: 0, textTransform: 'none', fontWeight: 700 }}>Monthly</Button>
                            <Button sx={{ bgcolor: 'white', color: COLORS.textMain, px: 3, borderRadius: 0, textTransform: 'none', fontWeight: 600 }}>Yearly</Button>
                        </Stack>
                    </Box>

                    {/* MOCKUP CHART (SVG) */}
                    <Box sx={{ width: '100%', height: 350, position: 'relative', borderLeft: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0' }}>
                        <svg viewBox="0 0 1000 300" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
                            {/* Grid lines ngang */}
                            <line x1="0" y1="50" x2="1000" y2="50" stroke="#f5f5f5" strokeWidth="1" />
                            <line x1="0" y1="125" x2="1000" y2="125" stroke="#f5f5f5" strokeWidth="1" />
                            <line x1="0" y1="200" x2="1000" y2="200" stroke="#f5f5f5" strokeWidth="1" />

                            {/* Đường Chart 1 (Màu tím đậm) */}
                            <path
                                d="M0,150 L100,120 L200,130 L300,100 L400,110 L500,80 L600,110 L700,90 L800,180 L900,160 L1000,110"
                                fill="none" stroke={COLORS.primary} strokeWidth="3"
                            />
                            {/* Đường Chart 2 (Màu tím nhạt) */}
                            <path
                                d="M0,250 L100,240 L200,280 L300,220 L400,250 L500,180 L600,170 L700,240 L800,210 L900,140 L1000,50"
                                fill="none" stroke="#b39ddb" strokeWidth="3"
                            />
                        </svg>

                        {/* Cột mốc trục X */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, color: COLORS.textMuted, fontSize: '0.85rem' }}>
                            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                            <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                        </Box>
                    </Box>
                </Paper>

            </Box>
        </AdminLayout>
    );
}
