/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product } from '../types';

export const mockProducts: Product[] = [
  {
    id: 'an-001',
    name: 'Gilded Noor Organza Anarkali Set',
    description: 'An ethereal blush pink Anarkali kurta crafted in premium Chanderi and Organza, featuring exquisite hand-embroidered champagne gold zari work along the yoke and border. Comes with a matching silk-blend churidar and an ultra-lightweight organza dupatta with gold scalloped detailing.',
    category: 'Pakistani Suits',
    price: 8999,
    salePrice: 7999,
    rating: 4.9,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Dusty Pink', 'Beige', 'Rose Elegance'],
    fabric: 'Chanderi Silk & Premium Organza',
    careInstructions: 'Dry clean only. Store in a muslin cloth wrapper to maintain the brilliance of gold zari threads.',
    estimatedDelivery: '3 - 5 business days',
    stock: 14,
    sku: 'AN-PK-AN-001',
    tags: ['Luxury Collection', 'Festive Collection', 'Best Sellers', 'Organza'],
    isBestSeller: true,
    reviews: [
      {
        id: 'rev-001',
        userName: 'Aanya Sharma',
        rating: 5,
        comment: 'This set is absolutely dreamlike! The hand embroidery is extremely fine, and the fabric feels like a cloud. Received endless compliments at a family wedding.',
        date: '2026-06-15T12:00:00Z',
        sentiment: 'positive'
      },
      {
        id: 'rev-002',
        userName: 'Meera Patel',
        rating: 4.8,
        comment: 'Beautiful fit. The blush pink color is very soft and looks extremely graceful in person. The gold border adds perfect luxury feel.',
        date: '2026-06-20T10:30:00Z',
        sentiment: 'positive'
      }
    ]
  },
  {
    id: 'an-002',
    name: 'Gul-Mayur Pastel Kurti Set',
    description: 'An elegant daywear ensemble in premium organic mulmul cotton, featuring soft handblock rose pink floral motifs and a delicate lace border. Pair with the included straight-cut trousers and a cotton-malmal dupatta for effortless daytime sophistication.',
    category: 'Cotton Kurti Sets',
    price: 3899,
    rating: 4.7,
    images: [
      'https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Sage', 'Laurel Green', 'Turf Green'],
    fabric: '100% Organic Malmul Cotton',
    careInstructions: 'Gentle hand wash separately in cold water using a mild eco-friendly detergent. Dry inside out in shade.',
    estimatedDelivery: '2 - 4 business days',
    stock: 25,
    sku: 'AN-KS-CT-002',
    tags: ['Summer Collection', 'New Arrivals', 'Cotton', 'Daywear'],
    isNewArrival: true,
    reviews: [
      {
        id: 'rev-003',
        userName: 'Riya Gupta',
        rating: 5,
        comment: 'Extremely soft cotton, perfect for Delhi summers. The print is very elegant and elegant, not loud. Love it!',
        date: '2026-06-22T14:15:00Z',
        sentiment: 'positive'
      }
    ]
  },
  {
    id: 'an-003',
    name: 'Zebaish Ivory Tussar Kurta Set',
    description: 'Indulge in royal sophistication with this timeless Ivory Tussar Silk Kurti Set. Adorned with delicate hand-crafted dabka embroidery on the neckline, matching pencil pants, and a tissue-silk floral print dupatta that shimmers softly under golden lights.',
    category: 'Silk Kurti Sets',
    price: 7499,
    salePrice: 6999,
    rating: 4.9,
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['M', 'L', 'XL'],
    colors: ['Beige', 'Orchid'],
    fabric: 'Tussar Silk Blend',
    careInstructions: 'Dry clean recommended. Iron on low heat on reverse side to protect the delicate hand embellishments.',
    estimatedDelivery: '3 - 5 business days',
    stock: 8,
    sku: 'AN-KS-SL-003',
    tags: ['Luxury Collection', 'Festive Collection', 'Silk', 'Limited Edition'],
    isLimitedEdition: true,
    reviews: [
      {
        id: 'rev-004',
        userName: 'Kiran Desai',
        rating: 5,
        comment: 'Incredibly premium texture! This ivory suit screams sophistication. Perfect for formal festivals and evening dinners.',
        date: '2026-06-18T09:45:00Z',
        sentiment: 'positive'
      }
    ]
  },
  {
    id: 'an-004',
    name: 'Meera Linen-Silk Co-ord Set',
    description: 'A modern silhouette for the contemporary Indian woman. This structured co-ord set features an asymmetric high-low tunic paired with premium straight trousers in a luxurious linen-silk blend. Highlighted with soft hand-guided thread work along the collar.',
    category: 'Cotton Co-ord Sets',
    price: 4499,
    rating: 4.6,
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Teal', 'Niagara'],
    fabric: 'Linen-Silk Premium Weave',
    careInstructions: 'Dry clean or gentle hand wash. Do not wring. Hang to dry in a cool place away from direct sunlight.',
    estimatedDelivery: '2 - 4 business days',
    stock: 3,
    sku: 'AN-CO-CT-004',
    tags: ['Summer Collection', 'New Arrivals', 'Modern Ethnic'],
    isNewArrival: true,
    reviews: [
      {
        id: 'rev-005',
        userName: 'Srishti R.',
        rating: 4,
        comment: 'Excellent styling. It looks very chic and minimalist. Perfect for office wear during warm months.',
        date: '2026-06-25T11:20:00Z',
        sentiment: 'neutral'
      }
    ]
  },
  {
    id: 'an-005',
    name: 'Ehsas Raw Silk Kurti Set',
    description: 'Elegance redefined in luxurious raw silk. This royal set boasts deep jewel tones with delicate dabka and cutdana floral embroidery on the cuffs and hem. Complemented by silk trousers and a lavish georgette dupatta with badla highlights.',
    category: 'Silk Kurti Sets',
    price: 9899,
    rating: 5.0,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Midnight Blue', 'Navy Blue', 'Dusty Pink'],
    fabric: 'Pure Raw Silk Weave',
    careInstructions: 'Professional dry clean only. Preserve in pH-neutral boxes to ensure raw silk longevity.',
    estimatedDelivery: '4 - 6 business days',
    stock: 5,
    sku: 'AN-KS-SL-005',
    tags: ['Luxury Collection', 'Festive Collection', 'Best Sellers', 'Raw Silk'],
    isBestSeller: true,
    reviews: [
      {
        id: 'rev-006',
        userName: 'Neha S.',
        rating: 5,
        comment: 'This raw silk is simply majestic. The feel of the garment is incredibly premium and heavy. A pure masterpiece by ANANTAMAA.',
        date: '2026-06-11T16:50:00Z',
        sentiment: 'positive'
      }
    ]
  },
  {
    id: 'an-006',
    name: 'Nilofer Chikankari Pakistani Suit',
    description: 'Inspired by the royal heritage of Awadh and modified for modern sensibilities. This Pakistani-style straight kurta is crafted in finest georgette with intricate ivory Lucknowi Chikankari shadow work. Set off by loose palazzo pants and a sheer chiffon dupatta.',
    category: 'Pakistani Suits',
    price: 7999,
    salePrice: 6499,
    rating: 4.8,
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Orchid', 'Rose Elegance'],
    fabric: 'Fine Georgette with Cotton Embroidery Threads',
    careInstructions: 'Dry clean only. Do not iron directly; use a protective steam cover.',
    estimatedDelivery: '3 - 5 business days',
    stock: 10,
    sku: 'AN-PK-CK-006',
    tags: ['Luxury Collection', 'Pakistani Cut', 'Chikankari'],
    reviews: [
      {
        id: 'rev-007',
        userName: 'Anjali V.',
        rating: 4.6,
        comment: 'The Chikankari work is extremely neat. It has very subtle glass bead embellishments that catch the light beautifully.',
        date: '2026-06-20T08:12:00Z',
        sentiment: 'positive'
      }
    ]
  },
  {
    id: 'an-007',
    name: 'Safa Silk-Crepe Co-ord Set',
    description: 'A timeless fluid co-ord set designed to transition seamlessly from morning corporate meetings to evening celebratory dinners. Comprising a relaxed button-front tunic with delicate pearl button detail and wide-leg trousers that drape in golden waves.',
    category: 'Silk Co-ord Sets',
    price: 5299,
    rating: 4.5,
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Niagara', 'Teal', 'Beige'],
    fabric: 'Premium Silk-Crepe Blend',
    careInstructions: 'Dry clean recommended. Gentle hand wash with soft woollens wash. Dry flat.',
    estimatedDelivery: '2 - 4 business days',
    stock: 12,
    sku: 'AN-CO-SL-007',
    tags: ['New Arrivals', 'Modern Ethnic', 'Silk'],
    isNewArrival: true,
    reviews: [
      {
        id: 'rev-008',
        userName: 'Tanya Malhotra',
        rating: 5,
        comment: 'Excellent drape. The fabric has a natural understated luxury shine which looks so chic and classy.',
        date: '2026-06-26T15:30:00Z',
        sentiment: 'positive'
      }
    ]
  },
  {
    id: 'an-008',
    name: 'Malmal Sunehri Festive Suit',
    description: 'Bring a radiant glow to festive evenings in this exquisite golden ivory cotton-mulmul suit. Accented with detailed handblock gold-foil prints, sequined neckline borders, matching palazzo pants, and a stunning crushed cotton golden-weave dupatta.',
    category: 'Cotton Kurti Sets',
    price: 4799,
    rating: 4.9,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Turf Green', 'Laurel Green', 'Midnight Blue'],
    fabric: 'Fine Pure Cotton Mulmul',
    careInstructions: 'Dry clean only to maintain gold-foil sparkle. Wrap in soft paper to avoid print friction.',
    estimatedDelivery: '3 - 5 business days',
    stock: 2,
    sku: 'AN-KS-CT-008',
    tags: ['Festive Collection', 'Cotton', 'Limited Edition'],
    isLimitedEdition: true,
    reviews: [
      {
        id: 'rev-009',
        userName: 'Savitri Singh',
        rating: 5,
        comment: 'This is the most comfortable festive wear I own! The mulmul is of premium quality, and the gold print is beautiful.',
        date: '2026-06-19T13:40:00Z',
        sentiment: 'positive'
      }
    ]
  }
];
