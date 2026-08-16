import { Provider } from 'react-redux';
import { useEffect } from 'react';
import { store } from '../redux/store';
import { checkAuth } from '../redux/slices/authSlice';
import { Toaster } from 'react-hot-toast';
import '../styles/globals.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function MyApp({ Component, pageProps }) {
  // Tự động kiểm tra đăng nhập khi vừa mở trang web
  useEffect(() => {
    store.dispatch(checkAuth());
  }, []);

  return (
    <Provider store={store}>
      <Toaster 
        position="top-right" 
        reverseOrder={false}
        toastOptions={{
          style: {
            background: '#ffffff',
            color: '#1e293b',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
            borderRadius: '18px',
            padding: '14px 20px',
            fontSize: '0.88rem',
            fontWeight: 600,
            border: '1.5px solid #f1f5f9',
            fontFamily: '"Inter", "Roboto", sans-serif'
          },
          success: {
            duration: 3000,
            style: {
              background: '#f0fdf4',
              border: '1.5px solid #4ade80',
            }
          },
          error: {
            duration: 4000,
            style: {
              background: '#fef2f2',
              border: '1.5px solid #fca5a5',
              color: '#991b1b'
            }
          }
        }}
      />
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;