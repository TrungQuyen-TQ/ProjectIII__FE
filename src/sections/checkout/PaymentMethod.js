import React from 'react';
import { Box, Paper, Typography, FormControl, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';

const COLORS = {
    primaryBlue: '#17479d',
    activeOrange: '#ff910d',
    borderGray: '#e0eaf5'
};

export default function PaymentMethod({ paymentMethod, setPaymentMethod, paymentMethods = [] }) {
    const selectedMethod = paymentMethods.find(m => m.id === paymentMethod);
    const showBankInfo = selectedMethod?.paymentCode?.toUpperCase() === 'BANK' || selectedMethod?.name?.toLowerCase().includes('chuyển khoản');

    return (
        <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', border: `1px solid ${COLORS.borderGray}`, bgcolor: '#ffffff' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <CreditCardIcon sx={{ color: COLORS.activeOrange, fontSize: '1.5rem' }} />
                <Typography variant="h6" sx={{ color: COLORS.primaryBlue, fontWeight: 800, textTransform: 'uppercase', fontSize: '1rem', letterSpacing: '0.5px' }}>
                    2. Phương thức thanh toán
                </Typography>
            </Box>

            <FormControl component="fieldset" fullWidth>
                <RadioGroup
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                >
                    {paymentMethods.map((method) => {
                        const isSelected = paymentMethod === method.id;
                        return (
                            <Box key={method.id} sx={{
                                p: 2,
                                mb: 2,
                                borderRadius: '10px',
                                border: isSelected ? '2px solid #17479d' : '1px solid #e0e0e0',
                                bgcolor: isSelected ? '#f4f8fc' : 'white',
                                transition: 'all 0.2s'
                            }}>
                                <FormControlLabel
                                    value={method.id}
                                    control={<Radio color="primary" />}
                                    label={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            {method.logo && (
                                                <Box component="img" src={method.logo} sx={{ width: 40, height: 40, objectFit: 'contain' }} />
                                            )}
                                            <Box>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{method.name}</Typography>
                                                <Typography variant="caption" color="text.secondary">{method.description}</Typography>
                                            </Box>
                                        </Box>
                                    }
                                />
                            </Box>
                        );
                    })}
                </RadioGroup>
            </FormControl>

            {showBankInfo && (
                <Box sx={{ mt: 3, p: 3, bgcolor: '#fafafa', borderRadius: '10px', border: '1px dashed #ccc', textAlign: 'center' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: COLORS.primaryBlue, mb: 1 }}>Thông tin tài khoản nhận tiền:</Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>Ngân hàng: <strong>MB Bank (Ngân hàng Quân Đội)</strong></Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>Số tài khoản: <strong>999999999999</strong></Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>Chủ tài khoản: <strong>CONG TY CỔ PHẦN ARTS</strong></Typography>
                    <Typography variant="caption" sx={{ color: 'red', fontWeight: 600 }}>* Nội dung chuyển khoản: Họ tên + SĐT đặt hàng</Typography>
                </Box>
            )}
        </Paper>
    );
}
