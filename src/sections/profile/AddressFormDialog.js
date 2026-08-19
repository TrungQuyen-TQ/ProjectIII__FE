import React, { useEffect, useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Box, TextField, FormControl, InputLabel, Select, MenuItem,
    Button, IconButton, FormControlLabel, Switch, CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const COLORS = {
    primaryBlue: '#17479d',
    activeOrange: '#ff910d'
};

// emptyAddress: dùng khi Thêm mới
const emptyForm = {
    receiverName: '',
    phone: '',
    provinceCity: '',
    wardCommune: '',
    addressDetail: '',
    isDefault: false
};

/**
 * Dialog dùng chung cho cả 2 luồng:
 *  - mode="create" -> gọi addressService.createAddress
 *  - mode="edit"    -> gọi addressService.updateAddress(id, dto)
 * Việc gọi API thực sự được thực hiện ở component cha (AddressBook/ profile/index.js)
 * thông qua prop onSubmit, dialog này chỉ chịu trách nhiệm thu thập & validate dữ liệu.
 */
export default function AddressFormDialog({ open, mode = 'create', initialAddress, onClose, onSubmit }) {
    const [form, setForm] = useState(emptyForm);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvinceCode, setSelectedProvinceCode] = useState('');
    const [selectedDistrictCode, setSelectedDistrictCode] = useState('');
    const [districtName, setDistrictName] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Tải danh sách Tỉnh/Thành khi mở dialog
    useEffect(() => {
        if (!open) return;
        fetch('https://provinces.open-api.vn/api/p/')
            .then((res) => res.json())
            .then((data) => setProvinces(data))
            .catch((err) => console.error('Lỗi tải tỉnh thành:', err));
    }, [open]);

    // Khi mở dialog: nếu là Sửa -> đổ dữ liệu có sẵn (tách "Quận/Huyện, Tỉnh/TP" đã lưu trong ProvinceCity)
    useEffect(() => {
        if (!open) return;

        if (mode === 'edit' && initialAddress) {
            const [districtPart, ...provincePart] = (initialAddress.provinceCity || '').split(',').map(s => s.trim());
            const provinceNameGuess = provincePart.length ? provincePart.join(', ') : districtPart;
            const districtNameGuess = provincePart.length ? districtPart : '';

            setForm({
                receiverName: initialAddress.receiverName || '',
                phone: initialAddress.phone || '',
                provinceCity: initialAddress.provinceCity || '',
                wardCommune: initialAddress.wardCommune || '',
                addressDetail: initialAddress.addressDetail || '',
                isDefault: !!initialAddress.isDefault
            });
            setDistrictName(districtNameGuess);

            // Tự map lại code Tỉnh -> Quận/Huyện -> Phường/Xã để 2 combobox hiển thị đúng lựa chọn cũ
            if (provinceNameGuess) {
                fetch('https://provinces.open-api.vn/api/p/')
                    .then((res) => res.json())
                    .then((data) => {
                        setProvinces(data);
                        const foundProv = data.find((p) => p.name === provinceNameGuess);
                        if (foundProv) {
                            setSelectedProvinceCode(foundProv.code);
                            fetch(`https://provinces.open-api.vn/api/p/${foundProv.code}?depth=2`)
                                .then((r) => r.json())
                                .then((distData) => {
                                    const distList = distData.districts || [];
                                    setDistricts(distList);
                                    const foundDist = distList.find((d) => d.name === districtNameGuess);
                                    if (foundDist) {
                                        setSelectedDistrictCode(foundDist.code);
                                        fetch(`https://provinces.open-api.vn/api/d/${foundDist.code}?depth=2`)
                                            .then((r2) => r2.json())
                                            .then((wData) => setWards(wData.wards || []));
                                    }
                                });
                        }
                    });
            }
        } else {
            setForm(emptyForm);
            setDistrictName('');
            setSelectedProvinceCode('');
            setSelectedDistrictCode('');
            setDistricts([]);
            setWards([]);
        }
    }, [open, mode, initialAddress]);

    const handleProvinceChange = (e) => {
        const code = e.target.value;
        setSelectedProvinceCode(code);
        setSelectedDistrictCode('');
        setDistricts([]);
        setWards([]);
        setDistrictName('');
        setForm((prev) => ({ ...prev, wardCommune: '' }));

        fetch(`https://provinces.open-api.vn/api/p/${code}?depth=2`)
            .then((res) => res.json())
            .then((data) => setDistricts(data.districts || []))
            .catch((err) => console.error('Lỗi tải quận huyện:', err));
    };

    const handleDistrictChange = (e) => {
        const code = e.target.value;
        setSelectedDistrictCode(code);
        setWards([]);
        setForm((prev) => ({ ...prev, wardCommune: '' }));

        const dName = districts.find((d) => d.code === code)?.name || '';
        setDistrictName(dName);

        fetch(`https://provinces.open-api.vn/api/d/${code}?depth=2`)
            .then((res) => res.json())
            .then((data) => setWards(data.wards || []))
            .catch((err) => console.error('Lỗi tải phường xã:', err));
    };

    const handleWardChange = (e) => {
        setForm((prev) => ({ ...prev, wardCommune: e.target.value }));
    };

    const handleChange = (field) => (e) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const provinceName = provinces.find((p) => p.code === selectedProvinceCode)?.name || '';

    const isValid =
        form.receiverName.trim() &&
        form.phone.trim() &&
        provinceName &&
        districtName &&
        form.wardCommune &&
        form.addressDetail.trim();

    const handleSubmit = async () => {
        if (!isValid || submitting) return;

        // Backend (CustomerAddress entity) chỉ có 2 trường ProvinceCity + WardCommune (không có
        // cột Quận/Huyện riêng), nên ta gộp "Quận/Huyện, Tỉnh/TP" thành ProvinceCity để không mất dữ liệu.
        const dto = {
            receiverName: form.receiverName.trim(),
            phone: form.phone.trim(),
            provinceCity: `${districtName}, ${provinceName}`,
            wardCommune: form.wardCommune,
            addressDetail: form.addressDetail.trim(),
            isDefault: form.isDefault
        };

        try {
            setSubmitting(true);
            await onSubmit(dto);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onClose={submitting ? undefined : onClose} fullWidth maxWidth="sm"
            PaperProps={{ sx: { borderRadius: '16px' } }}>
            <DialogTitle sx={{ fontWeight: 800, color: COLORS.primaryBlue, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {mode === 'edit' ? 'Sửa địa chỉ' : 'Thêm địa chỉ mới'}
                <IconButton onClick={onClose} disabled={submitting} size="small">
                    <CloseIcon fontSize="small" />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5, pt: 1 }}>
                    <TextField
                        required
                        fullWidth
                        label="Họ và tên người nhận"
                        value={form.receiverName}
                        onChange={handleChange('receiverName')}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                    />
                    <TextField
                        required
                        fullWidth
                        label="Số điện thoại"
                        value={form.phone}
                        onChange={handleChange('phone')}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                    />

                    <FormControl fullWidth required>
                        <InputLabel id="addr-province-label">Tỉnh / Thành phố</InputLabel>
                        <Select
                            labelId="addr-province-label"
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

                    <FormControl fullWidth required disabled={!selectedProvinceCode}>
                        <InputLabel id="addr-district-label">Quận / Huyện</InputLabel>
                        <Select
                            labelId="addr-district-label"
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

                    <FormControl fullWidth required disabled={!selectedDistrictCode} sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}>
                        <InputLabel id="addr-ward-label">Phường / Xã</InputLabel>
                        <Select
                            labelId="addr-ward-label"
                            value={form.wardCommune}
                            label="Phường / Xã"
                            onChange={handleWardChange}
                            sx={{ borderRadius: '8px' }}
                        >
                            {wards.map((w) => (
                                <MenuItem key={w.code} value={w.name}>{w.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        required
                        fullWidth
                        label="Địa chỉ chi tiết (Số nhà, tên đường...)"
                        value={form.addressDetail}
                        onChange={handleChange('addressDetail')}
                        sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' }, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                    />

                    <FormControlLabel
                        sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}
                        control={
                            <Switch
                                checked={form.isDefault}
                                onChange={(e) => setForm((prev) => ({ ...prev, isDefault: e.target.checked }))}
                                color="warning"
                            />
                        }
                        label="Đặt làm địa chỉ mặc định"
                    />
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2.5 }}>
                <Button onClick={onClose} disabled={submitting} sx={{ textTransform: 'none', fontWeight: 700, color: '#666' }}>
                    Hủy
                </Button>
                <Button
                    onClick={handleSubmit}
                    disabled={!isValid || submitting}
                    variant="contained"
                    sx={{
                        bgcolor: COLORS.primaryBlue,
                        textTransform: 'none',
                        fontWeight: 700,
                        borderRadius: '8px',
                        px: 3,
                        boxShadow: 'none',
                        '&:hover': { bgcolor: '#0f3170', boxShadow: 'none' }
                    }}
                >
                    {submitting ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Tiếp tục'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}