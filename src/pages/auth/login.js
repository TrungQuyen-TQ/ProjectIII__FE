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
import MainLayout from '../../layouts/MainLayout';

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>Login | Tạp Hóa Store</title>
      </Head>

      <MainLayout>
        {/* ĐỔI LỚN NHẤT TẠI ĐÂY: Dùng py thay vì my, thêm flexGrow: 1 */}
        <Box sx={{ display: 'flex', flexGrow: 1, alignItems: 'center', bgcolor: '#ffffff', py: { xs: 6, md: 10 } }}>
          <Container maxWidth="lg">
            <Grid container spacing={4} alignItems="center">
              
              <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
                <Box sx={{ bgcolor: '#f7f9fc', borderRadius: '32px', p: 8, width: '100%', textAlign: 'center' }}>
                  <Box 
                    component="img"
                    src="/loginImage.svg"
                    alt="Login Illustration"
                    sx={{ width: '100%', maxWidth: 400, height: 'auto' }}
                  />
                </Box>
              </Grid>

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
                    <TextField fullWidth placeholder="Email *" variant="outlined" margin="normal" required sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Enter your password</Typography>
                      <Link href="#" passHref legacyBehavior>
                        <MuiLink variant="body2" sx={{ fontWeight: 600, textDecoration: 'none' }}>Forgot your password?</MuiLink>
                      </Link>
                    </Box>
                    <TextField fullWidth type="password" placeholder="Password *" variant="outlined" required sx={{ mb: 4, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">
                        Don't have an account yet?{' '}
                        <Link href="/auth/register" passHref legacyBehavior>
                          <MuiLink sx={{ fontWeight: 700, textDecoration: 'none', cursor: 'pointer' }}>Sign up here.</MuiLink>
                        </Link>
                      </Typography>
                      <Button type="submit" variant="contained" size="large" sx={{ px: 4, py: 1.5, borderRadius: '8px', fontWeight: 700, textTransform: 'none', boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)', bgcolor: '#17479d', '&:hover': { bgcolor: '#0f3170' } }}>
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