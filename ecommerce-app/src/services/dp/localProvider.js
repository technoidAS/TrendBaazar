import { STORAGE_KEYS } from '../../utils/constants';
import { generateId, delay } from '../../utils/helpers';

const BRANDS = ['AeroFlux', 'NeoTech', 'Aether', 'VaporWare', 'Chronos', 'Zenith', 'Apex'];

// Base Premium Seed Products with Brand fields
const BASE_PRODUCTS = [
  {
    id: 'prod_1',
    name: 'Quantum Flux Sneakers',
    price: 9999,
    category: 'footwear',
    brand: 'AeroFlux',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop&q=80'
    ],
    rating: 4.8,
    reviewCount: 124,
    description: 'Elevate your stride with the Quantum Flux Sneakers. Engineered with kinetic cushioning, high-traction honeycomb outsoles, and breathable mesh fabric, these sneakers bring sci-fi styling to your daily runs.',
    features: ['Responsive kinetic foam midsole', 'Breathable aerodynamic mesh outer', 'Slip-resistant organic rubber outsoles', 'Reflective accent stripes for safety'],
    sizes: ['7', '8', '9', '10', '11'],
    colors: ['Electric Purple', 'Hyper White', 'Carbon Black'],
    stock: 15,
    featured: true
  },
  {
    id: 'prod_2',
    name: 'Cyberpunk Techwear Jacket',
    price: 14500,
    category: 'apparel',
    brand: 'NeoTech',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&auto=format&fit=crop&q=80'
    ],
    rating: 4.6,
    reviewCount: 98,
    description: 'Designed for the modern urban nomad. This techwear jacket boasts a waterproof, wind-resistant outer shell with integrated tactical utility straps, magnetic closures, and a modular hood system.',
    features: ['Triple-layered waterproof membrane', 'Quick-access magnetic tactical pockets', 'Removable storm hood and visor', 'Custom modular attachment straps'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Neon Matte Black', 'Ghost Gray'],
    stock: 8,
    featured: true
  },
  {
    id: 'prod_3',
    name: 'Aether Noise-Canceling Headphones',
    price: 19999,
    category: 'gadgets',
    brand: 'Aether',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&auto=format&fit=crop&q=80'
    ],
    rating: 4.9,
    reviewCount: 231,
    description: 'Immerse yourself in acoustic perfection. Featuring custom-tuned 40mm drivers and premium Hybrid Active Noise Cancellation, the Aether blocks out urban distractions while offering 45 hours of high-fidelity playtime.',
    features: ['Hybrid Active Noise Cancellation (40dB depth)', 'Ultra-comfort memory foam earcups', 'High-res audio codec support (LDAC/aptX)', 'Dual beamforming microphones for crystal-clear calls'],
    sizes: ['One Size'],
    colors: ['Midnight Ash', 'Sunset Copper', 'Alabaster White'],
    stock: 22,
    featured: true
  },
  {
    id: 'prod_4',
    name: 'Chronos Kinetic Smartwatch',
    price: 15999,
    category: 'gadgets',
    brand: 'Chronos',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80'
    ],
    rating: 4.5,
    reviewCount: 84,
    description: 'Merge kinetic movement with digital innovation. The Chronos smartwatch monitors heart rate variability, blood oxygen level, sleep cycles, and syncs seamlessly with all device environments.',
    features: ['Always-On AMOLED sapphire glass display', '7-day battery life on a single charge', 'ATM5 water rating (swim-proof)', 'Comprehensive multi-sport tracking metrics'],
    sizes: ['40mm', '44mm'],
    colors: ['Liquid Platinum', 'Stealth Obsidian'],
    stock: 12,
    featured: false
  },
  {
    id: 'prod_5',
    name: 'Vaporwave Neon Backpack',
    price: 4999,
    category: 'accessories',
    brand: 'VaporWare',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80'
    ],
    rating: 4.7,
    reviewCount: 63,
    description: 'Add a splash of neon nostalgia to your outfit. Made of light-reactive, iridescent vinyl, this backpack shifts colors depending on the viewing angle, offering spacious main pockets and hidden security compartments.',
    features: ['Color-shifting iridescent coating', 'Padded laptop sleeve (fits up to 16 inches)', 'Water-resistant hidden zippers', 'Breathable air-mesh back padding'],
    sizes: ['Standard'],
    colors: ['Neon Holographic'],
    stock: 20,
    featured: false
  },
  {
    id: 'prod_6',
    name: 'Hyperion Leather Boots',
    price: 12999,
    category: 'footwear',
    brand: 'Zenith',
    image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&auto=format&fit=crop&q=80'
    ],
    rating: 4.4,
    reviewCount: 42,
    description: 'Rugged build meets elegant tailoring. Hand-crafted from top-grain water-resistant leather with reinforced welt stitching, the Hyperion is built to endure winter trails and office boards alike.',
    features: ['Premium top-grain cowhide leather', 'Goodyear welted sole constructions', 'Cushioned leather insoles', 'Heavy-duty steel eyelets'],
    sizes: ['8', '9', '10', '11', '12'],
    colors: ['Cacao Brown', 'Midnight Black'],
    stock: 6,
    featured: false
  },
  {
    id: 'prod_7',
    name: 'Spectrum RGB Mechanical Keyboard',
    price: 8999,
    category: 'gadgets',
    brand: 'Apex',
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=80'
    ],
    rating: 4.8,
    reviewCount: 156,
    description: 'Unlock maximum efficiency and feedback. With transparent hot-swappable mechanical switches, custom acoustic foam sound-damping, and full-spectrum RGB programming, typing feels like an orchestra.',
    features: ['Hot-swappable linear yellow switches', 'PBT double-shot keycaps', 'Sound dampening silicone sheets', 'Wireless 2.4GHz / Bluetooth 5.0 / Wired USB-C'],
    sizes: ['75% Layout', 'Full Layout'],
    colors: ['Frosted Ice', 'Cyber Yellow'],
    stock: 11,
    featured: true
  },
  {
    id: 'prod_8',
    name: 'Nebula Oversized Hoodie',
    price: 5999,
    category: 'apparel',
    brand: 'VaporWare',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80'
    ],
    rating: 4.7,
    reviewCount: 112,
    description: 'Indulge in cozy outer space aesthetics. The Nebula features an oversized drop-shoulder design colored in a custom-dyed cosmic swirl print, crafted from double-faced loopback heavyweight cotton fleece.',
    features: ['450GSM organic loopback cotton', 'Oversized comfort drop-shoulder cut', 'Ribbed cuffs and dynamic drawstrings', 'Intricately dyed nebulous aesthetics'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Galaxy Teal', 'Supernova Pink'],
    stock: 14,
    featured: true
  }
];

