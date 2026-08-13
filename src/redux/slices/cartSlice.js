import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [], // Danh sách sản phẩm trong giỏ
        totalQuantity: 0,
    },
    reducers: {
        addToCart: (state, action) => {
            const { product, quantity = 1, variant = '' } = action.payload;
            const existingItem = state.items.find(item => item.id === product.id && item.variant === variant);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                state.items.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image || product.thumbnail,
                    quantity: quantity,
                    sku: product.sku,
                    variant: variant,
                    productVariantId: product.productVariantId || null
                });
            }
            state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
        },
        removeFromCart: (state, action) => {
            const id = action.payload;
            state.items = state.items.filter(item => item.id !== id);
            state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
        },
        updateQuantity: (state, action) => {
            const { id, quantity } = action.payload;
            const item = state.items.find(item => item.id === id);
            if (item && quantity > 0) {
                item.quantity = quantity;
            }
            state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
        },
        clearCart: (state) => {
            state.items = [];
            state.totalQuantity = 0;
        }
    }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;