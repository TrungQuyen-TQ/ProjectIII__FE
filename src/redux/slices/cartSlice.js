import { createSlice } from '@reduxjs/toolkit';

const isClient = typeof window !== 'undefined';

const getInitialCart = () => {
    if (isClient) {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                return JSON.parse(savedCart);
            } catch (error) {
                console.error("Lỗi parse giỏ hàng từ localStorage:", error);
            }
        }
    }
    return {
        items: [],
        totalQuantity: 0,
    };
};

const saveCart = (state) => {
    if (isClient) {
        localStorage.setItem('cart', JSON.stringify({
            items: state.items,
            totalQuantity: state.totalQuantity
        }));
    }
};

const cartSlice = createSlice({
    name: 'cart',
    initialState: getInitialCart(),
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
            saveCart(state);
        },
        removeFromCart: (state, action) => {
            const id = action.payload;
            state.items = state.items.filter(item => item.id !== id);
            state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
            saveCart(state);
        },
        updateQuantity: (state, action) => {
            const { id, quantity } = action.payload;
            const item = state.items.find(item => item.id === id);
            if (item && quantity > 0) {
                item.quantity = quantity;
            }
            state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
            saveCart(state);
        },
        clearCart: (state) => {
            state.items = [];
            state.totalQuantity = 0;
            saveCart(state);
        }
    }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;