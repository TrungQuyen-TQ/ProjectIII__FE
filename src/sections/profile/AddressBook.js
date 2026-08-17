import React, { useEffect, useState, useCallback } from 'react';
import {
    Box, Typography, Button, Chip, IconButton, CircularProgress, Divider,
    Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import toast from 'react-hot-toast';

import addressService from '../../services/addressService';
import AddressFormDialog from './AddressFormDialog';

const COLORS = {
    primaryBlue: '#17479d',
    activeOrange: '#ff910d',
    borderGray: '#e0eaf5'
};

export default function AddressBook({ onCountChange }) {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState('create'); // 'create' | 'edit'
    const [editingAddress, setEditingAddress] = useState(null);

    const [deletingId, setDeletingId] = useState(null);
    const [confirmDeleteAddress, setConfirmDeleteAddress] = useState(null); // address chờ xác nhận xóa

    const loadAddresses = useCallback(async () => {
        setLoading(true);
        const data = await addressService.getMyAddresses();
        const list = Array.isArray(data) ? data : [];
        setAddresses(list);
        onCountChange?.(list.length);
        setLoading(false);
    }, [onCountChange]);

    useEffect(() => {
        loadAddresses();
    }, [loadAddresses]);

    const openCreateDialog = () => {
        setDialogMode('create');
        setEditingAddress(null);
        setDialogOpen(true);
    };

    // --- SỬA ĐỊA CHỈ ---
    const openEditDialog = (address) => {
        setDialogMode('edit');
        setEditingAddress(address);
        setDialogOpen(true);
    };

    const closeDialog = () => {
        setDialogOpen(false);
        setEditingAddress(null);
    };

    const handleSubmitDialog = async (dto) => {
        try {
            if (dialogMode === 'edit' && editingAddress) {
                // PUT /api/CustomerAddresses/my/{id}
                await addressService.updateAddress(editingAddress.id, dto);
                toast.success('Cập nhật địa chỉ thành công!');
            } else {
                // POST /api/CustomerAddresses/my
                await addressService.createAddress(dto);
                toast.success('Thêm địa chỉ mới thành công!');
            }
            closeDialog();
            await loadAddresses();
        } catch (err) {
            toast.error(err.response?.data || err.response?.data?.message || err.message || 'Có lỗi xảy ra, vui lòng thử lại.');
        }
    };

    // Bấm icon thùng rác -> chỉ mở dialog xác nhận, chưa xóa
    const openDeleteConfirm = (address) => {
        setConfirmDeleteAddress(address);
    };

    const closeDeleteConfirm = () => {
        if (deletingId) return; // đang xóa dở thì không cho đóng
        setConfirmDeleteAddress(null);
    };

    // Bấm "Xóa" trong dialog xác nhận -> gọi API thật
    const handleConfirmDelete = async () => {
        if (!confirmDeleteAddress) return;
        const address = confirmDeleteAddress;
        try {
            setDeletingId(address.id);
            await addressService.deleteAddress(address.id);
            toast.success('Đã xóa địa chỉ.');
            setConfirmDeleteAddress(null);
            await loadAddresses();
        } catch (err) {
            toast.error(err.response?.data || err.message || 'Không thể xóa địa chỉ này.');
        } finally {
            setDeletingId(null);
        }
    };

    // Đặt làm mặc định = gọi PUT với isDefault: true, giữ nguyên các trường còn lại
    const handleSetDefault = async (address) => {
        try {
            await addressService.updateAddress(address.id, {
                receiverName: address.receiverName,
                phone: address.phone,
                provinceCity: address.provinceCity,
                wardCommune: address.wardCommune,
                addressDetail: address.addressDetail,
                isDefault: true
            });
            toast.success('Đã đặt làm địa chỉ mặc định.');
            await loadAddresses();
        } catch (err) {
            toast.error(err.response?.data || err.message || 'Không thể cập nhật địa chỉ mặc định.');
        }
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                <Typography variant="h6" sx={{ color: COLORS.activeOrange, fontWeight: 800, textTransform: 'uppercase', fontSize: '1.1rem', letterSpacing: '0.5px' }}>
                    SỔ ĐỊA CHỈ GIAO HÀNG
                </Typography>
                <Button
                    startIcon={<AddIcon />}
                    variant="contained"
                    onClick={openCreateDialog}
                    sx={{
                        bgcolor: COLORS.primaryBlue,
                        textTransform: 'none',
                        fontWeight: 700,
                        borderRadius: '8px',
                        boxShadow: 'none',
                        '&:hover': { bgcolor: '#0f3170', boxShadow: 'none' }
                    }}
                >
                    Thêm địa chỉ mới
                </Button>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                    <CircularProgress size={28} />
                </Box>
            ) : addresses.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 6, color: '#888' }}>
                    <Typography variant="body2">Bạn chưa lưu địa chỉ nào. Hãy thêm địa chỉ giao hàng đầu tiên!</Typography>
                </Box>
            ) : (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5 }}>
                    {addresses.map((addr) => (
                        <Box
                            key={addr.id}
                            sx={{
                                p: 2.5,
                                borderRadius: '12px',
                                border: addr.isDefault ? `1.5px solid ${COLORS.primaryBlue}` : `1px solid ${COLORS.borderGray}`,
                                bgcolor: addr.isDefault ? '#f4f8fc' : '#fff',
                                position: 'relative'
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                                <Typography variant="body1" sx={{ fontWeight: 700, color: '#333' }}>
                                    {addr.receiverName}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#777' }}>· {addr.phone}</Typography>
                                {addr.isDefault && (
                                    <Chip
                                        icon={<CheckCircleIcon sx={{ fontSize: '0.9rem !important' }} />}
                                        label="Địa chỉ mặc định"
                                        size="small"
                                        sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 600 }}
                                    />
                                )}
                            </Box>

                            <Typography variant="body2" sx={{ color: '#555', mb: 2 }}>
                                {addr.addressDetail}, {addr.wardCommune}, {addr.provinceCity}
                            </Typography>

                            <Divider sx={{ mb: 1.5 }} />

                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                                {!addr.isDefault ? (
                                    <Button
                                        size="small"
                                        onClick={() => handleSetDefault(addr)}
                                        sx={{ textTransform: 'none', fontWeight: 600, color: COLORS.primaryBlue }}
                                    >
                                        Đặt làm mặc định
                                    </Button>
                                ) : <span />}

                                <Box>
                                    <IconButton size="small" onClick={() => openEditDialog(addr)} title="Sửa địa chỉ">
                                        <EditIcon fontSize="small" sx={{ color: COLORS.primaryBlue }} />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        onClick={() => openDeleteConfirm(addr)}
                                        disabled={deletingId === addr.id}
                                        title="Xóa địa chỉ"
                                    >
                                        {deletingId === addr.id
                                            ? <CircularProgress size={16} />
                                            : <DeleteIcon fontSize="small" sx={{ color: '#d32f2f' }} />}
                                    </IconButton>
                                </Box>
                            </Box>
                        </Box>
                    ))}
                </Box>
            )}

            <AddressFormDialog
                open={dialogOpen}
                mode={dialogMode}
                initialAddress={editingAddress}
                onClose={closeDialog}
                onSubmit={handleSubmitDialog}
            />

            {/* Dialog xác nhận xóa - thay cho window.confirm() gốc của trình duyệt */}
            <Dialog
                open={!!confirmDeleteAddress}
                onClose={closeDeleteConfirm}
                maxWidth="xs"
                fullWidth
                PaperProps={{ sx: { borderRadius: '16px', p: 0.5 } }}
            >
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.2, fontWeight: 800, color: '#333' }}>
                    <Box sx={{
                        width: 40, height: 40, borderRadius: '50%',
                        bgcolor: '#fdecea', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                        <WarningAmberIcon sx={{ color: '#d32f2f' }} />
                    </Box>
                    Xóa địa chỉ này?
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                        Bạn có chắc muốn xóa địa chỉ của{' '}
                        <Box component="span" sx={{ fontWeight: 700, color: '#333' }}>
                            {confirmDeleteAddress?.receiverName}
                        </Box>
                        ? Hành động này không thể hoàn tác.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5 }}>
                    <Button
                        onClick={closeDeleteConfirm}
                        disabled={!!deletingId}
                        sx={{ textTransform: 'none', fontWeight: 700, color: '#666' }}
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        disabled={!!deletingId}
                        variant="contained"
                        color="error"
                        sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '8px', boxShadow: 'none', px: 3 }}
                    >
                        {deletingId ? <CircularProgress size={18} sx={{ color: 'white' }} /> : 'Xóa địa chỉ'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}