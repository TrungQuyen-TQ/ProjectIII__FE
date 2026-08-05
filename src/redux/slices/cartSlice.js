import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [], // Danh sách sản phẩm trong giỏ
        totalQuantity: 0,
    },
    reducers: {
        addToCart: (state, action) => {
            // Logic thêm vào giỏ hàng sẽ viết ở đây
        },
        removeFromCart: (state, action) => {
            // Logic xóa khỏi giỏ hàng
        },
        clearCart: (state) => {
            state.items = [];
            state.totalQuantity = 0;
        }
    }
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;