const MOCK_DATA = {
  apparel: {
    names: [
      'Hyperlight Windbreaker', 'Thermal Utility Cargoes', 'Stealth Compression Tee', 
      'Phantom Trench Coat', 'Glitch Graphic Tee', 'Aether Knit Sweater', 
      'Apex Bomber Jacket', 'Carbon Trackpants', 'Nebula Fleece Vest', 
      'Zenith Parka Hoodie', 'Eclipse Linen Shirt', 'Nova Active Shorts'
    ],
    images: [
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1515438040742-147ed2140c5b?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&auto=format&fit=crop&q=80'
    ]
  },
  footwear: {
    names: [
      'Apex Running Shoes', 'Nebula Trail Sneakers', 'Stealth High-tops', 
      'Vapor Trainer Kicks', 'Zenith Slip-ons', 'Nova Streetwear Creepers', 
      'Chronos Canvas Lows'
    ],
    images: [
      'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&auto=format&fit=crop&q=80'
    ]
  },
  gadgets: {
    names: [
      'AeroFlux Earbuds', 'NeoTech Cyber Mouse', 'Apex VR Goggles', 
      'Nebula Smart Band', 'Zenith Wireless Speaker', 'Chronos Charging Pad', 
      'Quantum Game Controller', 'Stealth Keycap Set', 'Aether Lap Desk', 
      'Apex USB Hub', 'NeoTech Ring Tracker', 'Vaporware RGB Pad', 
      'Chronos Desk Mat', 'Quantum Webcam HD', 'Stealth Microphone', 
      'Nebula Audio Mixer', 'Zenith Cable Organizer', 'AeroFlux Laptop Stand', 
      'Aether Bluetooth Dongle'
    ],
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1622445262465-2481c8573250?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1595225476474-87563907a212?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1597484211625-27a9cfdf9742?w=600&auto=format&fit=crop&q=80'
    ]
  },
  accessories: {
    names: [
      'Zenith Tech Backpack', 'Carbon Cardholder Wallet', 'Nebula Polarized Sunglasses', 
      'AeroFlux Snapback Cap', 'Stealth Utility Belt', 'Chronos Steel Ring', 
      'Apex Travel Pouch', 'NeoTech Key Organizer', 'Vaporware Wrist Strap', 
      'Aether Leather Cuff', 'Quantum Duffle Bag'
    ],
    images: [
      'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1627124765135-565b50d540cf?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1624222247344-550fb8ec2780?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509319117193-57bab727e09d?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1611085583191-a3b1a30a5a40?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80'
    ]
  }
};

