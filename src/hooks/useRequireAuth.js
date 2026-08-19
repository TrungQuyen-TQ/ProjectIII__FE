import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

/**
 * Hook kiểm tra authentication và role trước khi render trang
 * Dùng cho các trang có layout riêng (không dùng ProtectedRoute wrapper)
 * 
 * @param {number|number[]} requiredRole - roleId yêu cầu (mặc định: 2)
 * @param {string} redirectTo - URL redirect khi không đủ quyền
 * @returns {Object} { isAuthenticated, isLoading, user, hasAccess }
 */
export default function useRequireAuth(requiredRole = 2, redirectTo = '/login') {
  const router = useRouter();
  const { user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (loading) return;

    // Chưa đăng nhập
    if (!user) {
      router.push(redirectTo);
      return;
    }

    // Kiểm tra role
    const allowedRoles = Array.isArray(requiredRole) 
      ? requiredRole 
      : [requiredRole];

    if (!allowedRoles.includes(user.roleId)) {
      router.push(redirectTo);
    }
  }, [user, loading, requiredRole, redirectTo, router]);

  const allowedRoles = Array.isArray(requiredRole) 
    ? requiredRole 
    : [requiredRole];

  const hasAccess = user && allowedRoles.includes(user.roleId);

  return {
    isAuthenticated: !!user,
    isLoading: loading,
    user,
    hasAccess
  };
}
