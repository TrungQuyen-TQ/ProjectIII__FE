import React from 'react';
import { Box, Paper, Typography, FormControl, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';

const COLORS = {
    primaryBlue: '#17479d',
    activeOrange: '#ff910d',
    borderGray: '#e0eaf5'
};

export default function PaymentMethod({ paymentMethod, setPaymentMethod }) {
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
                    <Box sx={{ 
                        p: 2, 
                        mb: 2, 
                        borderRadius: '10px', 
                        border: paymentMethod === 'cod' ? '2px solid #17479d' : '1px solid #e0e0e0',
                        bgcolor: paymentMethod === 'cod' ? '#f4f8fc' : 'white',
                        transition: 'all 0.2s'
                    }}>
                        <FormControlLabel 
                            value="cod" 
                            control={<Radio color="primary" />} 
                            label={
                                <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Thanh toán khi nhận hàng (COD)</Typography>
                                    <Typography variant="caption" color="text.secondary">Bạn sẽ thanh toán bằng tiền mặt cho shipper khi nhận được hàng.</Typography>
                                </Box>
                            } 
                        />
                    </Box>

                    <Box sx={{ 
                        p: 2, 
                        borderRadius: '10px', 
                        border: paymentMethod === 'bank' ? '2px solid #17479d' : '1px solid #e0e0e0',
                        bgcolor: paymentMethod === 'bank' ? '#f4f8fc' : 'white',
                        transition: 'all 0.2s'
                    }}>
                        <FormControlLabel 
                            value="bank" 
                            control={<Radio color="primary" />} 
                            label={
                                <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Chuyển khoản ngân hàng</Typography>
                                    <Typography variant="caption" color="text.secondary">Chuyển khoản qua số tài khoản ngân hàng hoặc quét mã QR thanh toán nhanh.</Typography>
                                </Box>
                            } 
                        />
                    </Box>
                </RadioGroup>
            </FormControl>

            {paymentMethod === 'bank' && (
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
