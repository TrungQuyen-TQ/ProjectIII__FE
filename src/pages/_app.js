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
        position="top-center" 
        reverseOrder={false}
        toastOptions={{
          style: {
            background: '#ffffff',
            color: '#1e293b',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            borderRadius: '12px',
            padding: '12px 20px',
            fontSize: '0.88rem',
            fontWeight: 500,
            border: '1px solid #f1f5f9',
            fontFamily: '"Inter", "Roboto", sans-serif'
          },
          success: {
            duration: 3000,
            style: {
              borderLeft: '5px solid #10b981', // xanh lá của success
            }
          },
          error: {
            duration: 4000,
            style: {
              borderLeft: '5px solid #ef4444', // đỏ của error
            }
          }
        }}
      />
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;