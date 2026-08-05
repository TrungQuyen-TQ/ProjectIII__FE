import React from 'react';
import { Box, Paper, Typography, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

const COLORS = {
    primaryBlue: '#17479d',
    activeOrange: '#ff910d',
    borderGray: '#e0eaf5'
};

export default function ShippingInfo({
    formData,
    handleInputChange,
    provinces,
    districts,
    wards,
    selectedProvinceCode,
    selectedDistrictCode,
    handleProvinceChange,
    handleDistrictChange,
    handleWardChange
}) {
    return (
        <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', border: `1px solid ${COLORS.borderGray}`, bgcolor: '#ffffff' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <LocalShippingIcon sx={{ color: COLORS.activeOrange, fontSize: '1.5rem' }} />
                <Typography variant="h6" sx={{ color: COLORS.primaryBlue, fontWeight: 800, textTransform: 'uppercase', fontSize: '1rem', letterSpacing: '0.5px' }}>
                    1. Thông tin giao nhận
                </Typography>
            </Box>

            <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, 
                gap: 2.5 
            }}>
                {/* Họ và tên */}
                <Box>
                    <TextField
                        required
                        fullWidth
                        name="fullName"
                        label="Họ và Tên người nhận"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                    />
                </Box>

                {/* Số điện thoại */}
                <Box>
                    <TextField
                        required
                        fullWidth
                        name="phone"
                        label="Số điện thoại nhận hàng"
                        value={formData.phone}
                        onChange={handleInputChange}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                    />
                </Box>

                {/* Địa chỉ Email */}
                <Box>
                    <TextField
                        required
                        fullWidth
                        name="email"
                        type="email"
                        label="Địa chỉ Email"
                        value={formData.email}
                        onChange={handleInputChange}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                    />
                </Box>
                
                {/* Tỉnh / Thành phố */}
                <Box>
                    <FormControl fullWidth required>
                        <InputLabel id="province-select-label">Tỉnh / Thành phố</InputLabel>
                        <Select
                            labelId="province-select-label"
                            value={selectedProvinceCode}
                            label="Tỉnh / Thành phố"
                            onChange={handleProvinceChange}
                            sx={{ borderRadius: '8px' }}
                        >
                            {provinces.map((p) => (
                                <MenuItem key={p.code} value={p.code}>{p.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                {/* Quận / Huyện */}
                <Box>
                    <FormControl fullWidth required disabled={!selectedProvinceCode}>
                        <InputLabel id="district-select-label">Quận / Huyện</InputLabel>
                        <Select
                            labelId="district-select-label"
                            value={selectedDistrictCode}
                            label="Quận / Huyện"
                            onChange={handleDistrictChange}
                            sx={{ borderRadius: '8px' }}
                        >
                            {districts.map((d) => (
                                <MenuItem key={d.code} value={d.code}>{d.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                {/* Phường / Xã */}
                <Box>
                    <FormControl fullWidth required disabled={!selectedDistrictCode}>
                        <InputLabel id="ward-select-label">Phường / Xã</InputLabel>
                        <Select
                            labelId="ward-select-label"
                            value={formData.ward}
                            label="Phường / Xã"
                            onChange={handleWardChange}
                            sx={{ borderRadius: '8px' }}
                        >
                            {wards.map((w) => (
                                <MenuItem key={w.code} value={w.name}>{w.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                
                {/* Địa chỉ chi tiết (Cùng hàng với Phường / Xã) */}
                <Box>
                    <TextField
                        required
                        fullWidth
                        name="streetAddress"
                        label="Địa chỉ chi tiết (Số nhà, tên đường, tòa nhà...)"
                        value={formData.streetAddress}
                        onChange={handleInputChange}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                    />
                </Box>

                {/* Ghi chú đơn hàng (Chiếm trọn 2 cột) */}
                <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}>
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        name="notes"
                        label="Ghi chú đơn hàng (Ví dụ: giao giờ hành chính, gọi trước khi giao...)"
                        value={formData.notes}
                        onChange={handleInputChange}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                    />
                </Box>
            </Box>
        </Paper>
    );
}