const generateMockProducts = () => {
  const products = [...BASE_PRODUCTS];
  const targetCounts = { apparel: 14, footwear: 9, gadgets: 22, accessories: 12 };
  
  Object.keys(targetCounts).forEach(category => {
    const currentCount = BASE_PRODUCTS.filter(p => p.category === category).length;
    const target = targetCounts[category];
    const needed = target - currentCount;
    
    for (let i = 0; i < needed; i++) {
      const name = MOCK_DATA[category].names[i] || `Mock ${category} Product ${i + 1}`;
      const image = MOCK_DATA[category].images[i] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600';
      const brand = BRANDS[i % BRANDS.length];
      const price = Math.round((1500 + (i * 1100) % 18000) / 100) * 100 + 99; // clean rupee values
      
      const ratingOptions = [4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9];
      const rating = ratingOptions[(i + category.length) % ratingOptions.length];
      const reviewCount = Math.round(15 + (i * 27) % 250);
      
      const features = [
        `High durability tactical construction`,
        `Advanced ergonomic premium finish`,
        `Waterproof protective nano-layer`,
        `Designed for maximum user comfort`
      ];

      const sizes = category === 'apparel' 
        ? ['S', 'M', 'L', 'XL'] 
        : (category === 'footwear' ? ['8', '9', '10', '11'] : ['Standard']);

      products.push({
        id: `prod_gen_${category}_${i + 1}`,
        name,
        price,
        category,
        brand,
        image,
        images: [image],
        rating,
        reviewCount,
        description: `Premium grade ${name} engineered with high-tech materials and futuristic styling. Made by ${brand} to elevate your lifestyle.`,
        features: features.slice(0, 2 + (i % 3)),
        sizes,
        colors: ['Carbon Black', 'Neon Teal', 'Cyber Slate'].slice(0, 1 + (i % 3)),
        stock: Math.round(5 + (i * 7) % 25),
        featured: false
      });
    }
  });
  
  return products;
};

const SEED_PRODUCTS = generateMockProducts();

// Seed Admin/Test User
const SEED_USER = {
  id: 'usr_1',
  email: 'test@trendbaazar.com',
  password: 'password123',
  name: 'Alex Trendsetter',
  phone: '+1 (555) 019-2834',
  address: '142 Cyberpunk Ave, Floor 12, Neo City, NC 94012',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
  addresses: [
    { id: 'addr_1', name: 'Alex Trendsetter (Home)', phone: '+1 (555) 019-2834', address: '142 Cyberpunk Ave, Floor 12, Neo City, NC 94012' },
    { id: 'addr_2', name: 'Alex Office HQ', phone: '+1 (555) 019-2834', address: '99 Tech Plaza, Suite 400, Silicon Valley, CA 94025' }
  ]
};

