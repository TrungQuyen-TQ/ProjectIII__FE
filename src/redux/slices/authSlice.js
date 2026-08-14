import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';

export const checkAuth = createAsyncThunk('auth/checkAuth', async (_, { rejectWithValue }) => {
    const res = await authService.refreshToken();
    if (res.success) {
        return res.data.user;
    } else {
        return rejectWithValue(null);
    }
});

export const loginUser = createAsyncThunk('auth/login', async (dto, { rejectWithValue }) => {
    console.log('loginUser Thunk: calling authService.login with:', dto);
    const res = await authService.login(dto);
    if (res.success) {
        console.log('loginUser Thunk success:', res.data);
        return res.data.user;
    } else {
        console.error('loginUser Thunk error:', res.error);
        return rejectWithValue(res.error);
    }
});

export const registerUser = createAsyncThunk('auth/register', async (dto, { rejectWithValue }) => {
    console.log('registerUser Thunk: calling authService.register with:', dto);
    const res = await authService.register(dto);
    if (res.success) {
        console.log('registerUser Thunk success:', res.data);
        return res.data;
    } else {
        console.error('registerUser Thunk error:', res.error);
        return rejectWithValue(res.error);
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