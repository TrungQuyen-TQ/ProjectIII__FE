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
import { registerUser } from '../../redux/slices/authSlice';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!username || !email || !password || !confirmPassword) {
      setErrorMsg('Vui lòng điền đầy đủ các thông tin bắt buộc.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Mật khẩu nhập lại không khớp.');
      return;
    }

    // Tách Họ và Tên thành FirstName, MiddleName, LastName cho khớp C# DTO
    const nameParts = username.trim().split(/\s+/);
    let firstName = '';
    let middleName = '';
    let lastName = '';

    if (nameParts.length === 1) {
      firstName = nameParts[0];
    } else if (nameParts.length === 2) {
      lastName = nameParts[0];
      firstName = nameParts[1];
    } else if (nameParts.length > 2) {
      lastName = nameParts[0];
      firstName = nameParts[nameParts.length - 1];
      middleName = nameParts.slice(1, nameParts.length - 1).join(' ');
    }

    try {
      setLoading(true);
      console.log('register.js: Dispatching registerUser with:', { Email: email, Password: password, FirstName: firstName, MiddleName: middleName, LastName: lastName });
      const actionResult = await dispatch(registerUser({ 
        Email: email, 
        Password: password, 
        FirstName: firstName, 
        MiddleName: middleName, 
        LastName: lastName 
      }));
      console.log('register.js: registerUser result:', actionResult);
      if (registerUser.fulfilled.match(actionResult)) {
        setSuccessMsg('Đăng ký tài khoản thành công! Đang chuyển hướng sang trang đăng nhập...');
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      } else {
        setErrorMsg(actionResult.payload || 'Đăng ký thất bại. Vui lòng thử lại.');
      }
    } catch (err) {
      console.error('register.js: Exception in handleSubmit:', err);
      setErrorMsg('Đã có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

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

                  {errorMsg && <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>{errorMsg}</Alert>}
                  {successMsg && <Alert severity="success" sx={{ mb: 2, borderRadius: '8px' }}>{successMsg}</Alert>}

                  <Box component="form" noValidate onSubmit={handleSubmit}>
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Họ và Tên <span style={{ color: 'red', fontWeight: 700 }}>*</span></Typography>
                      <TextField
                        fullWidth
                        placeholder="Họ và Tên *"
                        variant="outlined"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                      />
                    </Box>

                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Nhập Email của bạn <span style={{ color: 'red', fontWeight: 700 }}>*</span></Typography>
                      <TextField
                        fullWidth
                        placeholder="Email "
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                      />
                    </Box>

                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Nhập mật khẩu của bạn <span style={{ color: 'red', fontWeight: 700 }}>*</span></Typography>
                      <TextField
                        fullWidth
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Mật khẩu"
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
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



                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      size="large"
                      disabled={loading}
                      sx={{ py: 1.5, mt: 4, mb: 3, borderRadius: '8px', fontWeight: 700, textTransform: 'none', boxShadow: '0 4px 14px 0 rgba(23,71,157,0.39)', bgcolor: '#17479d', '&:hover': { bgcolor: '#0f3170' } }}
                    >
                      {loading ? 'Đang xử lý...' : 'Đăng ký'}
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