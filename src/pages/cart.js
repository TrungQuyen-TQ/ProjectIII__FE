// src/pages/cart.js
import React from 'react';
import Head from 'next/head';
import { Box, Container } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';

import MainLayout from '../layouts/MainLayout';
import CartItemList from '../sections/cart/CartItemList';
import CartSummary from '../sections/cart/CartSummary';
import { updateQuantity, removeFromCart, clearCart } from '../redux/slices/cartSlice';

// Hàm hỗ trợ định dạng tiền tệ (VD: 10800 -> "10,800đ")
const formatPrice = (price) => {
  const numericPrice = typeof price === 'number' ? price : parseFloat(price) || 0;
  return new Intl.NumberFormat('vi-VN').format(numericPrice) + 'đ';
};

export default function CartPage() {
  const dispatch = useDispatch();
  const reduxItems = useSelector((state) => state.cart.items);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Mapping quantity -> qty để tương thích với CartItemList & CartSummary
  const cartItems = mounted ? reduxItems.map(item => ({
    ...item,
    qty: item.quantity
  })) : [];

  // --- CÁC HÀM XỬ LÝ SỰ KIỆN QUA REDUX ---
  const handleIncrease = (id) => {
    const item = cartItems.find(i => i.id === id);
    if (item) {
      dispatch(updateQuantity({ id, quantity: item.qty + 1 }));
    }
  };

  const handleDecrease = (id) => {
    const item = cartItems.find(i => i.id === id);
    if (item && item.qty > 1) {
      dispatch(updateQuantity({ id, quantity: item.qty - 1 }));
    }
  };

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
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