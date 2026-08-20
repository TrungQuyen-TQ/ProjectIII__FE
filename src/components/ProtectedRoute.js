import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { Box, CircularProgress } from '@mui/material';

/**
 * ProtectedRoute Component
 * Bảo vệ các trang yêu cầu đăng nhập với role cụ thể
 * 
 * @param {ReactNode} children - Component trang cần bảo vệ
 * @param {number|number[]} requiredRole - roleId yêu cầu (mặc định: 2 = user bình thường)
 * @param {string} redirectTo - URL redirect khi không đủ quyền (mặc định: /login)
 */
export default function ProtectedRoute({ 
  children, 
  requiredRole = 2, 
  redirectTo = '/login' 
}) {
  const router = useRouter();
  const { user, loading } = useSelector((state) => state.auth);
  const redirectedRef = useRef(false);

  useEffect(() => {
    // Đang kiểm tra đăng nhập
    if (loading) {
      return;
    }

    // Tránh redirect nhiều lần
    if (redirectedRef.current) {
      return;
    }

    // Không đăng nhập
    if (!user) {
      redirectedRef.current = true;
      router.push(redirectTo);
      return;
    }

    // Kiểm tra role
    const allowedRoles = Array.isArray(requiredRole) 
      ? requiredRole 
      : [requiredRole];

    if (!allowedRoles.includes(user.roleId)) {
      redirectedRef.current = true;
      router.push(redirectTo);
    }
  }, [user, loading]);

  // Hiển thị loading khi đang kiểm tra
  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh' 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Nếu đã đăng nhập và có đủ quyền
  if (user && (
    Array.isArray(requiredRole) 
      ? requiredRole.includes(user.roleId)
      : user.roleId === requiredRole
  )) {
    return children;
  }

  // Đang redirect
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}
    >
      <CircularProgress />
    </Box>
  );
}
