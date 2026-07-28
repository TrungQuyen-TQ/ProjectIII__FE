// src/layouts/MainLayout.js
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function MainLayout({ children }) {
  return (
    <div className="layout-container">
      {/* 1. Luồng luôn hiện Header ở trên cùng */}
      <Header />

      {/* 2. Nội dung của từng trang sẽ được thay đổi ở giữa đây */}
      <main style={{ minHeight: '80vh', padding: '20px' }}>
        {children}
      </main>

      {/* 3. Luồng luôn hiện Footer ở dưới cùng */}
      <Footer />
    </div>
  );
}