const SEED_ADMIN = {
  id: 'usr_admin',
  email: 'admin@trendbaazar.com',
  name: 'Admin Manager',
  phone: '9999999999',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
  address: 'TrendBaazar Admin HQ, New Delhi, 110001',
  addresses: [
    { id: 'addr_admin_1', name: 'Admin HQ', phone: '9999999999', address: 'TrendBaazar Admin HQ, New Delhi, 110001' }
  ]
};

// Initialize Local Storage helper
const initStorage = () => {
  const existingProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  if (!existingProducts || JSON.parse(existingProducts).length !== 57) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(SEED_PRODUCTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));
  }
  const users = localStorage.getItem('trendbaazar_users');
  if (!users) {
    localStorage.setItem('trendbaazar_users', JSON.stringify([SEED_USER, SEED_ADMIN]));
  } else {
    try {
      const parsed = JSON.parse(users);
      const adminIdx = parsed.findIndex(u => (u.phone || '').replace(/\D/g, '') === '9999999999');
      if (adminIdx === -1) {
        parsed.push(SEED_ADMIN);
        localStorage.setItem('trendbaazar_users', JSON.stringify(parsed));
      } else if (parsed[adminIdx].role !== 'admin') {
        // Force upgrade/overwrite user with 9999999999 to admin
        parsed[adminIdx] = { ...parsed[adminIdx], ...SEED_ADMIN };
        localStorage.setItem('trendbaazar_users', JSON.stringify(parsed));
      }
    } catch (e) {
      console.error(e);
    }
  }

  // Also clear active user session if it represents a non-admin 9999999999
  try {
    const activeSessionStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (activeSessionStr) {
      const session = JSON.parse(activeSessionStr);
      if (session && session.user && (session.user.phone || '').replace(/\D/g, '') === '9999999999' && session.user.role !== 'admin') {
        localStorage.removeItem(STORAGE_KEYS.USER); // force re-login
      }
    }
  } catch (e) {
    console.error(e);
  }
};

initStorage();

