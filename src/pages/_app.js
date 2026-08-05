import { Provider } from 'react-redux';
import { useEffect } from 'react';
import { store } from '../redux/store';
import { checkAuth } from '../redux/slices/authSlice';
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
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;