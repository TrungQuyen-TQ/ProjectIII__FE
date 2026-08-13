import React from 'react';
import { Box, Typography, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const COLORS = {
    primaryBlue: '#17479d',
    activeOrange: '#ff910d'
};

export default function AddressBook({
    user,
    addressForm,
    setAddressForm,
    provinces,
    districts,
    wards,
    selectedProvinceCode,
    selectedDistrictCode,
    handleProvinceChange,
    handleDistrictChange,
    handleWardChange,
    handleSaveAddress,
    getFullName
}) {
    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant="h6" sx={{ color: COLORS.activeOrange, fontWeight: 800, mb: 3, textTransform: 'uppercase', fontSize: '1.1rem', letterSpacing: '0.5px' }}>
                SỔ ĐỊA CHỈ GIAO HÀNG
            </Typography>

            {/* Hiển thị địa chỉ hiện tại tóm tắt */}
            {user.address && (
                <Box
                    sx={{
                        p: 3,
                        mb: 4,
                        bgcolor: '#f4f8fc',
                        borderRadius: '12px',
                        border: '1px solid #e2edf8',
                        width: '100%'
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5, flexWrap: 'wrap' }}>
                        <Typography variant="body1" sx={{ fontWeight: 700, color: '#333' }}>
                            Họ tên: {getFullName()}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#2e7d32' }}>
                            <CheckCircleIcon sx={{ fontSize: '0.95rem' }} />
                            <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                Địa chỉ mặc định đã lưu
                            </Typography>
                        </Box>
                    </Box>
                    <Typography variant="body2" sx={{ color: '#555', fontWeight: 500 }}>
                        <strong>Địa chỉ đã lưu:</strong> {user.address.streetAddress}, {user.address.ward}, {user.address.district}, {user.address.province}
                    </Typography>
                </Box>
            )}

            {/* FORM CẬP NHẬT ĐỊA CHỈ CHI TIẾT (BỐ CỤC 2 CỘT) */}
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: '#444' }}>
                Thiết lập/Cập nhật địa chỉ nhận hàng mặc định:
            </Typography>

            <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, 
                gap: 2.5,
                mb: 3
            }}>
                {/* Tỉnh / Thành phố */}
                <Box>
                    <FormControl fullWidth required>
                        <InputLabel id="profile-province-select-label">Tỉnh / Thành phố</InputLabel>
                        <Select
                            labelId="profile-province-select-label"
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
                        <InputLabel id="profile-district-select-label">Quận / Huyện</InputLabel>
                        <Select
                            labelId="profile-district-select-label"
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
                        <InputLabel id="profile-ward-select-label">Phường / Xã</InputLabel>
                        <Select
                            labelId="profile-ward-select-label"
                            value={addressForm.ward}
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
                        label="Địa chỉ chi tiết (Số nhà, tên đường, tòa nhà...)"
                        value={addressForm.streetAddress}
                        onChange={(e) => setAddressForm(prev => ({ ...prev, streetAddress: e.target.value }))}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                    />
                </Box>
            </Box>

            <Button
                variant="contained"
                onClick={handleSaveAddress}
                sx={{
                    bgcolor: COLORS.primaryBlue,
                    textTransform: 'none',
                    fontWeight: 700,
                    px: 4,
                    py: 1.2,
                    borderRadius: '8px',
                    boxShadow: 'none',
                    '&:hover': { bgcolor: '#0f3170', boxShadow: 'none' }
                }}
            >
                Lưu địa chỉ mặc định
            </Button>
        </Box>
    );
}
