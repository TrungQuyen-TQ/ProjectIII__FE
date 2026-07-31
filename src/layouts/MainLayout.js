// src/layouts/MainLayout.js
import React from 'react';
import Box from '@mui/material/Box';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function MainLayout({ children }) {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh', 
      bgcolor: '#ffffff', // Đổi nền xám thành trắng tinh
      fontFamily: '"Roboto", "Inter", "Helvetica", "Arial", sans-serif' 
    }}>
      <Header />
      
      {/* Thêm flex và flexGrow để thẻ main giãn đều ra lấp khoảng trống */}
      <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </Box>

      <Footer />
    </Box>
  );
}