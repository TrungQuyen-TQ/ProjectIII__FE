import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Link as MuiLink,
  Container,
  IconButton,
  InputAdornment,
  Alert
} from '@mui/material';
import Link from 'next/link';
import Head from 'next/head';
import MainLayout from '../../layouts/MainLayout';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { loginUser } from '../../redux/slices/authSlice';
import { toast } from 'react-hot-toast';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email || !password) {
      toast.error('Vui lòng nhập đầy đủ Email và Mật khẩu.');
      setErrorMsg('Vui lòng nhập đầy đủ Email và Mật khẩu.');
      return;
    }

    try {
      setLoading(true);
      console.log('login.js: Dispatching loginUser with:', { Email: email, Password: password });
      const actionResult = await dispatch(loginUser({ Email: email, Password: password }));
      console.log('login.js: loginUser result:', actionResult);
      if (loginUser.fulfilled.match(actionResult)) {
        toast.success('Đăng nhập thành công!');
        setSuccessMsg('Đăng nhập thành công! Đang chuyển hướng...');
        setTimeout(() => {
          router.push('/');
        }, 1500);
      } else {
        const errorText = actionResult.payload || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
        toast.error(errorText);
        setErrorMsg(errorText);
      }
    } catch (err) {
      console.error('login.js: Exception in handleSubmit:', err);
      toast.error('Đã có lỗi xảy ra. Vui lòng thử lại sau.');
      setErrorMsg('Đã có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Đăng nhập | Tạp Hóa Store</title>
      </Head>

      <MainLayout>
        {/* ĐỔI LỚN NHẤT TẠI ĐÂY: Dùng py thay vì my, thêm flexGrow: 1 */}
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#ffffff', py: { xs: 6, md: 10 } }}>
          <Container maxWidth="lg" sx={{ px: { xs: 3, sm: 4, md: 6 } }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, alignItems: 'center', justifyContent: 'center', width: '100%' }}>

              <Box sx={{ width: { xs: '100%', md: '50%' }, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
                <Box sx={{ bgcolor: '#f7f9fc', borderRadius: '32px', p: 8, width: '100%', textAlign: 'center' }}>
                  <Box
                    component="img"
                    src="/loginImage.svg"
                    alt="Login Illustration"
                    sx={{ width: '100%', maxWidth: 400, height: 'auto' }}
                  />
                </Box>
              </Box>

              <Box sx={{ width: { xs: '100%', md: '50%' }, display: 'flex', justifyContent: 'center' }}>
                <Box sx={{ width: '100%', maxWidth: 450, mx: 'auto' }}>
                  <Typography variant="overline" sx={{ fontWeight: 700, color: 'text.secondary', letterSpacing: 1.5 }}>
                    ĐĂNG NHẬP
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 800, mt: 1, mb: 1 }}>
                    Chào mừng trở lại
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    Đăng nhập để tiếp tục mua hàng của bạn.
                  </Typography>

                  {errorMsg && <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>{errorMsg}</Alert>}
                  {successMsg && <Alert severity="success" sx={{ mb: 2, borderRadius: '8px' }}>{successMsg}</Alert>}

                  <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Nhập email của bạn</Typography>
                    <TextField
                      fullWidth
                      placeholder="Email *"
                      variant="outlined"
                      margin="normal"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                    />

                    <Box >
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Nhập mật khẩu của bạn</Typography>
                    </Box>
                    <TextField
                      fullWidth
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Mật khẩu *"
                      variant="outlined"
                      margin="normal"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      sx={{ mb: 4, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                edge="end"
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          )
                        }
                      }}
                    />

                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      size="large"
                      disabled={loading}
                      sx={{ py: 1.5, mb: 3, borderRadius: '8px', fontWeight: 700, textTransform: 'none', boxShadow: '0 4px 14px 0 rgba(23,71,157,0.39)', bgcolor: '#17479d', '&:hover': { bgcolor: '#0f3170' } }}
                    >
                      {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                    </Button>

                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body2">
                        Chưa có tài khoản?{' '}
                        <Link href="/auth/register" passHref legacyBehavior>
                          <MuiLink sx={{ fontWeight: 700, textDecoration: 'none', cursor: 'pointer' }}>Đăng ký ngay.</MuiLink>
                        </Link>
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Container>
        </Box>
      </MainLayout>
    </>
  );
}