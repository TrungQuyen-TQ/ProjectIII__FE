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
import { toast } from 'react-hot-toast';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
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

    if (!lastName || !firstName || !email || !password || !confirmPassword || !phone) {
      toast.error('Vui lòng điền đầy đủ các thông tin bắt buộc.');
      setErrorMsg('Vui lòng điền đầy đủ các thông tin bắt buộc.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Mật khẩu nhập lại không khớp.');
      setErrorMsg('Mật khẩu nhập lại không khớp.');
      return;
    }

    try {
      setLoading(true);
      console.log('register.js: Dispatching registerUser with:', { Email: email, Password: password, FirstName: firstName, MiddleName: middleName, LastName: lastName, Phone: phone, RoleId: 2 });
      const actionResult = await dispatch(registerUser({ 
        Email: email, 
        Password: password, 
        FirstName: firstName.trim(), 
        MiddleName: middleName.trim(), 
        LastName: lastName.trim(),
        Phone: phone.trim(),
        RoleId: 2
      }));
      console.log('register.js: registerUser result:', actionResult);
      if (registerUser.fulfilled.match(actionResult)) {
        toast.success('Đăng ký tài khoản thành công!');
        setSuccessMsg('Đăng ký tài khoản thành công! Đang chuyển hướng sang trang đăng nhập...');
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      } else {
        const errorText = actionResult.payload || 'Đăng ký thất bại. Vui lòng thử lại.';
        toast.error(errorText);
        setErrorMsg(errorText);
      }
    } catch (err) {
      console.error('register.js: Exception in handleSubmit:', err);
      toast.error('Đã có lỗi xảy ra. Vui lòng thử lại sau.');
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
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#ffffff', py: { xs: 6, md: 10 } }}>
          <Container maxWidth="lg" sx={{ px: { xs: 3, sm: 4, md: 6 } }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, alignItems: 'center', justifyContent: 'center' }}>

              <Box sx={{ width: { xs: '100%', md: '50%' }, order: { xs: 2, md: 1 }, display: 'flex', justifyContent: 'center' }}>
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
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      {/* Dòng 1: Họ & Tên đệm */}
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Họ <span style={{ color: 'red', fontWeight: 700 }}>*</span></Typography>
                        <TextField
                          fullWidth
                          placeholder="Họ *"
                          variant="outlined"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Tên đệm</Typography>
                        <TextField
                          fullWidth
                          placeholder="Tên đệm"
                          variant="outlined"
                          value={middleName}
                          onChange={(e) => setMiddleName(e.target.value)}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                        />
                      </Grid>

                      {/* Dòng 2: Tên & Số điện thoại */}
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Tên <span style={{ color: 'red', fontWeight: 700 }}>*</span></Typography>
                        <TextField
                          fullWidth
                          placeholder="Tên *"
                          variant="outlined"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Số điện thoại <span style={{ color: 'red', fontWeight: 700 }}>*</span></Typography>
                        <TextField
                          fullWidth
                          placeholder="Số điện thoại *"
                          variant="outlined"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                        />
                      </Grid>

                      {/* Dòng 3: Email */}
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Nhập Email của bạn <span style={{ color: 'red', fontWeight: 700 }}>*</span></Typography>
                        <TextField
                          fullWidth
                          placeholder="Email *"
                          variant="outlined"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                        />
                      </Grid>
                    </Grid>

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
              </Box>

              <Box sx={{ width: { xs: '100%', md: '50%' }, display: { xs: 'none', md: 'flex' }, justifyContent: 'center', order: { xs: 1, md: 2 } }}>
                <Box sx={{ bgcolor: '#f7f9fc', borderRadius: '32px', p: 8, width: '100%', textAlign: 'center' }}>
                  <Box
                    component="img"
                    src="/registerImage.svg"
                    alt="Register Illustration"
                    sx={{ width: '100%', maxWidth: 450, height: 'auto' }}
                  />
                </Box>
              </Box>

            </Box>
          </Container>
        </Box>
      </MainLayout>
    </>
  );
}