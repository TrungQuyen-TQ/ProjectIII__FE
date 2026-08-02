// src/pages/cart.js
import React, { useState } from 'react';
import Head from 'next/head';
import { Box, Container } from '@mui/material';

import MainLayout from '../layouts/MainLayout';
import CartItemList from '../sections/cart/CartItemList';
import CartSummary from '../sections/cart/CartSummary';

// Dữ liệu mẫu (Dummy data) - Đã chuyển giá tiền sang dạng SỐ (Number) để tính toán
const initialCartItems = [
  {
    id: 1,
    name: 'Bút Gel Thiên Long Pokémon GEL-045/PKM – Mực Xanh 0.5mm',
    variant: 'Eevee',
    price: 10800,
    originalPrice: 12000,
    discount: '-10%',
    qty: 1,
    image: 'https://images.unsplash.com/photo-1583485088034-697b5a624f47?w=150&q=80'
  },
  {
    id: 2,
    name: 'Bút Gel Thiên Long GOAL GEL-052 Quick Dry – 0.5mm',
    variant: 'Xanh - Cán Xanh',
    price: 54000,
    originalPrice: 60000,
    discount: '-10%',
    qty: 5,
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=150&q=80'
  }
];

// Hàm hỗ trợ định dạng tiền tệ (VD: 10800 -> "10,800đ")
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
};

export default function CartPage() {
  const [cartItems, setCartItems] = useState(initialCartItems);

  // --- CÁC HÀM XỬ LÝ SỰ KIỆN ---
  const handleIncrease = (id) => {
    setCartItems(items => items.map(item => item.id === id ? { ...item, qty: item.qty + 1 } : item));
  };

  const handleDecrease = (id) => {
    setCartItems(items => items.map(item => item.id === id && item.qty > 1 ? { ...item, qty: item.qty - 1 } : item));
  };

  const handleRemove = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // --- TÍNH TOÁN ORDER SUMMARY ---
  const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const subTotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const shippingFee = subTotal > 0 ? 30000 : 0; // Phí ship giả định 30k (nếu giỏ hàng trống thì = 0)
  const taxes = 0; // Thuế giả định = 0
  const grandTotal = subTotal + shippingFee + taxes;

  return (
    <>
      <Head>
        <title>Giỏ hàng | Tạp Hóa Store</title>
      </Head>

      <MainLayout>
        <Box sx={{ bgcolor: '#f5f7fa', minHeight: '100vh', py: 6 }}>
          <Container maxWidth="lg">
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'flex-start', gap: 4 }}>
              
              {/* CỘT TRÁI: DANH SÁCH SẢN PHẨM */}
              <Box sx={{ flex: { xs: '1 1 100%', md: '2 1 0%' }, width: '100%', minWidth: 0 }}>
                <CartItemList
                  cartItems={cartItems}
                  onIncrease={handleIncrease}
                  onDecrease={handleDecrease}
                  onRemove={handleRemove}
                  onClearCart={handleClearCart}
                  formatPrice={formatPrice}
                />
              </Box>

              {/* CỘT PHẢI: ORDER SUMMARY */}
              <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 0%' }, width: '100%', minWidth: 0, position: 'sticky', top: 120 }}>
                <CartSummary
                  cartItems={cartItems}
                  totalItems={totalItems}
                  subTotal={subTotal}
                  shippingFee={shippingFee}
                  taxes={taxes}
                  grandTotal={grandTotal}
                  formatPrice={formatPrice}
                />
              </Box>

            </Box>
          </Container>
        </Box>
      </MainLayout>
    </>
  );
}