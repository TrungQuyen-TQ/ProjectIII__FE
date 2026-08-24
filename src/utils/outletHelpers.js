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
    .filter((p) => p.discountPercent > 25);

  // 2. Gom nhóm sản phẩm theo các danh mục từ API
  const rootCategories = categories.filter(c => !c.parentId && !c.parent_id);

  const ICON_MAP = {
    'qua-luu-niem': '🎁',
    'thiep-chuc-mung': '💌',
    'bup-be': '🎎',
    'van-phong-pham': '📁',
    'cap-tai-lieu': '📁',
    'balo': '🎒',
    'tui-xach': '👜',
    'my-pham': '💄'
  };

  const BANNER_MAP = {
    'qua-luu-niem': '/banner/bannerluuniem.avif',
    'thiep-chuc-mung': '/banner/bannerthiepchucmung.avif',
    'bup-be': '/banner/bannerbupbe.avif',
    'van-phong-pham': '/banner/bannercaptailieu.avif',
    'cap-tai-lieu': '/banner/bannercaptailieu.avif',
    'balo': '/banner/bannertuixach.avif',
    'tui-xach': '/banner/bannertuixach.avif',
    'my-pham': '/banner/bannerdolamdep.avif'
  };

  const getSlug = (cat) => {
    if (cat.slug) return cat.slug;
    const name = (cat.name || cat.title || '').toLowerCase();
    if (name.includes('lưu niệm')) return 'qua-luu-niem';
    if (name.includes('thiệp')) return 'thiep-chuc-mung';
    if (name.includes('búp bê')) return 'bup-be';
    if (name.includes('văn phòng') || name.includes('tài liệu') || name.includes('cặp')) return 'van-phong-pham';
    if (name.includes('túi') || name.includes('balo')) return 'balo';
    if (name.includes('mỹ phẩm') || name.includes('làm đẹp')) return 'my-pham';
    return cat.id;
  };

  const sections = rootCategories.map((cat) => {
    const catSlug = getSlug(cat);
    const icon = ICON_MAP[catSlug] || '📁';
    const bannerImage = BANNER_MAP[catSlug] || null;

    // Tìm các danh mục con
    const childIds = categories.filter(c => c.parentId === cat.id || c.parent_id === cat.id).map(c => c.id);
    const categoryIds = [cat.id, ...childIds];

    const matchedProducts = discountedProducts
      .filter((p) => categoryIds.includes(p.categoryId) || categoryIds.includes(String(p.categoryId)))
      .sort((a, b) => b.discountPercent - a.discountPercent);

    return {
      id: cat.id,
      slug: catSlug,
      name: cat.name || cat.title,
      icon,
      bannerImage,
      bannerTitle: `${icon} ${(cat.name || cat.title).toUpperCase()} - GIÁ HỜI`,
      products: matchedProducts,
    };
  }).filter((section) => section.products.length > 0);

  // 3. Sắp xếp danh mục theo mức giảm giá cao nhất
  sections.sort((a, b) => {
    const maxDiscountA = a.products[0]?.discountPercent || 0;
    const maxDiscountB = b.products[0]?.discountPercent || 0;
    return maxDiscountB - maxDiscountA;
  });

  return sections;
}
