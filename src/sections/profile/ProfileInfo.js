import React from 'react';
import { Box, Typography, TextField } from '@mui/material';

const COLORS = {
    primaryBlue: '#17479d',
    activeOrange: '#ff910d'
};

export default function ProfileInfo({ user }) {
    if (!user) return null;

    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant="h6" sx={{ color: COLORS.activeOrange, fontWeight: 800, mb: 3, textTransform: 'uppercase', fontSize: '1.1rem', letterSpacing: '0.5px' }}>
                THÔNG TIN TÀI KHOẢN
            </Typography>

            <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 3
            }}>
                <Box>
                    <TextField
                        fullWidth
                        label="Họ"
                        variant="outlined"
                        value={user.lastName || ''}
                        slotProps={{ input: { readOnly: true } }}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', bgcolor: '#fafafa' } }}
                    />
                </Box>
                <Box>
                    <TextField
                        fullWidth
                        label="Tên đệm"
                        variant="outlined"
                        value={user.middleName || 'Không có'}
                        slotProps={{ input: { readOnly: true } }}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', bgcolor: '#fafafa' } }}
                    />
                </Box>
                <Box>
                    <TextField
                        fullWidth
                        label="Tên"
                        variant="outlined"
                        value={user.firstName || ''}
                        slotProps={{ input: { readOnly: true } }}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', bgcolor: '#fafafa' } }}
                    />
                </Box>

                <Box>
                    <TextField
                        fullWidth
                        label="Địa chỉ Email"
                        variant="outlined"
                        value={user.email || ''}
                        slotProps={{ input: { readOnly: true } }}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', bgcolor: '#fafafa' } }}
                    />
                </Box>
            </Box>
        </Box>
    );
}
