import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, Stack } from '@mui/material';
import { useDispatch } from 'react-redux';
import { updateUserInfo } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';

const COLORS = {
    primaryBlue: '#17479d',
    activeOrange: '#ff910d'
};

export default function ProfileInfo({ user }) {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        lastName: '',
        middleName: '',
        firstName: '',
        phone: ''
    });

    // Synchronize form data when dialog opens or user prop changes
    useEffect(() => {
        if (user) {
            setFormData({
                lastName: user.lastName || '',
                middleName: user.middleName || '',
                firstName: user.firstName || '',
                phone: user.phone || ''
            });
        }
    }, [user, open]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Dispatch to update Redux store
        dispatch(updateUserInfo(formData));
        
        toast.custom((t) => (
            <div
                className={`${t.visible ? 'toast-custom-enter' : 'toast-custom-leave'} toast-custom-success`}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div className="toast-icon-success">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </div>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: '15px', color: '#1e293b', lineHeight: 1.2, marginBottom: '2px' }}>
                            Thông báo
                        </div>
                        <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 500, lineHeight: 1.3 }}>
                            Cập nhật thông tin tài khoản thành công!
                        </div>
                    </div>
                </div>
                <button 
                    onClick={() => toast.dismiss(t.id)}
                    className="toast-close-btn"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
        ), {
            position: 'top-right',
            duration: 3000
        });
        handleClose();
    };

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
                        label="Số điện thoại"
                        variant="outlined"
                        value={user.phone || 'Chưa cung cấp'}
                        slotProps={{ input: { readOnly: true } }}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', bgcolor: '#fafafa' } }}
                    />
                </Box>
                <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}>
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

            <Box sx={{ mt: 4 }}>
                <Button 
                    variant="contained" 
                    onClick={handleOpen}
                    sx={{ 
                        bgcolor: COLORS.primaryBlue, 
                        borderRadius: '8px', 
                        textTransform: 'none', 
                        fontWeight: 700, 
                        px: 4, 
                        py: 1.2,
                        '&:hover': { bgcolor: '#0f3170' }
                    }}
                >
                    Cập nhật thông tin
                </Button>
            </Box>

            {/* POPUP UPDATE FORM */}
            <Dialog 
                open={open} 
                onClose={handleClose} 
                maxWidth="sm" 
                fullWidth
                PaperProps={{
                    sx: { borderRadius: '16px', p: 1 }
                }}
            >
                <DialogTitle sx={{ fontWeight: 800, color: COLORS.primaryBlue, pb: 1 }}>
                    Cập Nhật Thông Tin Tài Khoản
                </DialogTitle>
                
                <form onSubmit={handleSubmit}>
                    <DialogContent dividers>
                        <Stack spacing={3} sx={{ py: 1 }}>
                            <TextField
                                fullWidth
                                label="Họ"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                            />
                            <TextField
                                fullWidth
                                label="Tên đệm"
                                name="middleName"
                                value={formData.middleName}
                                onChange={handleChange}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                            />
                            <TextField
                                fullWidth
                                label="Tên"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                            />
                            <TextField
                                fullWidth
                                label="Số điện thoại"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                            />
                        </Stack>
                    </DialogContent>
                    
                    <DialogActions sx={{ px: 3, py: 2 }}>
                        <Button 
                            onClick={handleClose} 
                            sx={{ 
                                color: '#666', 
                                textTransform: 'none', 
                                fontWeight: 600 
                            }}
                        >
                            Hủy
                        </Button>
                        <Button 
                            type="submit" 
                            variant="contained" 
                            sx={{ 
                                bgcolor: COLORS.primaryBlue, 
                                textTransform: 'none', 
                                fontWeight: 700,
                                borderRadius: '8px',
                                px: 3,
                                '&:hover': { bgcolor: '#0f3170' }
                            }}
                        >
                            Lưu thay đổi
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
}
