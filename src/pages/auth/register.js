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

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <>
      <Head>
        <title>Đăng ký | Tạp Hóa Store</title>
      </Head>

      <MainLayout>
        {/* ĐỔI LỚN NHẤT TẠI ĐÂY: Dùng py thay vì my, thêm flexGrow: 1 */}
        <Box sx={{ display: 'flex', flexGrow: 1, alignItems: 'center', justifyContent: 'center', bgcolor: '#ffffff', py: { xs: 6, md: 10 }, width: '100%' }}>
          <Container maxWidth="lg" sx={{ width: '100%' }}>
            <Grid container spacing={4} alignItems="center" justifyContent="center">

              <Grid item xs={12} lg={6} sx={{ order: { xs: 2, lg: 1 }, display: 'flex', justifyContent: 'center' }}>
                <Box sx={{ width: '100%', maxWidth: 500, mx: 'auto' }}>
                  <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                    Đăng ký tài khoản
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    Vui lòng điền đầy đủ thông tin dưới đây.
                  </Typography>

                  <Box component="form" noValidate>
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Họ và Tên <span style={{ color: 'red', fontWeight: 700 }}>*</span></Typography>
                      <TextField fullWidth placeholder="Họ và Tên *" variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
                    </Box>

                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Nhập Email của bạn <span style={{ color: 'red', fontWeight: 700 }}>*</span></Typography>
                      <TextField fullWidth placeholder="Email " variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
                    </Box>

                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Nhập mật khẩu của bạn <span style={{ color: 'red', fontWeight: 700 }}>*</span></Typography>
                      <TextField
                        fullWidth
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Mật khẩu"
                        variant="outlined"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
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
                    </Box>

                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Nhập lại mật khẩu của bạn <span style={{ color: 'red', fontWeight: 700 }}>*</span></Typography>
                      <TextField
                        fullWidth
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Nhập lại mật khẩu"
                        variant="outlined"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                        slotProps={{
                          input: {
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle confirm password visibility"
                                  onClick={handleClickShowConfirmPassword}
                                  edge="end"
                                >
                                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            )
                          }
                        }}
                      />
                    </Box>

                    <Button type="submit" fullWidth variant="contained" size="large" sx={{ py: 1.5, mt: 4, mb: 3, borderRadius: '8px', fontWeight: 700, textTransform: 'none', boxShadow: '0 4px 14px 0 rgba(23,71,157,0.39)', bgcolor: '#17479d', '&:hover': { bgcolor: '#0f3170' } }}>
                      Đăng ký
                    </Button>

                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body2">
                        Đã có tài khoản?{' '}
                        <Link href="/auth/login" passHref legacyBehavior>
                          <MuiLink sx={{ fontWeight: 700, textDecoration: 'none', cursor: 'pointer' }}>Đăng nhập.</MuiLink>
                        </Link>
                      </Typography>
                    </Box>

                    <Typography variant="caption" display="block" sx={{ mt: 4, color: 'text.secondary', textAlign: 'center' }}>
                      Bằng cách nhấn vào nút "Đăng ký", bạn đã đồng ý với các{' '}
                      <MuiLink href="#" sx={{ textDecoration: 'underline' }}>điều khoản và điều kiện dịch vụ</MuiLink> của chúng tôi.
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} lg={6} sx={{ display: { xs: 'none', lg: 'flex' }, justifyContent: 'center', order: { xs: 1, lg: 2 } }}>
                <Box sx={{ bgcolor: '#f7f9fc', borderRadius: '32px', p: 8, width: '100%', textAlign: 'center' }}>
                  <Box
                    component="img"
                    src="/registerImage.svg"
                    alt="Register Illustration"
                    sx={{ width: '100%', maxWidth: 450, height: 'auto' }}
                  />
                </Box>
              </Grid>

            </Grid>
          </Container>
        </Box>
      </MainLayout>
    </>
  );
}