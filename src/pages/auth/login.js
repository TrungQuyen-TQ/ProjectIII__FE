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
  InputAdornment
} from '@mui/material';
import Link from 'next/link';
import Head from 'next/head';
import MainLayout from '../../layouts/MainLayout';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);

  return (
    <>
      <Head>
        <title>Đăng nhập | Tạp Hóa Store</title>
      </Head>

      <MainLayout>
        {/* ĐỔI LỚN NHẤT TẠI ĐÂY: Dùng py thay vì my, thêm flexGrow: 1 */}
        <Box sx={{ display: 'flex', flexGrow: 1, alignItems: 'center', justifyContent: 'center', bgcolor: '#ffffff', py: { xs: 6, md: 10 }, width: '100%' }}>
          <Container maxWidth="lg" sx={{ width: '100%' }}>
            <Grid container spacing={4} alignItems="center" justifyContent="center">

              <Grid item xs={12} lg={6} sx={{ display: { xs: 'none', lg: 'flex' }, justifyContent: 'center' }}>
                <Box sx={{ bgcolor: '#f7f9fc', borderRadius: '32px', p: 8, width: '100%', textAlign: 'center' }}>
                  <Box
                    component="img"
                    src="/loginImage.svg"
                    alt="Login Illustration"
                    sx={{ width: '100%', maxWidth: 400, height: 'auto' }}
                  />
                </Box>
              </Grid>

              <Grid item xs={12} lg={6} sx={{ display: 'flex', justifyContent: 'center' }}>
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

                  <Box component="form" noValidate sx={{ mt: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Nhập email của bạn</Typography>
                    <TextField fullWidth placeholder="Email *" variant="outlined" margin="normal" required sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />

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

                    <Button type="submit" fullWidth variant="contained" size="large" sx={{ py: 1.5, mb: 3, borderRadius: '8px', fontWeight: 700, textTransform: 'none', boxShadow: '0 4px 14px 0 rgba(23,71,157,0.39)', bgcolor: '#17479d', '&:hover': { bgcolor: '#0f3170' } }}>
                      Đăng nhập
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
              </Grid>
            </Grid>
          </Container>
        </Box>
      </MainLayout>
    </>
  );
}