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

export default function RegisterPage() {
  return (
    <>
      <Head>
        <title>Sign Up | Tạp Hóa Store</title>
      </Head>

      <MainLayout>
        {/* ĐỔI LỚN NHẤT TẠI ĐÂY: Dùng py thay vì my, thêm flexGrow: 1 */}
        <Box sx={{ display: 'flex', flexGrow: 1, alignItems: 'center', bgcolor: '#ffffff', py: { xs: 6, md: 10 } }}>
          <Container maxWidth="lg">
            <Grid container spacing={4} alignItems="center">
              
              <Grid item xs={12} md={6} sx={{ order: { xs: 2, md: 1 } }}>
                <Box sx={{ maxWidth: 500, mx: 'auto' }}>
                  <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                    Create an account
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    Fill out the form to get started.
                  </Typography>

                  <Box component="form" noValidate>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>First name</Typography>
                        <TextField fullWidth placeholder="First name *" variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Last name</Typography>
                        <TextField fullWidth placeholder="Last name *" variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
                      </Grid>
                    </Grid>

                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Enter your email</Typography>
                      <TextField fullWidth placeholder="Email *" variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
                    </Box>

                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Enter your password</Typography>
                      <TextField fullWidth type="password" placeholder="Password *" variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4 }}>
                      <Typography variant="body2">
                        Already have an account?{' '}
                        <Link href="/auth/login" passHref legacyBehavior>
                          <MuiLink sx={{ fontWeight: 700, textDecoration: 'none', cursor: 'pointer' }}>Login.</MuiLink>
                        </Link>
                      </Typography>
                      <Button type="submit" variant="contained" size="large" sx={{ px: 5, py: 1.5, borderRadius: '8px', fontWeight: 700, textTransform: 'none', bgcolor: '#17479d', '&:hover': { bgcolor: '#0f3170' } }}>
                        Sign up
                      </Button>
                    </Box>

                    <Typography variant="caption" display="block" sx={{ mt: 4, color: 'text.secondary' }}>
                      By clicking "Sign up" button you agree with our{' '}
                      <MuiLink href="#" sx={{ textDecoration: 'underline' }}>company terms and conditions.</MuiLink>
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center', order: { xs: 1, md: 2 } }}>
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