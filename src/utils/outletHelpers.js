// Danh sách 6 gian hàng chuẩn kèm đường dẫn banner có sẵn trong project
export const TARGET_CATEGORIES = [
  {
    id: 'qua-luu-niem',
    name: 'Quà lưu niệm',
    icon: '🎁',
    bannerImage: '/banner/bannerluuniem.avif',
    categoryIds: [1, '1', 'qua-luu-niem'],
    keywords: ['luu-niem', 'quà', 'lưu niệm', 'souvenir', 'móc khóa', 'khung ảnh', 'sổ tay', 'gấu bông', 'teddy'],
  },
  {
    id: 'thiep-chuc-mung',
    name: 'Thiệp chúc mừng',
    icon: '💌',
    bannerImage: '/banner/bannerthiepchucmung.avif',
    categoryIds: [2, '2', 'thiep-chuc-mung'],
    keywords: ['thiep', 'thiệp', 'chúc mừng', 'card', 'postcard'],
  },
  {
    id: 'bup-be',
    name: 'Búp bê',
    icon: '🎎',
    bannerImage: '/banner/bannerbupbe.avif',
    categoryIds: [3, '3', 'bup-be'],
    keywords: ['bup-be', 'búp bê', 'doll', 'barbie', 'nhồi bông'],
  },
  {
    id: 'cap-tai-lieu',
    name: 'Cặp tài liệu',
    icon: '📁',
    bannerImage: '/banner/bannercaptailieu.avif',
    categoryIds: [4, '4', 'cap-tai-lieu'],
    keywords: ['cap', 'tài liệu', 'cặp', 'file', 'folder', 'hồ sơ', 'bìa'],
  },
  {
    id: 'tui-xach',
    name: 'Túi xách',
    icon: '👜',
    bannerImage: '/banner/bannertuixach.avif',
    categoryIds: [5, '5', 'tui-xach'],
    keywords: ['tui-xach', 'túi', 'xách', 'bag', 'balo', 'ví'],
  },
  {
    id: 'my-pham',
    name: 'Mỹ phẩm',
    icon: '💄',
    bannerImage: '/banner/bannerdolamdep.avif',
    categoryIds: [6, '6', 'my-pham'],
    keywords: ['my-pham', 'mỹ phẩm', 'làm đẹp', 'cosmetic', 'son', 'trang điểm', 'dưỡng', 'makeup'],
  },
];

// Hàm chuyển đổi giá an toàn: Tự động loại bỏ dấu chấm, dấu phẩy, ký tự "đ", v.v.
function parsePriceValue(val) {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  // Lọc lấy toàn bộ chữ số
  const cleaned = String(val).replace(/[^0-9]/g, '');
  return Number(cleaned) || 0;
}

function parseDiscountPercent(p) {
  let discount = p.discountPercent || p.discount || 0;
  if (typeof discount === 'string') {
    discount = Number(discount.replace(/[^0-9]/g, ''));
  }

  const original = parsePriceValue(p.originalPrice || p.oldPrice || p.price);
  const current = parsePriceValue(p.price || p.salePrice);

  if (!discount && original > current && original > 0) {
    discount = Math.round(((original - current) / original) * 100);
  }
  return Number(discount) || 0;
}

export function getOutletCategorySections(products = [], categories = []) {
  // 1. Lọc sản phẩm giảm giá & chuyển đổi giá về số nguyên chuẩn
  const discountedProducts = products
    .map((p) => {
      const original = parsePriceValue(p.originalPrice || p.oldPrice || p.price);
      const current = parsePriceValue(p.price || p.salePrice);
      const discountPercent = parseDiscountPercent(p);

      return {
        ...p,
        price: current,
        originalPrice:
          original > current
            ? original
            : Math.round(current / (1 - discountPercent / 100)),
        discountPercent,
      };
    })
    .filter((p) => p.discountPercent > 0 || p.originalPrice > p.price);

  // 2. Gom nhóm sản phẩm và gán ảnh banner tương ứng
  const sections = TARGET_CATEGORIES.map((targetCat) => {
    const matchedProducts = discountedProducts
      .filter((p) => {
        const catId = p.categoryId;
        const catSlugStr = String(p.category || p.categorySlug || '').toLowerCase();
        const prodNameStr = String(p.name || '').toLowerCase();

        const matchById =
          targetCat.categoryIds.includes(catId) ||
          targetCat.categoryIds.includes(String(catId));
        const matchByKeyword = targetCat.keywords.some(
          (kw) =>
            catSlugStr.includes(String(kw).toLowerCase()) ||
            prodNameStr.includes(String(kw).toLowerCase())
        );

        return matchById || matchByKeyword;
      })
      .sort((a, b) => b.discountPercent - a.discountPercent);

    return {
      id: targetCat.id,
      name: targetCat.name,
      icon: targetCat.icon,
      bannerImage: targetCat.bannerImage,
      bannerTitle: `${targetCat.icon} ${targetCat.name.toUpperCase()} - GIÁ HỜI`,
      products: matchedProducts,
    };
  }).filter((section) => section.products.length > 0);

  // 3. Ưu tiên gian hàng có sản phẩm giảm giá cao nhất lên đầu
  sections.sort((a, b) => {
    const maxDiscountA = a.products[0]?.discountPercent || 0;
    const maxDiscountB = b.products[0]?.discountPercent || 0;
    return maxDiscountB - maxDiscountA;
  });

  return sections;
}
