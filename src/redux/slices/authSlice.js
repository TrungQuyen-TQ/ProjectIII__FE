import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';

export const checkAuth = createAsyncThunk('auth/checkAuth', async (_, { rejectWithValue }) => {
    try {
        const data = await authService.refreshToken();
        return data.user;
    } catch (err) {
        return rejectWithValue(null);
    }
});

export const loginUser = createAsyncThunk('auth/login', async (dto, { rejectWithValue }) => {
    try {
        console.log('loginUser Thunk: calling authService.login with:', dto);
        const data = await authService.login(dto);
        console.log('loginUser Thunk success:', data);
        return data.user;
    } catch (err) {
        console.error('loginUser Thunk error:', err);
        return rejectWithValue(err.response?.data?.message || 'Đăng nhập thất bại');
    }
});

export const registerUser = createAsyncThunk('auth/register', async (dto, { rejectWithValue }) => {
    try {
        console.log('registerUser Thunk: calling authService.register with:', dto);
        const data = await authService.register(dto);
        console.log('registerUser Thunk success:', data);
        return data;
    } catch (err) {
        console.error('registerUser Thunk error:', err);
        return rejectWithValue(err.response?.data?.message || 'Đăng ký thất bại');
    }
});

export const logoutUser = createAsyncThunk('auth/logout', async () => {
    await authService.logout();
    return null;
});

const authSlice = createSlice({
    name: 'auth',
    initialState: { user: null, loading: true },
    reducers: {
        updateUserAddress: (state, action) => {
            if (state.user) {
                state.user.address = action.payload; // payload: { province, district, ward, streetAddress }
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
            })
            .addCase(checkAuth.rejected, (state) => {
                state.user = null;
                state.loading = false;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
            })
            .addCase(loginUser.rejected, (state) => {
                state.user = null;
                state.loading = false;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
            });
    }
});

export const { updateUserAddress } = authSlice.actions;
export default authSlice.reducer;