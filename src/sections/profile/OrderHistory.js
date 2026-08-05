import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import Link from 'next/link';

const COLORS = {
    primaryBlue: '#17479d',
    activeOrange: '#ff910d'
};

export default function OrderHistory() {
    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant="h6" sx={{ color: COLORS.activeOrange, fontWeight: 800, mb: 3, textTransform: 'uppercase', fontSize: '1.1rem', letterSpacing: '0.5px' }}>
                LỊCH SỬ ĐƠN HÀNG
            </Typography>

            <Box sx={{ textAlign: 'center', py: 8 }}>
                <ShoppingBagIcon sx={{ fontSize: '4rem', color: '#ccc', mb: 2 }} />
                <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Bạn chưa thực hiện đơn hàng nào.
                </Typography>
                <Button variant="outlined" component={Link} href="/" sx={{ mt: 2, borderRadius: '8px', textTransform: 'none', color: COLORS.primaryBlue, borderColor: COLORS.primaryBlue, fontWeight: 700 }}>
                    Tiếp tục mua sắm
                </Button>
            </Box>
        </Box>
    );
}
