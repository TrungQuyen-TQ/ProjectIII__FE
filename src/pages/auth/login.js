import React from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  TextField, 
  Button, 
  Link as MuiLink, 
  Container 
} from '@mui/material';
import Link from 'next/link';
import Head from 'next/head';

// 1. Import MainLayout (chú ý điều chỉnh dấu ../ tùy theo vị trí thư mục của bạn)
import MainLayout from '../../layouts/MainLayout';

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>Login | thefront</title>
      </Head>

      {/* 2. Bọc MainLayout bên ngoài toàn bộ Container */}
      <MainLayout>
        {/* Đổi minHeight: '100vh' thành my: { xs: 4, md: 8 } để tránh bị xuất hiện thanh cuộn kép */}
        <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'white', my: { xs: 4, md: 8 } }}>
          <Container maxWidth="lg">
            <Grid container spacing={4} alignItems="center">
              
              {/* Cột trái: Illustration */}
              <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
                <Box 
                  sx={{ 
                    bgcolor: '#f7f9fc', 
                    borderRadius: '32px', 
                    p: 8, 
                    width: '100%', 
                    textAlign: 'center' 
                  }}
                >
                  <Box 
                    component="img"
                    src="/loginImage.svg"
                    alt="Login Illustration"
                    sx={{ width: '100%', maxWidth: 400, height: 'auto' }}
                  />
                </Box>
              </Grid>

              {/* Cột phải: Form */}
              <Grid item xs={12} md={6}>
                <Box sx={{ maxWidth: 450, mx: 'auto' }}>
                  <Typography variant="overline" sx={{ fontWeight: 700, color: 'text.secondary', letterSpacing: 1.5 }}>
                    LOGIN
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 800, mt: 1, mb: 1 }}>
                    Welcome back
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    Login to manage your account.
                  </Typography>

                  <Box component="form" noValidate sx={{ mt: 1 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Enter your email</Typography>
                    <TextField
                      fullWidth
                      placeholder="Email *"
                      variant="outlined"
                      margin="normal"
                      required
                      sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Enter your password</Typography>
                      <Link href="#" passHref legacyBehavior>
                        <MuiLink variant="body2" sx={{ fontWeight: 600, textDecoration: 'none' }}>Forgot your password?</MuiLink>
                      </Link>
                    </Box>
                    <TextField
                      fullWidth
                      type="password"
                      placeholder="Password *"
                      variant="outlined"
                      required
                      sx={{ mb: 4, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">
                        Don't have an account yet?{' '}
                        <Link href="/register" passHref legacyBehavior>
                          <MuiLink sx={{ fontWeight: 700, textDecoration: 'none' }}>Sign up here.</MuiLink>
                        </Link>
                      </Typography>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        sx={{ 
                          px: 4, 
                          py: 1.5, 
                          borderRadius: '8px', 
                          fontWeight: 700, 
                          textTransform: 'none',
                          boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)'
                        }}
                      >
                        Login
                      </Button>
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