export const localProvider = {
  // --- PRODUCTS DRIVER ---
  getProducts: async (params = {}) => {
    await delay(300);
    const {
      category,
      search,
      brand,
      minRating,
      minPrice,
      maxPrice,
      sortBy,
      page = 1,
      pageSize = 12
    } = params;

    let products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS)) || [];

    // 1. Category Filter
    if (category) {
      const categoryLower = category.toLowerCase();
      products = products.filter(p => (p.category || '').toLowerCase() === categoryLower);
    }

    // 2. Search Text
    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter(p =>
        (p.name || '').toLowerCase().includes(searchLower) ||
        (p.description || '').toLowerCase().includes(searchLower) ||
        (p.brand || '').toLowerCase().includes(searchLower) ||
        (p.category || '').toLowerCase().includes(searchLower)
      );
    }

    // 3. Brand Filter
    if (brand) {
      const brandLower = brand.toLowerCase();
      products = products.filter(p => (p.brand || '').toLowerCase() === brandLower);
    }

    // 4. Rating Filter
    if (minRating !== undefined && minRating !== null) {
      products = products.filter(p => p.rating >= Number(minRating));
    }

    // 5. Price Filters
    if (minPrice !== undefined && minPrice !== null) {
      products = products.filter(p => p.price >= Number(minPrice));
    }
    if (maxPrice !== undefined && maxPrice !== null) {
      products = products.filter(p => p.price <= Number(maxPrice));
    }

    // 6. Sorting
    if (sortBy) {
      const sortLower = sortBy.toLowerCase();
      if (sortLower === 'price_asc') {
        products.sort((a, b) => a.price - b.price);
      } else if (sortLower === 'price_desc') {
        products.sort((a, b) => b.price - a.price);
      } else if (sortLower === 'rating') {
        products.sort((a, b) => b.rating - a.rating);
      } else if (sortLower === 'reviews') {
        products.sort((a, b) => b.reviewCount - a.reviewCount);
      }
    }

    const totalCount = products.length;

    // Apply Pagination
    const pageNum = Number(page);
    const pageSizeNum = Number(pageSize);
    const skip = (pageNum - 1) * pageSizeNum;
    const paginatedProducts = products.slice(skip, skip + pageSizeNum);

    const hasMore = (skip + paginatedProducts.length) < totalCount;

    return {
      products: paginatedProducts,
      totalCount,
      hasMore,
      page: pageNum,
      pageSize: pageSizeNum
    };
  },

  getCategories: async (search = '') => {
    await delay(200);
    let products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS)) || [];
    
    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter(p =>
        (p.name || '').toLowerCase().includes(searchLower) ||
        (p.description || '').toLowerCase().includes(searchLower) ||
        (p.brand || '').toLowerCase().includes(searchLower) ||
        (p.category || '').toLowerCase().includes(searchLower)
      );
    }
    
    const categoriesSet = new Set();
    products.forEach(p => {
      if (p.category) {
        categoriesSet.add(p.category.toLowerCase());
      }
    });

    return Array.from(categoriesSet).sort();
  },

  getProductById: async (id) => {
    await delay(200);
    const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS));
    return products.find(p => p.id === id) || null;
  },

  getAdminProducts: async () => {
    await delay(300);
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
  },

  // --- CART DRIVER ---
  getCart: async (userId) => {
    await delay(150);
    const key = userId ? `${STORAGE_KEYS.CART}_${userId}` : STORAGE_KEYS.CART;
    const items = localStorage.getItem(key);
    return items ? JSON.parse(items) : [];
  },

  saveCart: async (userId, items) => {
    await delay(100);
    const key = userId ? `${STORAGE_KEYS.CART}_${userId}` : STORAGE_KEYS.CART;
    localStorage.setItem(key, JSON.stringify(items));
    return items;
  },

  rateProduct: async (productId, rating) => {
    await delay(300);
    // In local mode: update the product rating in localStorage optimistically
    const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS)) || [];
    const idx = products.findIndex(p => p.id === productId);
    if (idx === -1) throw new Error('Product not found');

    const product = products[idx];
    // Simulate recalculating average (treat as new rating added)
    const oldTotal = product.rating * product.reviewCount;
    const newCount = product.reviewCount + 1;
    const newAvg = Math.round(((oldTotal + rating) / newCount) * 10) / 10;
    product.rating = newAvg;
    product.reviewCount = newCount;
    products[idx] = product;
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));

    return { productId, newAverageRating: newAvg, newReviewCount: newCount, userRating: rating };
  },

  // --- AUTH DRIVER ---
  requestOtp: async (phone) => {
    await delay(500);
    if (!phone || phone.trim().length < 8) {
      throw new Error('Please enter a valid mobile number');
    }
    const cleanInputPhone = (phone || '').replace(/\D/g, '');
    const users = JSON.parse(localStorage.getItem('trendbaazar_users') || '[]');
    const userExists = users.some(u => (u.phone || '').replace(/\D/g, '') === cleanInputPhone);

    if (!userExists) {
      return {
        success: true,
        message: 'No account found for this phone number. Please sign up first.',
        nextStep: 'signup',
        userExists: false
      };
    }

    // Simulate sending OTP. In mock mode, we assume the valid OTP is '0000'
    return { success: true, message: 'OTP sent successfully to ' + phone, nextStep: 'verify', userExists: true, otp: '0000' };
  },

  signup: async (payload) => {
    await delay(500);
    const phone = (payload?.phone || '').trim();
    const name = (payload?.name || '').trim();

    if (!phone || phone.replace(/\D/g, '').length < 8) {
      throw new Error('Please enter a valid mobile number');
    }

    if (!name) {
      throw new Error('Please enter your name');
    }

    const users = JSON.parse(localStorage.getItem('trendbaazar_users') || '[]');
    const existing = users.find(u => (u.phone || '').replace(/\D/g, '') === phone.replace(/\D/g, ''));
    if (existing) {
      throw new Error('An account already exists for this phone number. Please log in instead.');
    }

    const user = {
      id: generateId('usr'),
      name,
      phone,
      email: payload?.email || '',
      avatar: payload?.avatar || '',
      address: payload?.address || '',
      addresses: payload?.address ? [
        {
          id: generateId('addr'),
          name: name,
          phone: phone,
          address: payload.address.trim()
        }
      ] : [],
      role: phone.replace(/\D/g, '') === '9999999999' ? 'admin' : 'customer'
    };

    users.push(user);
    localStorage.setItem('trendbaazar_users', JSON.stringify(users));

    return { success: true, message: 'Account created successfully. Request OTP to continue.', user };
  },

  verifyOtp: async (phone, otp) => {
    await delay(600);
    if (otp !== '0000' && otp !== '123456') {
      throw new Error('Invalid OTP code. Please use 0000');
    }

    const cleanInputPhone = (phone || '').replace(/\D/g, '');
    const users = JSON.parse(localStorage.getItem('trendbaazar_users') || '[]');
    let user = users.find(u => (u.phone || '').replace(/\D/g, '') === cleanInputPhone);

    if (!user) {
      throw new Error('No account found for this phone number. Please sign up first.');
    }

    return { user, token: `jwt_${user.id}_session_key` };
  },

  updateProfile: async (userId, updatedData) => {
    await delay(400);
    const users = JSON.parse(localStorage.getItem('trendbaazar_users') || '[]');
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) throw new Error('User account not found');
    
    users[userIndex] = { ...users[userIndex], ...updatedData };
    localStorage.setItem('trendbaazar_users', JSON.stringify(users));

    const { password: _, ...userSafe } = users[userIndex];
    return userSafe;
  },

  // --- ORDERS DRIVER ---
  getOrders: async (userId) => {
    await delay(300);
    const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
    return orders.filter(o => o.userId === userId);
  },

  createOrder: async (orderData) => {
    await delay(600);
    const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
    
    const newOrder = {
      id: generateId('ord'),
      orderDate: new Date().toISOString(),
      status: 'Processing',
      ...orderData
    };

    orders.unshift(newOrder); // Add to beginning
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    return newOrder;
  },

  // --- ADMIN DRIVER ---
  getAdminStats: async () => {
    await delay(350);
    const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
    const users = JSON.parse(localStorage.getItem('trendbaazar_users') || '[]');
    const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');

    const activeOrders = orders.filter((o) => o.status !== 'Cancelled');
    const totalSales = activeOrders.reduce((sum, order) => sum + (order.totals?.total || 0), 0);

    return {
      totalSales,
      ordersCount: orders.length,
      usersCount: users.length,
      productsCount: products.length,
      categorySales: {},
      categoryProductCounts: {},
      latestOrders: orders.slice(0, 10)
    };
  },

  addProduct: async (productData) => {
    await delay(500);
    const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
    const newProduct = {
      id: generateId('prod'),
      rating: 5.0,
      reviewCount: 0,
      stock: 10,
      images: [productData.image],
      featured: false,
      features: ['Premium Quality fabric', 'Exclusive design edition'],
      sizes: productData.sizes || ['M', 'L', 'XL'],
      colors: productData.colors || ['Black', 'White'],
      ...productData
    };
    products.unshift(newProduct);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    return newProduct;
  },

  updateProduct: async (productId, productData) => {
    await delay(400);
    const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
    const idx = products.findIndex(p => p.id === productId);
    if (idx === -1) throw new Error('Product not found');
    products[idx] = { ...products[idx], ...productData };
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    return products[idx];
  },

  deleteProduct: async (productId) => {
    await delay(400);
    const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
    const filtered = products.filter(p => p.id !== productId);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(filtered));
    return true;
  },

  getUsers: async () => {
    await delay(300);
    return JSON.parse(localStorage.getItem('trendbaazar_users') || '[]');
  },

  getAllOrders: async () => {
    await delay(400);
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
  },

  updateOrderStatus: async (orderId, status) => {
    await delay(400);
    const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx > -1) {
      orders[idx].status = status;
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      return orders[idx];
    }
    throw new Error('Order not found');
  }
};

export default localProvider;
