const API_URL = "http://localhost:5062";

export const getProductImageUrl = (path) => {
  if (!path) return '/images/default-product.jpg';
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('data:') ||
    path.startsWith('/images/') ||
    path.startsWith('/banner/') ||
    path.startsWith('/logo') ||
    path.startsWith('/login') ||
    path.startsWith('/register')
  ) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_URL}${cleanPath}`;
};
