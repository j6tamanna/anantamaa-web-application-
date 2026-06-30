/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, Star, CheckCircle, ShieldCheck, HelpCircle, ArrowRight, BookOpen, AlertCircle, RefreshCw, Send, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product, CartItem, Order, Address, Coupon, Review } from './types';
import { mockProducts } from './data/mockProducts';

// Import our custom components
import Header from './components/Header';
import Footer from './components/Footer';
import AIStylist from './components/AIStylist';
import ProductCard from './components/ProductCard';
import SizeGuide from './components/SizeGuide';
import UserDashboard from './components/UserDashboard';
import AdminPanel from './components/AdminPanel';

export default function App() {
  // 1. Core State Hooks
  const [products, setProducts] = useState<Product[]>(() => {
    const cached = localStorage.getItem('anantamaa_products');
    return cached ? JSON.parse(cached) : mockProducts;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const cached = localStorage.getItem('anantamaa_cart');
    return cached ? JSON.parse(cached) : [];
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const cached = localStorage.getItem('anantamaa_wishlist');
    return cached ? JSON.parse(cached) : [];
  });

  // Pre-seed some orders to make the admin panel and dashboard look highly professional on launch!
  const [orders, setOrders] = useState<Order[]>(() => {
    const cached = localStorage.getItem('anantamaa_orders');
    if (cached) return JSON.parse(cached);

    const defaultAddress: Address = {
      name: 'Jaina Aadita',
      line1: 'Atelier Colaba, Colaba Causeway',
      line2: 'Near Regal Cinema',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400005',
      country: 'India',
      phone: '+91 98765 43210',
    };

    const initialOrders: Order[] = [
      {
        id: '100293',
        date: '2026-06-12T14:30:00Z',
        customerName: 'Jaina Aadita',
        customerEmail: 'jainaadiitamanna@gmail.com',
        items: [
          {
            id: 'an-001-S-Dusty Pink',
            product: mockProducts[0], // Gilded Noor Organza Anarkali Set
            selectedSize: 'S',
            selectedColor: 'Dusty Pink',
            quantity: 1,
          },
        ],
        subtotal: 8999,
        discount: 1000,
        total: 7999,
        shippingAddress: defaultAddress,
        status: 'Delivered',
        paymentMethod: 'Card',
        paymentStatus: 'Paid',
        trackingNumber: 'AN-BD-9827361',
      },
      {
        id: '100294',
        date: '2026-06-25T11:15:00Z',
        customerName: 'Jaina Aadita',
        customerEmail: 'jainaadiitamanna@gmail.com',
        items: [
          {
            id: 'an-002-M-Sage',
            product: mockProducts[1], // Gul-Mayur Pastel Kurti Set
            selectedSize: 'M',
            selectedColor: 'Sage',
            quantity: 1,
          },
        ],
        subtotal: 3899,
        discount: 0,
        total: 3899,
        shippingAddress: defaultAddress,
        status: 'Processing',
        paymentMethod: 'UPI',
        paymentStatus: 'Paid',
        trackingNumber: 'AN-BD-9827362',
      },
    ];

    return initialOrders;
  });

  const [addresses, setAddresses] = useState<Address[]>(() => {
    const cached = localStorage.getItem('anantamaa_addresses');
    if (cached) return JSON.parse(cached);

    return [
      {
        name: 'Jaina Aadita',
        line1: 'Atelier Colaba, Colaba Causeway',
        line2: 'Near Regal Cinema',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400005',
        country: 'India',
        phone: '+91 98765 43210',
      },
    ];
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const cached = localStorage.getItem('anantamaa_coupons');
    if (cached) return JSON.parse(cached);

    return [
      { code: 'ANANTAMAA10', discountType: 'percent', value: 10, minOrderValue: 2000, active: true },
      { code: 'NOOR500', discountType: 'fixed', value: 500, minOrderValue: 4000, active: true },
      { code: 'DIWALI20', discountType: 'percent', value: 20, minOrderValue: 5000, active: true },
    ];
  });

  // Navigation and views
  const [currentView, setCurrentView] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);

  // Auto-play the animated hero campaign slides every 7 seconds
  useEffect(() => {
    if (currentView !== 'home') return;
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % 3);
    }, 7000);
    return () => clearInterval(timer);
  }, [currentView]);

  // Shop filter and search states
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sizeFilter, setSizeFilter] = useState('');
  const [colorFilter, setColorFilter] = useState('');
  const [fabricFilter, setFabricFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [sortOption, setSortOption] = useState('best');

  // Checkout states
  const [promoInput, setPromoInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<'shipping' | 'payment'>('shipping');
  const [checkoutAddress, setCheckoutAddress] = useState<Address>(() => addresses[0] || {
    name: 'Jaina Aadita',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'COD'>('UPI');
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [latestOrder, setLatestOrder] = useState<Order | null>(null);

  // Pincode checker state
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<'idle' | 'checking' | 'serviceable' | 'unserviceable'>('idle');

  // Product reviews summary AI state
  const [reviewsSummary, setReviewsSummary] = useState('');
  const [isSummarizingReviews, setIsSummarizingReviews] = useState(false);

  // Write review form states
  const [newReviewName, setNewReviewName] = useState('Jaina Aadita');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');

  // 2. Local Storage Syncing effects
  useEffect(() => {
    localStorage.setItem('anantamaa_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('anantamaa_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('anantamaa_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('anantamaa_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('anantamaa_addresses', JSON.stringify(addresses));
  }, [addresses]);

  useEffect(() => {
    localStorage.setItem('anantamaa_coupons', JSON.stringify(coupons));
  }, [coupons]);

  // Support direct route triggers from search suggestions and category filters
  const setView = (viewPath: string) => {
    if (viewPath.startsWith('shop')) {
      const urlParams = new URLSearchParams(viewPath.split('?')[1] || '');
      const search = urlParams.get('search');
      const category = urlParams.get('category');
      const tag = urlParams.get('tag');

      if (search) setSearchQuery(decodeURIComponent(search));
      if (category) setCategoryFilter(decodeURIComponent(category));
      if (tag) {
        if (tag === 'Luxury Collection') setPriceFilter('above_5000');
        if (tag === 'Summer Collection') setFabricFilter('100% Organic Malmul Cotton');
      }
      setCurrentView('shop');
    } else {
      setCurrentView(viewPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (prod: Product) => {
    setSelectedProduct(prod);
    setReviewsSummary('');
    setCurrentView('product-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 3. Cart & Wishlist Operations
  const toggleWishlist = (prod: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === prod.id);
      if (exists) {
        return prev.filter((item) => item.id !== prod.id);
      } else {
        return [...prev, prod];
      }
    });
  };

  const addToCart = (product: Product, size: string, color: string) => {
    const id = `${product.id}-${size}-${color}`;
    setCart((prev) => {
      const existing = prev.find((item) => item.id === id);
      if (existing) {
        return prev.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prev, { id, product, selectedSize: size, selectedColor: color, quantity: 1 }];
      }
    });
    alert(`Successfully added 1x ${product.name} (Size: ${size}, Color: ${color}) to your Shopping Bag!`);
  };

  const updateCartQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // Calculate Subtotal and Coupon Deductions
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.product.salePrice || item.product.price) * item.quantity, 0);
  
  const getCouponDiscount = () => {
    if (!appliedCoupon || cartSubtotal < appliedCoupon.minOrderValue) return 0;
    if (appliedCoupon.discountType === 'percent') {
      return Math.round((cartSubtotal * appliedCoupon.value) / 100);
    } else {
      return appliedCoupon.value;
    }
  };
  const couponDiscount = getCouponDiscount();
  const cartTotal = Math.max(0, cartSubtotal - couponDiscount);

  const applyPromoCode = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = promoInput.trim().toUpperCase();
    const found = coupons.find((c) => c.code === cleanCode && c.active);

    if (found) {
      if (cartSubtotal >= found.minOrderValue) {
        setAppliedCoupon(found);
        alert(`Success! Coupon "${found.code}" applied.`);
      } else {
        alert(`This coupon requires a minimum purchase value of ₹${found.minOrderValue.toLocaleString()}`);
      }
    } else {
      alert('Invalid or expired promotional code.');
    }
    setPromoInput('');
  };

  // 4. Product CRUD (From Admin Panel)
  const handleAddProduct = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
  };

  const handleEditProduct = (editedProd: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === editedProd.id ? editedProd : p)));
    if (selectedProduct?.id === editedProd.id) {
      setSelectedProduct(editedProd);
    }
  };

  const handleDeleteProduct = (prodId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== prodId));
  };

  // Order Fulfillment Operations
  const handleUpdateOrderStatus = (orderId: string, status: Order['status'], payStatus?: Order['paymentStatus']) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status,
            paymentStatus: payStatus || (status === 'Returned' ? 'Refunded' : o.paymentStatus),
          };
        }
        return o;
      })
    );
  };

  const handleAddCoupon = (newC: Coupon) => {
    setCoupons((prev) => [newC, ...prev]);
  };

  const handleToggleCoupon = (code: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.code === code ? { ...c, active: !c.active } : c))
    );
  };

  const handleAddAddress = (newA: Address) => {
    setAddresses((prev) => [newA, ...prev]);
  };

  // 5. Checkout & Place Order
  const handlePlaceOrder = async () => {
    if (!checkoutAddress.name || !checkoutAddress.line1 || !checkoutAddress.city || !checkoutAddress.postalCode) {
      alert('Please fill out all required shipping address elements.');
      return;
    }

    setIsProcessingOrder(true);

    // Simulate luxury security processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const newOrder: Order = {
      id: Math.floor(100000 + Math.random() * 900000).toString(),
      date: new Date().toISOString(),
      customerName: checkoutAddress.name,
      customerEmail: 'jainaadiitamanna@gmail.com',
      items: [...cart],
      subtotal: cartSubtotal,
      discount: couponDiscount,
      total: cartTotal,
      shippingAddress: checkoutAddress,
      status: 'Pending',
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'Unpaid' : 'Paid',
      trackingNumber: `AN-BD-${Math.floor(9000000 + Math.random() * 1000000)}`,
      couponCode: appliedCoupon?.code,
    };

    // Update product stock inventory
    setProducts((prev) =>
      prev.map((prod) => {
        const orderItem = cart.find((item) => item.product.id === prod.id);
        if (orderItem) {
          return { ...prod, stock: Math.max(0, prod.stock - orderItem.quantity) };
        }
        return prod;
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    setLatestOrder(newOrder);
    setCart([]);
    setAppliedCoupon(null);
    setIsProcessingOrder(false);
    setCurrentView('order-success');
  };

  // 6. AI Pincode checking simulation
  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode.trim() || pincode.trim().length !== 6) {
      alert('Please enter a valid 6-digit Indian PIN code.');
      return;
    }
    setPincodeStatus('checking');
    setTimeout(() => {
      // Direct serviceable regions simulation
      const code = Number(pincode.trim());
      if (code >= 100000 && code <= 899999) {
        setPincodeStatus('serviceable');
      } else {
        setPincodeStatus('unserviceable');
      }
    }, 1200);
  };

  // 7. AI Reviews Summarizer call
  const handleSummarizeReviews = async (product: Product) => {
    setIsSummarizingReviews(true);
    try {
      const response = await fetch('/api/review-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: product.name,
          reviews: product.reviews,
        }),
      });

      if (!response.ok) throw new Error('Unpacking fabrics...');
      const data = await response.json();
      setReviewsSummary(data.summary);
    } catch (err) {
      console.error(err);
      // Fallback
      setReviewsSummary(`**[Summary for ${product.name}]**\n• **Fabric & Touch**: Crafted with extremely high-grade yarns which feel exceptionally breathable and smooth.\n• **Fit & Sizing**: Runs true to standard Indian sizing maps, with soft draping borders.\n• **Perfect Occasion**: Exquisite for daytime festive gatherings or luxury summer parties.`);
    } finally {
      setIsSummarizingReviews(false);
    }
  };

  // Submit product customer review
  const handleReviewSubmit = (e: React.FormEvent, product: Product) => {
    e.preventDefault();
    if (!newReviewComment.trim()) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      userName: newReviewName || 'Anonymous Buyer',
      rating: newReviewRating,
      comment: newReviewComment.trim(),
      date: new Date().toISOString(),
      sentiment: newReviewRating >= 4 ? 'positive' : newReviewRating === 3 ? 'neutral' : 'negative',
    };

    const updatedReviews = [newRev, ...product.reviews];
    // Recompute product average rating
    const avgRating = Number((updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length).toFixed(1));

    const updatedProduct = {
      ...product,
      reviews: updatedReviews,
      rating: avgRating,
    };

    setProducts((prev) => prev.map((p) => (p.id === product.id ? updatedProduct : p)));
    setSelectedProduct(updatedProduct);
    setNewReviewComment('');
    alert('Thank you! Your feedback has been uploaded and routed for verification.');
  };

  // 8. Catalog Filtering Engine
  const filteredProducts = products.filter((p) => {
    // Search query matching
    const matchesSearch = searchQuery.trim()
      ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.fabric.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    // Categories filter
    const matchesCategory = categoryFilter ? p.category === categoryFilter : true;

    // Size filter
    const matchesSize = sizeFilter ? p.sizes.includes(sizeFilter) : true;

    // Colors filter
    const matchesColor = colorFilter ? p.colors.includes(colorFilter) : true;

    // Fabrics filter
    const matchesFabric = fabricFilter ? p.fabric.toLowerCase().includes(fabricFilter.toLowerCase()) : true;

    // Price tier filter
    const matchesPrice =
      priceFilter === 'under_5000'
        ? p.price < 5000
        : priceFilter === 'above_5000'
        ? p.price >= 5000
        : true;

    return matchesSearch && matchesCategory && matchesSize && matchesColor && matchesFabric && matchesPrice;
  }).sort((a, b) => {
    if (sortOption === 'price_low') return a.price - b.price;
    if (sortOption === 'price_high') return b.price - a.price;
    if (sortOption === 'rating') return b.rating - a.rating;
    return 0; // Default sorted sequence
  });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-frosted font-sans antialiased" id="anantamaa-root">
      
      {/* Dynamic Header */}
      <Header
        currentView={currentView}
        setView={setView}
        cart={cart}
        wishlist={wishlist}
        products={products}
        onSelectProduct={handleSelectProduct}
      />

      {/* Main viewport */}
      <main className="flex-grow">
        
        {/* VIEW 1: HOMEPAGE SCREEN */}
        {currentView === 'home' && (
          <div className="space-y-16 animate-fadeIn" id="homepage-screen">
            
            {/* Elegant Animated Hero Banner (Nicobar, Mulmul, & TrueBrowns Inspired) */}
            <div className="relative h-[85vh] sm:h-[90vh] bg-brand-cream flex items-center overflow-hidden" id="homepage-hero">
              {/* Campaign Slides */}
              {[
                {
                  subtitle: 'Nicobar Inspired • Modern Organic',
                  title: 'Serene Silks &\nBreezy Cottons',
                  desc: 'Relaxed silhouettes, earthy shades, and mindful hand-spun fabrics designed for tropical ease and modern understated luxury.',
                  img: 'https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&w=1600&q=80',
                  tag: 'Minimalist Edit',
                  linkText: 'Explore Breezy Linens'
                },
                {
                  subtitle: 'Mulmul Inspired • Dreamy Pastel',
                  title: 'Romantic Ivory &\nBlushing Florals',
                  desc: 'Ethereal handcrafted cottons featuring delicate scalloped borders, soft hand-painted block prints, and sheer luxurious organza dupattas.',
                  img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1600&q=80',
                  tag: 'Festive Dream',
                  linkText: 'Discover Pastels'
                },
                {
                  subtitle: 'TrueBrowns Inspired • Royal Heritage',
                  title: 'Regal Jewel Tones &\nRich Raw Silks',
                  desc: 'Impeccable structural kurtis, modern-cut co-ord suits, and subtle golden highlights that blend ancestral Indian heritage with a sharp contemporary edge.',
                  img: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1600&q=80',
                  tag: 'Heritage Luxe',
                  linkText: 'Shop Royal Richness'
                }
              ].map((slide, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 z-0 transition-all duration-1000 ease-in-out flex items-center ${
                    heroIndex === idx
                      ? 'opacity-100 scale-100 pointer-events-auto'
                      : 'opacity-0 scale-105 pointer-events-none'
                  }`}
                >
                  <div className="absolute inset-0">
                    <img
                      src={slide.img}
                      alt={slide.title}
                      className="w-full h-full object-cover opacity-85 transition-transform duration-[7000ms] ease-out scale-100 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-ivory/95 via-brand-ivory/60 to-transparent md:bg-gradient-to-r md:from-brand-ivory/95 md:via-brand-ivory/45 md:to-transparent" />
                  </div>

                  {/* Slide Content */}
                  <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 w-full md:w-3/5 lg:w-1/2 space-y-6 text-left">
                    <span className="text-[10px] tracking-[0.4em] text-brand-dusty uppercase font-mono font-bold block animate-fadeIn" style={{ animationDelay: '100ms' }}>
                      {slide.subtitle}
                    </span>
                    <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-brand-charcoal leading-tight font-light whitespace-pre-line animate-fadeIn" style={{ animationDelay: '300ms' }}>
                      {slide.title.split('\n')[0]} <br />
                      <span className="font-semibold italic text-brand-dusty">{slide.title.split('\n')[1]}</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-brand-taupe leading-relaxed max-w-md font-light animate-fadeIn" style={{ animationDelay: '500ms' }}>
                      {slide.desc}
                    </p>
                    <div className="pt-4 animate-fadeIn" style={{ animationDelay: '700ms' }}>
                      <button
                        onClick={() => {
                          if (idx === 0) {
                            setFabricFilter('100% Organic Malmul Cotton');
                          } else if (idx === 1) {
                            setCategoryFilter('Pakistani Suits');
                          } else {
                            setCategoryFilter('Silk Kurti Sets');
                          }
                          setView('shop');
                        }}
                        className="bg-brand-charcoal hover:bg-brand-dusty hover:text-white text-white text-[10px] sm:text-xs tracking-[0.25em] font-sans uppercase font-semibold px-8 py-4 sm:py-4.5 rounded-full transition-luxury shadow-lg hover:shadow-xl hover:-translate-y-0.5 duration-500"
                      >
                        {slide.linkText}
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Manual Arrow Controls */}
              <button
                onClick={() => setHeroIndex((prev) => (prev - 1 + 3) % 3)}
                className="absolute left-4 z-20 w-10 h-10 rounded-full border border-brand-charcoal/10 bg-white/40 backdrop-blur-md flex items-center justify-center text-brand-charcoal hover:bg-white hover:text-brand-dusty transition-luxury"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setHeroIndex((prev) => (prev + 1) % 3)}
                className="absolute right-4 z-20 w-10 h-10 rounded-full border border-brand-charcoal/10 bg-white/40 backdrop-blur-md flex items-center justify-center text-brand-charcoal hover:bg-white hover:text-brand-dusty transition-luxury"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Slider Dots/Pagination */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2.5">
                {[0, 1, 2].map((slideIdx) => (
                  <button
                    key={slideIdx}
                    onClick={() => setHeroIndex(slideIdx)}
                    className={`h-2 rounded-full transition-all duration-500 ${
                      heroIndex === slideIdx
                        ? 'w-6 bg-brand-dusty'
                        : 'w-2 bg-brand-charcoal/20 hover:bg-brand-charcoal/40'
                    }`}
                    aria-label={`Go to slide ${slideIdx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Animated Infinite Marquee Scrolling Value Ticker */}
            <div className="bg-brand-charcoal text-white py-3 border-y border-white/5 overflow-hidden relative shadow-sm" id="infinite-marquee-banner">
              <div className="animate-marquee whitespace-nowrap flex items-center space-x-12 text-[10px] font-mono tracking-[0.3em] uppercase">
                {[...Array(2)].map((_, groupIdx) => (
                  <div key={groupIdx} className="flex items-center space-x-12 shrink-0">
                    <span>✦ 100% Organic Malmul Cotton</span>
                    <span className="text-brand-dusty">✦</span>
                    <span>Hand-loomed by master artisans</span>
                    <span className="text-brand-dusty">✦</span>
                    <span>Complimentary Express Worldwide Shipping</span>
                    <span className="text-brand-dusty">✦</span>
                    <span>Sustainable Heritage Weaving</span>
                    <span className="text-brand-dusty">✦</span>
                    <span>As Seen In Vogue Atelier</span>
                    <span className="text-brand-dusty">✦</span>
                    <span>Zero-Waste Handcrafted Luxury</span>
                    <span className="text-brand-dusty">✦</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shop By Category Bento Grid */}
            <div className="max-w-7xl mx-auto px-6 sm:px-12 space-y-8" id="category-section">
              <div className="text-center space-y-2">
                <h2 className="font-serif text-3xl text-brand-charcoal font-medium tracking-tight">Shop By Category</h2>
                <p className="text-xs text-brand-taupe uppercase tracking-widest font-mono">Curated selections for every occasion</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="category-bento-grid">
                {[
                  {
                    name: 'Pakistani Suits',
                    img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80',
                    query: 'Pakistani Suits'
                  },
                  {
                    name: 'Kurti Sets',
                    img: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&q=80',
                    query: 'Kurti Sets'
                  },
                  {
                    name: 'Co-ord Sets',
                    img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=400&q=80',
                    query: 'Co-ord Sets'
                  },
                  {
                    name: 'Luxury Collection',
                    img: 'https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&w=400&q=80',
                    query: 'Silk Kurti Sets'
                  }
                ].map((cat, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setCategoryFilter(cat.query);
                      setView('shop');
                    }}
                    className="group relative h-96 rounded-luxury overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-luxury duration-500 border border-white/20 glass-panel"
                  >
                    <img
                      src={cat.img}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/80 via-transparent to-transparent" />
                    <div className="absolute bottom-6 inset-x-6 flex justify-between items-center text-white">
                      <div>
                        <h4 className="font-serif text-lg font-semibold tracking-wide">{cat.name}</h4>
                        <span className="text-[10px] uppercase tracking-widest font-mono text-white/75">Shop Now</span>
                      </div>
                      <span className="w-8 h-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center group-hover:bg-brand-dusty transition-colors duration-300">
                        <ArrowRight className="w-4 h-4 text-white" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Editorial Showcase Column: Best Sellers */}
            <div className="max-w-7xl mx-auto px-6 sm:px-12 space-y-8" id="featured-section">
              <div className="flex flex-col sm:flex-row justify-between items-end border-b border-white/10 pb-4">
                <div className="space-y-1">
                  <span className="text-[10px] tracking-widest text-brand-dusty uppercase font-mono font-semibold">Curated Pieces</span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-brand-charcoal">Bestsellers of the Season</h2>
                </div>
                <button onClick={() => { setCategoryFilter(''); setView('shop'); }} className="text-xs text-brand-dusty hover:text-brand-taupe font-sans font-semibold tracking-widest uppercase mt-2 sm:mt-0 flex items-center space-x-1.5 transition-colors">
                  <span>View All Masterpieces</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Product grid displaying bestseller items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="bestseller-grid">
                {products.slice(0, 4).map((p) => (
                  <ProductCard
                     key={p.id}
                     product={p}
                     onSelect={handleSelectProduct}
                     wishlist={wishlist}
                     toggleWishlist={toggleWishlist}
                     addToCart={addToCart}
                  />
                ))}
              </div>
            </div>

            {/* Elegant Double Lookbook Banner (TrueBrowns, Nicobar & Mulmul Inspired Layouts) */}
            <div className="max-w-7xl mx-auto px-6 sm:px-12 py-6 grid grid-cols-1 md:grid-cols-2 gap-8" id="lookbook-banners-grid">
              {/* Campaign Banner 1: Breezy Ivory Edit */}
              <div
                onClick={() => {
                  setFabricFilter('100% Organic Malmul Cotton');
                  setCategoryFilter('Co-ord Sets');
                  setView('shop');
                }}
                className="group relative h-[420px] sm:h-[480px] rounded-luxury overflow-hidden cursor-pointer shadow-xl border border-white/20 glass-panel"
              >
                <img
                  src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"
                  alt="Breezy Ivory Edit"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[4000ms] ease-out opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/90 via-brand-charcoal/25 to-transparent" />
                
                {/* Thin elegant border overlay that tightens on hover */}
                <div className="absolute inset-4 border border-white/10 group-hover:border-white/30 rounded-luxury transition-luxury duration-700 pointer-events-none" />
                
                <div className="absolute bottom-8 left-8 right-8 space-y-2 text-white">
                  <span className="text-[9px] tracking-[0.3em] text-brand-rose uppercase font-mono font-bold block">
                    Mulmul & Nicobar Silhouettes
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-light tracking-wide leading-tight">
                    The Breezy <br />
                    <span className="font-semibold italic text-brand-rose">Ivory & Pastel Edit</span>
                  </h3>
                  <p className="text-[11px] text-slate-200 font-light max-w-sm leading-relaxed">
                    Whisper-light layers, scalloped hems, and pure organic block-printed styles designed for high-summer celebration and relaxed ease.
                  </p>
                  <div className="pt-2 flex items-center space-x-2 text-[10px] tracking-[0.2em] uppercase font-semibold text-brand-rose group-hover:text-white transition-colors duration-300">
                    <span className="cosmetic-underline">Explore The Meadow</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>

              {/* Campaign Banner 2: Royal Festive / TrueBrowns */}
              <div
                onClick={() => {
                  setCategoryFilter('Silk Kurti Sets');
                  setView('shop');
                }}
                className="group relative h-[420px] sm:h-[480px] rounded-luxury overflow-hidden cursor-pointer shadow-xl border border-white/20 glass-panel"
              >
                <img
                  src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80"
                  alt="Royal Festive Luxe"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[4000ms] ease-out opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/90 via-brand-charcoal/25 to-transparent" />
                
                {/* Thin elegant border overlay that tightens on hover */}
                <div className="absolute inset-4 border border-white/10 group-hover:border-white/30 rounded-luxury transition-luxury duration-700 pointer-events-none" />
                
                <div className="absolute bottom-8 left-8 right-8 space-y-2 text-white">
                  <span className="text-[9px] tracking-[0.3em] text-brand-dusty uppercase font-mono font-bold block">
                    TrueBrowns Festive Vibes
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-light tracking-wide leading-tight">
                    The Silk Chanderi <br />
                    <span className="font-semibold italic text-brand-dusty">Regal Heritage Series</span>
                  </h3>
                  <p className="text-[11px] text-slate-200 font-light max-w-sm leading-relaxed">
                    Sleek contemporary contours, deep royal pigments, and rich handloom textures that speak of timeless ancestral grace.
                  </p>
                  <div className="pt-2 flex items-center space-x-2 text-[10px] tracking-[0.2em] uppercase font-semibold text-brand-dusty group-hover:text-white transition-colors duration-300">
                    <span className="cosmetic-underline">Discover Heirloom Luxe</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>

            {/* Brand Story Section with elegant cosmetic-border-double */}
            <div className="glass-panel backdrop-blur-md py-20 border-y border-white/25 shadow-inner" id="homepage-story-section">
              <div className="max-w-6xl mx-auto px-6 sm:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6" id="story-text-container">
                  <span className="text-[10px] tracking-[0.3em] text-brand-dusty uppercase font-mono font-bold block">
                    Our Philosophy
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl text-brand-charcoal font-medium leading-tight">
                    Timeless Heritage, Handcrafted with <span className="font-serif italic text-brand-dusty">Gentle Softness</span>
                  </h2>
                  <p className="text-xs text-brand-taupe leading-relaxed font-light">
                    Every thread at ANANTAMAA tells a story of dedicated craftsmanship. We collaborate directly with master weavers across Chanderi, Lucknow, and Varanasi to build authentic handlooms infused with contemporary, comfort-focused silhouettes.
                  </p>
                  <p className="text-xs text-brand-taupe leading-relaxed font-light">
                    We believe true luxury lies in comfort. Our signature organic cotton fabrics are finished with special pre-wash processes so they feel incredibly lightweight, breathable, and exceptionally soft against the skin from your very first wear.
                  </p>
                  <div className="pt-2">
                    <button onClick={() => setView('about')} className="text-xs text-brand-dusty hover:text-brand-taupe font-sans font-semibold tracking-widest uppercase flex items-center space-x-2 transition-colors">
                      <BookOpen className="w-4 h-4" />
                      <span>Explore Our Heritage Story</span>
                    </button>
                  </div>
                </div>

                <div className="relative aspect-[4/3] rounded-luxury overflow-hidden shadow-2xl p-2 bg-white/20 border border-white/20" id="story-image-container">
                  <div className="w-full h-full rounded-luxury overflow-hidden cosmetic-border-double p-1">
                    <img
                      src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"
                      alt="Atelier Craftsmen Handloom"
                      className="w-full h-full object-cover rounded-luxury"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* VIEW 2: SHOP CATALOG CATALOG */}
        {currentView === 'shop' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 animate-fadeIn" id="shop-catalog-screen">
            <div className="border-b border-white/10 pb-4 mb-8">
              <h2 className="font-serif text-3xl font-bold text-brand-charcoal">The Boutique</h2>
              <p className="text-xs text-brand-taupe font-mono mt-1">Showing {filteredProducts.length} authentic pieces</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8" id="catalog-grid">
              
              {/* Left Column Filters */}
              <div className="lg:col-span-1 glass-panel backdrop-blur-md p-5 rounded-3xl border border-white/20 h-fit space-y-6 shadow-md" id="catalog-filters-sidebar">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <h4 className="font-serif text-sm font-semibold text-brand-charcoal">Filter Boutique</h4>
                  {(categoryFilter || sizeFilter || colorFilter || fabricFilter || priceFilter || searchQuery) && (
                    <button
                      onClick={() => {
                        setCategoryFilter('');
                        setSizeFilter('');
                        setColorFilter('');
                        setFabricFilter('');
                        setPriceFilter('');
                        setSearchQuery('');
                      }}
                      className="text-[10px] text-brand-dusty hover:underline font-mono uppercase"
                    >
                      Reset All
                    </button>
                  )}
                </div>

                {/* Categories */}
                <div className="space-y-2">
                  <span className="text-[10px] tracking-widest text-brand-taupe uppercase font-semibold block">Category</span>
                  <div className="flex flex-col space-y-1.5 text-xs text-brand-charcoal">
                    {['', 'Pakistani Suits', 'Cotton Kurti Sets', 'Silk Kurti Sets', 'Cotton Co-ord Sets', 'Silk Co-ord Sets'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCategoryFilter(cat)}
                        className={`text-left py-1 hover:text-brand-dusty transition-luxury ${
                          categoryFilter === cat ? 'text-brand-dusty font-bold' : ''
                        }`}
                      >
                        {cat || 'All Categories'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sizing Filter */}
                <div className="space-y-2 border-t border-white/10 pt-4">
                  <span className="text-[10px] tracking-widest text-brand-taupe uppercase font-semibold block">Size</span>
                  <div className="flex flex-wrap gap-1.5">
                    {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSizeFilter(sizeFilter === sz ? '' : sz)}
                        className={`w-8 h-8 rounded-lg text-xs font-mono transition-luxury border ${
                          sizeFilter === sz
                            ? 'bg-brand-dusty border-brand-dusty text-white font-bold'
                            : 'border-white/10 bg-white/40 text-brand-charcoal hover:bg-brand-rose/20'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Colors Filter */}
                <div className="space-y-2 border-t border-white/10 pt-4">
                  <span className="text-[10px] tracking-widest text-brand-taupe uppercase font-semibold block">Apparel Color</span>
                  <div className="flex flex-wrap gap-1.5">
                    {['Teal', 'Navy Blue', 'Dusty Pink', 'Orchid', 'Beige', 'Midnight Blue', 'Niagara', 'Rose Elegance', 'Sage', 'Turf Green', 'Laurel Green'].map((col) => (
                      <button
                        key={col}
                        onClick={() => setColorFilter(colorFilter === col ? '' : col)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-sans border transition-luxury ${
                          colorFilter === col
                            ? 'bg-brand-dusty border-brand-dusty text-white font-semibold'
                            : 'border-white/10 bg-white/40 text-brand-taupe hover:bg-brand-rose/20'
                        }`}
                      >
                        {col}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fabric Weave Filter */}
                <div className="space-y-2 border-t border-white/10 pt-4">
                  <span className="text-[10px] tracking-widest text-brand-taupe uppercase font-semibold block">Weave Fabric</span>
                  <div className="flex flex-col space-y-1.5 text-xs text-brand-charcoal">
                    {['', 'Cotton', 'Silk', 'Organza', 'Linen'].map((fab) => (
                      <button
                        key={fab}
                        onClick={() => setFabricFilter(fab)}
                        className={`text-left py-1 hover:text-brand-dusty transition-colors ${
                          fabricFilter === fab ? 'text-brand-dusty font-bold' : ''
                        }`}
                      >
                        {fab || 'All Weaves'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price range filter */}
                <div className="space-y-2 border-t border-white/10 pt-4">
                  <span className="text-[10px] tracking-widest text-brand-taupe uppercase font-semibold block">Price Tier</span>
                  <div className="flex flex-col space-y-1.5 text-xs text-brand-charcoal">
                    <button
                      onClick={() => setPriceFilter(priceFilter === 'under_5000' ? '' : 'under_5000')}
                      className={`text-left py-1 hover:text-brand-dusty transition-colors ${
                        priceFilter === 'under_5000' ? 'text-brand-dusty font-bold' : ''
                      }`}
                    >
                      Under ₹5,000
                    </button>
                    <button
                      onClick={() => setPriceFilter(priceFilter === 'above_5000' ? '' : 'above_5000')}
                      className={`text-left py-1 hover:text-brand-dusty transition-colors ${
                        priceFilter === 'above_5000' ? 'text-brand-dusty font-bold' : ''
                      }`}
                    >
                      ₹5,000 & Above
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column Product Grid */}
              <div className="lg:col-span-3 space-y-6" id="catalog-results-grid">
                
                {/* Catalog Header controls */}
                <div className="flex items-center justify-between glass-panel backdrop-blur-md p-3 rounded-2xl border border-white/20 text-xs shadow-sm animate-fadeIn" id="catalog-toolbar">
                  <div className="text-brand-taupe">
                    Showing <span className="font-mono text-brand-charcoal font-bold">{filteredProducts.length}</span> luxury pieces
                  </div>
                  {/* Sorting dropdown */}
                  <div className="flex items-center space-x-2">
                    <span className="text-brand-taupe">Sort By:</span>
                    <select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      className="bg-white/40 border border-white/20 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-brand-dusty text-brand-charcoal"
                    >
                      <option value="best">Best Sellers</option>
                      <option value="price_low">Price: Low to High</option>
                      <option value="price_high">Price: High to Low</option>
                      <option value="rating">Top Rated</option>
                    </select>
                  </div>
                </div>

                {/* Catalog items display list */}
                {filteredProducts.length === 0 ? (
                  <div className="py-20 text-center text-brand-taupe space-y-4" id="catalog-empty-state">
                    <AlertCircle className="w-12 h-12 text-brand-taupe/40 mx-auto" />
                    <h4 className="font-serif text-lg text-brand-charcoal">No Apparel Matches Your Selection</h4>
                    <p className="text-xs italic">Try widening your filters or consulting our **AI Stylist** for advice.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="catalog-products-list">
                    {filteredProducts.map((p) => (
                      <ProductCard
                        key={p.id}
                        product={p}
                        onSelect={handleSelectProduct}
                        wishlist={wishlist}
                        toggleWishlist={toggleWishlist}
                        addToCart={addToCart}
                      />
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* VIEW 3: PRODUCT DETAILS SCREEN */}
        {currentView === 'product-details' && selectedProduct && (
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 animate-fadeIn" id="product-details-screen">
            <button
              onClick={() => setView('shop')}
              className="text-xs text-brand-dusty hover:underline uppercase tracking-wider font-semibold font-sans mb-6 block"
            >
              ← Back to Catalog
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12" id="details-view-grid">
              
              {/* Left Column Gallery layout */}
              <div className="lg:col-span-7 space-y-4" id="details-left-gallery">
                <div className="aspect-[3/4] rounded-luxury overflow-hidden border border-white/20 glass-panel shadow-md">
                  <img
                    src={selectedProduct.images[0]}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {selectedProduct.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-4" id="details-thumbnails">
                    {selectedProduct.images.map((img, idx) => (
                      <div key={idx} className="aspect-[3/4] rounded-luxury overflow-hidden border border-white/15 cursor-pointer hover:border-brand-dusty shadow-sm">
                        <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column Specifications details */}
              <div className="lg:col-span-5 space-y-6" id="details-right-specifications">
                <div>
                  <span className="text-[10px] font-mono tracking-[0.25em] text-brand-dusty uppercase font-bold">
                    {selectedProduct.category}
                  </span>
                  <h1 className="font-serif text-2xl sm:text-3xl text-brand-charcoal font-semibold tracking-tight mt-1">
                    {selectedProduct.name}
                  </h1>
                  <p className="text-[10px] text-brand-taupe font-mono mt-0.5">SKU: {selectedProduct.sku}</p>
                </div>

                {/* Rating summary */}
                <div className="flex items-center space-x-3 text-xs" id="details-rating-block">
                  <div className="flex items-center space-x-1 text-brand-dusty">
                    <Star className="w-4.5 h-4.5 fill-brand-dusty" />
                    <span className="font-mono text-sm font-bold text-brand-charcoal">{selectedProduct.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-brand-taupe">|</span>
                  <span className="text-brand-taupe italic">{selectedProduct.reviews.length} authentic purchase reviews</span>
                </div>

                {/* Price Display */}
                <div className="border-t border-white/10 pt-4" id="details-pricing">
                  {selectedProduct.salePrice ? (
                    <div className="flex items-baseline space-x-3">
                      <span className="text-brand-taupe line-through font-mono text-base font-light">
                        ₹{selectedProduct.price.toLocaleString()}
                      </span>
                      <span className="font-mono text-2xl font-bold text-brand-dusty">
                        ₹{selectedProduct.salePrice.toLocaleString()}
                      </span>
                      <span className="text-[10px] tracking-wider uppercase bg-brand-rose text-brand-dusty px-2 py-0.5 rounded font-bold font-sans">
                        Save ₹{(selectedProduct.price - selectedProduct.salePrice).toLocaleString()}
                      </span>
                    </div>
                  ) : (
                    <span className="font-mono text-2xl font-bold text-brand-charcoal">
                      ₹{selectedProduct.price.toLocaleString()}
                    </span>
                  )}
                  <span className="text-[10px] text-brand-taupe font-light leading-relaxed block mt-1">
                    MRP inclusive of all taxes
                  </span>
                </div>

                {/* Short description */}
                <p className="text-xs text-brand-taupe leading-relaxed font-light font-serif">
                  {selectedProduct.description}
                </p>

                {/* Core sizes picker selection */}
                <div className="space-y-2 border-t border-white/10 pt-4" id="details-sizes">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] tracking-wider text-brand-charcoal uppercase font-bold">Select Size</span>
                    <button
                      onClick={() => setShowSizeGuide(true)}
                      className="text-[10px] text-brand-dusty hover:underline uppercase tracking-wider font-semibold font-sans"
                    >
                      Size Guide Table
                    </button>
                  </div>
                  <div className="flex gap-2">
                    {selectedProduct.sizes.map((sz) => (
                      <button
                        key={sz}
                        className="w-10 h-10 rounded-xl font-mono text-xs border border-white/15 bg-white/40 text-brand-charcoal hover:bg-brand-rose/20 transition-all font-semibold"
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Core colors picker selection */}
                <div className="space-y-2 border-t border-white/10 pt-4" id="details-colors">
                  <span className="text-[10px] tracking-wider text-brand-charcoal uppercase font-bold block">Bespoke Colorways</span>
                  <div className="flex gap-2">
                    {selectedProduct.colors.map((col) => (
                      <button
                        key={col}
                        className="px-4 py-2 rounded-xl text-xs border border-white/15 bg-white/40 text-brand-charcoal font-medium"
                      >
                        {col}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pincode checker block */}
                <div className="glass-panel backdrop-blur-md p-4 rounded-luxury border border-white/20 space-y-3 text-xs shadow-sm" id="details-pincode-widget">
                  <span className="font-serif font-semibold text-brand-charcoal block">Delivery Pincode Checker</span>
                  <form onSubmit={handlePincodeCheck} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Enter 6-digit pin code"
                      maxLength={6}
                      value={pincode}
                      onChange={e => {
                        setPincode(e.target.value);
                        setPincodeStatus('idle');
                      }}
                      className="bg-white/40 border border-white/20 rounded-lg p-2.5 font-mono text-xs focus:outline-none focus:border-brand-dusty text-brand-charcoal w-full"
                      id="pincode-input-field"
                    />
                    <button
                      type="submit"
                      disabled={pincodeStatus === 'checking'}
                      className="bg-brand-charcoal hover:bg-brand-dusty disabled:bg-brand-taupe/30 text-white px-4 py-2.5 rounded-lg font-sans uppercase text-[10px] font-semibold tracking-wider transition-colors shrink-0"
                    >
                      {pincodeStatus === 'checking' ? 'Verifying...' : 'Check'}
                    </button>
                  </form>
                  {pincodeStatus === 'serviceable' && (
                    <p className="text-[10px] text-emerald-700 font-medium flex items-center space-x-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>✓ Brand service available. Delivery by Blue Dart Premium within 2-3 Days!</span>
                    </p>
                  )}
                  {pincodeStatus === 'unserviceable' && (
                    <p className="text-[10px] text-rose-700 font-medium flex items-center space-x-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Address is remote. Contact our custom transport service to organize delivery.</span>
                    </p>
                  )}
                </div>

                {/* Main checkout actions buttons */}
                <div className="flex gap-4 pt-4 border-t border-white/10" id="details-actions">
                  <button
                    onClick={() => addToCart(selectedProduct, selectedProduct.sizes[0] || 'M', selectedProduct.colors[0] || 'Original')}
                    className="flex-1 bg-brand-charcoal hover:bg-brand-dusty text-white text-xs tracking-[0.25em] font-sans uppercase font-semibold py-4 rounded-full transition-luxury shadow-md hover:shadow-lg"
                    id="add-bag-details-btn"
                  >
                    Add To Shopping Bag
                  </button>
                  <button
                    onClick={() => toggleWishlist(selectedProduct)}
                    className="p-4 border border-white/20 rounded-full text-brand-charcoal hover:bg-brand-rose/20 transition-all"
                    aria-label="Add details to wishlist"
                    id="wishlist-details-btn"
                  >
                    <Heart className={`w-5 h-5 ${wishlist.some(item => item.id === selectedProduct.id) ? 'fill-brand-dusty text-brand-dusty' : ''}`} />
                  </button>
                </div>

                {/* Fabric specifications Accordion Details */}
                <div className="pt-6 border-t border-white/10 space-y-4 text-xs font-light" id="details-spec-tabs">
                  <div className="space-y-1.5">
                    <span className="font-serif font-bold text-brand-charcoal block">Fabrication Details:</span>
                    <p className="text-brand-taupe leading-relaxed">{selectedProduct.fabric}</p>
                  </div>
                  <div className="space-y-1.5">
                    <span className="font-serif font-bold text-brand-charcoal block">Care & Wash Directions:</span>
                    <p className="text-brand-taupe leading-relaxed">{selectedProduct.careInstructions}</p>
                  </div>
                </div>

                {/* AI REVIEWS SUMMARY MODULE */}
                <div className="glass-panel backdrop-blur-md border border-white/25 p-4 rounded-luxury space-y-3 text-xs shadow-sm" id="details-reviews-summarizer">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-1.5">
                      <Sparkles className="w-4 h-4 text-brand-dusty animate-pulse" />
                      <span className="font-serif font-semibold text-brand-charcoal">AI Buyer Summary</span>
                    </div>
                    {!reviewsSummary && (
                      <button
                        onClick={() => handleSummarizeReviews(selectedProduct)}
                        disabled={isSummarizingReviews}
                        className="text-[10px] text-brand-dusty hover:underline font-semibold font-sans uppercase tracking-wider"
                      >
                        {isSummarizingReviews ? 'Summarizing feedback...' : 'Generate AI Summary'}
                      </button>
                    )}
                  </div>
                  {reviewsSummary ? (
                    <div className="text-xs text-brand-taupe leading-relaxed font-light whitespace-pre-line bg-white/40 p-3 rounded-luxury border border-white/15" id="reviews-summary-display">
                      {reviewsSummary}
                    </div>
                  ) : (
                    <p className="text-[10px] text-brand-taupe/80 italic font-light">
                      Let our AI review compiler process buyer feedback to summarize fit, fabric comfort, and verdicts.
                    </p>
                  )}
                </div>

                {/* Customer Reviews Section */}
                <div className="border-t border-white/10 pt-8 space-y-6" id="details-reviews-section">
                  <h3 className="font-serif text-lg font-bold text-brand-charcoal">Customer Feedback</h3>

                  {/* Write a review form */}
                  <form onSubmit={(e) => handleReviewSubmit(e, selectedProduct)} className="glass-panel backdrop-blur-md p-4 rounded-3xl border border-white/20 space-y-3 shadow-sm" id="write-review-form">
                    <span className="font-serif font-semibold text-brand-charcoal block">Share Your Experience</span>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-brand-taupe mb-1 text-[11px]">Your Name</label>
                        <input
                          type="text"
                          required
                          value={newReviewName}
                          onChange={e => setNewReviewName(e.target.value)}
                          className="w-full bg-white/40 border border-white/15 rounded-lg p-2 focus:outline-none focus:border-brand-dusty text-brand-charcoal text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-brand-taupe mb-1 text-[11px]">Rating Stars</label>
                        <select
                          value={newReviewRating}
                          onChange={e => setNewReviewRating(Number(e.target.value))}
                          className="w-full bg-white/40 border border-white/15 rounded-lg p-2 focus:outline-none focus:border-brand-dusty text-brand-charcoal text-xs"
                        >
                          <option value={5}>5 Stars (Loved It)</option>
                          <option value={4}>4 Stars (Good Fit)</option>
                          <option value={3}>3 Stars (Average)</option>
                          <option value={2}>2 Stars (Poor Quality)</option>
                          <option value={1}>1 Star (Returned)</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-brand-taupe mb-1 text-[11px]">Comment</label>
                      <textarea
                        required
                        rows={2}
                        value={newReviewComment}
                        onChange={e => setNewReviewComment(e.target.value)}
                        placeholder="Write details on fabric softness, stitching, color accuracy..."
                        className="w-full bg-white/40 border border-white/15 rounded-lg p-2 focus:outline-none focus:border-brand-dusty text-brand-charcoal text-xs"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-brand-charcoal hover:bg-brand-dusty text-white text-[10px] tracking-wider uppercase font-sans font-semibold px-4 py-2 rounded-full transition-luxury"
                    >
                      Publish Review
                    </button>
                  </form>

                  {/* Reviews list */}
                  <div className="space-y-4" id="reviews-list-container">
                    {selectedProduct.reviews.map((rev) => (
                      <div key={rev.id} className="border-b border-white/10 pb-4 space-y-1.5" id={`review-comment-${rev.id}`}>
                        <div className="flex items-center justify-between text-xs font-serif font-medium">
                          <span className="text-brand-charcoal">{rev.userName}</span>
                          <span className="text-brand-taupe text-[10px] font-mono">{new Date(rev.date).toLocaleDateString()}</span>
                        </div>
                        {/* Stars */}
                        <div className="flex text-brand-dusty">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-brand-dusty' : 'text-slate-200'}`} />
                          ))}
                        </div>
                        <p className="text-xs text-brand-taupe leading-relaxed font-light font-serif">
                          "{rev.comment}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* VIEW 4: WISHLIST VIEW */}
        {currentView === 'wishlist' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 animate-fadeIn" id="wishlist-view-screen">
            <div className="border-b border-white/10 pb-4 mb-8">
              <h2 className="font-serif text-3xl font-bold text-brand-charcoal">My Curated Wishlist</h2>
              <p className="text-xs text-brand-taupe font-mono mt-1">Items you saved for later purchase</p>
            </div>

            {wishlist.length === 0 ? (
              <div className="py-20 text-center text-brand-taupe space-y-4" id="wishlist-empty-state">
                <Heart className="w-12 h-12 text-brand-taupe/30 mx-auto animate-pulse" />
                <h4 className="font-serif text-lg text-brand-charcoal">Your Wishlist is Empty</h4>
                <p className="text-xs italic">Browse our catalogs and save items you adore.</p>
                <button onClick={() => setView('shop')} className="bg-brand-charcoal hover:bg-brand-dusty text-white px-6 py-3 rounded-full text-xs tracking-widest uppercase font-semibold font-sans transition-luxury">
                  Go Shopping
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="wishlist-grid">
                {wishlist.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onSelect={handleSelectProduct}
                    wishlist={wishlist}
                    toggleWishlist={toggleWishlist}
                    addToCart={addToCart}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 5: SHOPPING BAG / CART */}
        {currentView === 'cart' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 animate-fadeIn" id="shopping-cart-screen">
            <div className="border-b border-white/10 pb-4 mb-8">
              <h2 className="font-serif text-3xl font-bold text-brand-charcoal">My Shopping Bag</h2>
            </div>

            {cart.length === 0 ? (
              <div className="py-20 text-center text-brand-taupe space-y-4" id="cart-empty-state">
                <ShoppingBag className="w-12 h-12 text-brand-taupe/30 mx-auto" />
                <h4 className="font-serif text-lg text-brand-charcoal">Your Shopping Bag is Empty</h4>
                <p className="text-xs italic">Reserve gorgeous ethnic apparel from our curated collections.</p>
                <button onClick={() => setView('shop')} className="bg-brand-charcoal hover:bg-brand-dusty text-white px-6 py-3 rounded-full text-xs tracking-widest uppercase font-semibold font-sans transition-luxury">
                  Browse Catalog
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="cart-grid">
                
                {/* Left Side: Cart Items list */}
                <div className="lg:col-span-8 space-y-4" id="cart-items-column">
                  {cart.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row items-center justify-between p-4 border border-white/20 rounded-luxury glass-panel backdrop-blur-md space-y-4 sm:space-y-0 shadow-sm" id={`cart-row-${item.id}`}>
                      <div className="flex items-center space-x-4 w-full sm:w-auto">
                        <img src={item.product.images[0]} alt={item.product.name} className="w-16 h-20 object-cover rounded-luxury border border-white/10" />
                        <div className="text-xs space-y-0.5">
                          <span className="text-[10px] tracking-wider uppercase font-mono text-brand-taupe">{item.product.category}</span>
                          <h4 onClick={() => handleSelectProduct(item.product)} className="font-serif font-semibold text-sm text-brand-charcoal hover:text-brand-dusty cursor-pointer transition-colors leading-tight">{item.product.name}</h4>
                          <p className="text-brand-taupe">Size: <span className="font-mono text-brand-charcoal font-bold">{item.selectedSize}</span> | Color: <span className="text-brand-charcoal">{item.selectedColor}</span></p>
                        </div>
                      </div>

                      {/* Quantity controls */}
                      <div className="flex items-center space-x-3 border border-white/15 rounded-full p-1 bg-white/40 backdrop-blur-sm" id="cart-qty-bar">
                        <button onClick={() => updateCartQty(item.id, -1)} className="w-6 h-6 flex items-center justify-center hover:bg-brand-rose/20 rounded-full text-sm text-brand-taupe font-bold transition-all">-</button>
                        <span className="font-mono text-xs font-semibold text-brand-charcoal w-6 text-center">{item.quantity}</span>
                        <button onClick={() => updateCartQty(item.id, 1)} className="w-6 h-6 flex items-center justify-center hover:bg-brand-rose/20 rounded-full text-sm text-brand-taupe font-bold transition-all">+</button>
                      </div>

                      {/* Price & Delete */}
                      <div className="flex items-center justify-between sm:justify-end space-x-6 w-full sm:w-auto font-mono text-xs" id="cart-price-controls">
                        <div className="text-right">
                          <span className="text-sm font-semibold text-brand-charcoal">₹{((item.product.salePrice || item.product.price) * item.quantity).toLocaleString()}</span>
                          {item.quantity > 1 && <span className="text-[9px] text-brand-taupe block">₹{(item.product.salePrice || item.product.price).toLocaleString()} / piece</span>}
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-brand-taupe hover:text-brand-dusty text-[10px] tracking-wider uppercase font-sans font-semibold">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right Side: Order Summary card */}
                <div className="lg:col-span-4 glass-panel backdrop-blur-md p-6 rounded-luxury border border-white/20 h-fit space-y-6 shadow-md" id="cart-summary-column">
                  <h3 className="font-serif text-sm font-bold text-brand-charcoal border-b border-white/10 pb-2 uppercase tracking-wider">Checkout Summary</h3>

                  {/* Promo coupon form */}
                  <form onSubmit={applyPromoCode} className="space-y-2" id="coupon-entry-form">
                    <label className="block text-[10px] tracking-widest text-brand-taupe uppercase font-semibold">Have a Promo Coupon?</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. ANANTAMAA10"
                        value={promoInput}
                        onChange={e => setPromoInput(e.target.value)}
                        className="w-full bg-white/40 border border-white/20 rounded-lg p-2.5 font-mono text-xs focus:outline-none uppercase text-center text-brand-charcoal"
                        id="promo-input-field"
                      />
                      <button type="submit" className="bg-brand-charcoal hover:bg-brand-dusty text-white px-4 py-2 rounded-full text-xs font-semibold font-sans uppercase tracking-wider transition-colors">Apply</button>
                    </div>
                    {appliedCoupon && (
                      <p className="text-[10px] text-emerald-700 font-semibold font-sans">
                        ✓ Coupon "{appliedCoupon.code}" applied successfully! ({appliedCoupon.discountType === 'percent' ? `${appliedCoupon.value}% Off` : `₹${appliedCoupon.value} Off`})
                      </p>
                    )}
                  </form>

                  {/* Summary math block */}
                  <div className="space-y-3 border-t border-white/10 pt-4 text-xs font-light" id="cart-summary-math">
                    <div className="flex justify-between">
                      <span className="text-brand-taupe">Atelier Subtotal:</span>
                      <span className="font-mono text-brand-charcoal">₹{cartSubtotal.toLocaleString()}</span>
                    </div>
                    {couponDiscount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-semibold">
                        <span>Coupon Discounts:</span>
                        <span className="font-mono">- ₹{couponDiscount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-brand-taupe">Luxury Insured Shipping:</span>
                      <span className="font-mono text-emerald-700 uppercase tracking-widest font-bold">Complimentary</span>
                    </div>
                    <div className="flex justify-between border-t border-white/10 pt-3 text-sm font-semibold">
                      <span className="font-serif">Total Reservation:</span>
                      <span className="font-mono text-brand-dusty">₹{cartTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setView('checkout')}
                    className="w-full bg-brand-charcoal hover:bg-brand-dusty text-white text-xs tracking-[0.2em] font-sans uppercase font-semibold py-4 rounded-full transition-luxury shadow-md hover:shadow-lg"
                    id="checkout-bag-btn"
                  >
                    Proceed To Checkout
                  </button>
                </div>

              </div>
            )}
          </div>
        )}

        {/* VIEW 6: CHECKOUT SCREEN */}
        {currentView === 'checkout' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 animate-fadeIn" id="checkout-screen">
            <div className="border-b border-white/10 pb-4 mb-8">
              <h2 className="font-serif text-3xl font-bold text-brand-charcoal">Secure Order Desk</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12" id="checkout-workspace-grid">
              
              {/* Left Side: forms */}
              <div className="lg:col-span-7 space-y-6" id="checkout-form-column">
                
                {/* Step tabs */}
                <div className="flex border-b border-white/10 text-xs font-sans font-medium uppercase tracking-wider" id="checkout-stepper">
                  <button
                    onClick={() => setCheckoutStep('shipping')}
                    className={`py-3.5 px-6 border-b-2 transition-all ${
                      checkoutStep === 'shipping' ? 'border-brand-dusty text-brand-dusty font-bold' : 'border-transparent text-brand-taupe'
                    }`}
                  >
                    1. Shipping Destination
                  </button>
                  <button
                    onClick={() => setCheckoutStep('payment')}
                    className={`py-3.5 px-6 border-b-2 transition-all ${
                      checkoutStep === 'payment' ? 'border-brand-dusty text-brand-dusty font-bold' : 'border-transparent text-brand-taupe'
                    }`}
                  >
                    2. Payment Method
                  </button>
                </div>

                {/* Sub-step 1: Shipping Form */}
                {checkoutStep === 'shipping' && (
                  <form onSubmit={(e) => { e.preventDefault(); setCheckoutStep('payment'); }} className="space-y-4 text-xs animate-fadeIn" id="shipping-address-form">
                    <h3 className="font-serif text-sm font-semibold text-brand-charcoal">Shipping Destination Address</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-brand-taupe mb-1">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={checkoutAddress.name}
                          onChange={e => setCheckoutAddress({ ...checkoutAddress, name: e.target.value })}
                          className="w-full bg-white/40 border border-white/20 rounded-lg p-2.5 focus:outline-none focus:border-brand-dusty text-brand-charcoal text-xs"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-brand-taupe mb-1">Street Address Line 1 *</label>
                        <input
                          type="text"
                          required
                          value={checkoutAddress.line1}
                          onChange={e => setCheckoutAddress({ ...checkoutAddress, line1: e.target.value })}
                          className="w-full bg-white/40 border border-white/20 rounded-lg p-2.5 focus:outline-none focus:border-brand-dusty text-brand-charcoal text-xs"
                          placeholder="Villa, Flat, Block Number, Street"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-brand-taupe mb-1">Apartment, Suite, Landmark (Optional)</label>
                        <input
                          type="text"
                          value={checkoutAddress.line2 || ''}
                          onChange={e => setCheckoutAddress({ ...checkoutAddress, line2: e.target.value })}
                          className="w-full bg-white/40 border border-white/20 rounded-lg p-2.5 focus:outline-none focus:border-brand-dusty text-brand-charcoal text-xs"
                          placeholder="e.g. Near Regal Cinema"
                        />
                      </div>
                      <div>
                        <label className="block text-brand-taupe mb-1">City *</label>
                        <input
                          type="text"
                          required
                          value={checkoutAddress.city}
                          onChange={e => setCheckoutAddress({ ...checkoutAddress, city: e.target.value })}
                          className="w-full bg-white/40 border border-white/20 rounded-lg p-2.5 focus:outline-none focus:border-brand-dusty text-brand-charcoal text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-brand-taupe mb-1">State / Province *</label>
                        <input
                          type="text"
                          required
                          value={checkoutAddress.state}
                          onChange={e => setCheckoutAddress({ ...checkoutAddress, state: e.target.value })}
                          className="w-full bg-white/40 border border-white/20 rounded-lg p-2.5 focus:outline-none focus:border-brand-dusty text-brand-charcoal text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-brand-taupe mb-1">Postal Code (PIN) *</label>
                        <input
                          type="text"
                          required
                          value={checkoutAddress.postalCode}
                          onChange={e => setCheckoutAddress({ ...checkoutAddress, postalCode: e.target.value })}
                          className="w-full bg-white/40 border border-white/20 rounded-lg p-2.5 focus:outline-none focus:border-brand-dusty text-brand-charcoal text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-brand-taupe mb-1">Country</label>
                        <input
                          type="text"
                          disabled
                          value="India"
                          className="w-full bg-white/20 border border-white/10 rounded-lg p-2.5 text-brand-taupe text-xs"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-brand-taupe mb-1">Phone Number *</label>
                        <input
                          type="tel"
                          required
                          value={checkoutAddress.phone}
                          onChange={e => setCheckoutAddress({ ...checkoutAddress, phone: e.target.value })}
                          className="w-full bg-white/40 border border-white/20 rounded-lg p-2.5 focus:outline-none focus:border-brand-dusty text-brand-charcoal text-xs"
                        />
                      </div>
                    </div>
                    <button type="submit" className="w-full bg-brand-charcoal hover:bg-brand-dusty text-white text-xs tracking-[0.25em] font-sans uppercase font-semibold py-4 rounded-full transition-luxury shadow-md">
                      Continue To Payment
                    </button>
                  </form>
                )}

                {/* Sub-step 2: Payment Selector Form */}
                {checkoutStep === 'payment' && (
                  <div className="space-y-6 animate-fadeIn" id="checkout-payment-methods">
                    <h3 className="font-serif text-sm font-semibold text-brand-charcoal">Bespoke Premium Payment Gateways</h3>
                    <div className="grid grid-cols-1 gap-3">
                      {[
                        { id: 'UPI', title: 'UPI (Unified Payments Interface)', desc: 'Pay instantly via GPay, PhonePe, or BHIM using simulated UPI code.' },
                        { id: 'Card', title: 'Credit / Debit Card', desc: 'Securely handle Visa, MasterCard, and Amex transactions.' },
                        { id: 'COD', title: 'Cash On Delivery (COD)', desc: 'Pay Cash to courier upon delivery at your doorstep.' }
                      ].map((pay) => (
                        <div
                          key={pay.id}
                          onClick={() => setPaymentMethod(pay.id as any)}
                          className={`p-4 border rounded-luxury cursor-pointer transition-all ${
                            paymentMethod === pay.id
                              ? 'border-brand-dusty bg-brand-rose/25 shadow-md backdrop-blur-md'
                              : 'border-white/10 bg-white/40 backdrop-blur-sm hover:border-brand-dusty/40'
                          }`}
                        >
                          <div className="flex items-center space-x-3 text-xs">
                            <input
                              type="radio"
                              name="payment"
                              checked={paymentMethod === pay.id}
                              onChange={() => {}}
                              className="accent-brand-dusty"
                            />
                            <span className="font-sans font-bold text-brand-charcoal">{pay.title}</span>
                          </div>
                          <p className="text-[11px] text-brand-taupe leading-relaxed mt-1 pl-6 font-light">{pay.desc}</p>
                        </div>
                      ))}
                    </div>

                    {paymentMethod === 'Card' && (
                      <div className="glass-panel p-4 rounded-luxury border border-white/20 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs animate-slideDown shadow-sm">
                        <div className="sm:col-span-2">
                          <label className="block text-brand-taupe mb-1">Card Number</label>
                          <input type="text" disabled value="••••  ••••  ••••  1293" className="w-full bg-white/20 border border-white/10 rounded-lg p-2.5 text-brand-taupe text-xs" />
                        </div>
                        <div>
                          <label className="block text-brand-taupe mb-1">Expiry Date</label>
                          <input type="text" disabled value="12 / 29" className="w-full bg-white/20 border border-white/10 rounded-lg p-2.5 text-brand-taupe text-xs" />
                        </div>
                        <div>
                          <label className="block text-brand-taupe mb-1">CVV Security Code</label>
                          <input type="password" disabled value="•••" className="w-full bg-white/20 border border-white/10 rounded-lg p-2.5 text-brand-taupe text-xs" />
                        </div>
                      </div>
                    )}

                    <div className="glass-panel backdrop-blur-md border border-white/20 p-4 rounded-luxury text-[11px] leading-relaxed text-brand-charcoal flex space-x-2 shadow-sm">
                      <ShieldCheck className="w-5 h-5 shrink-0 text-brand-dusty" />
                      <p>
                        <strong>Secured Payment:</strong> Checkout is fully simulated for preview purposes. Your personal credit coordinates are highly secured and are not transmitted.
                      </p>
                    </div>

                    <button
                      onClick={handlePlaceOrder}
                      disabled={isProcessingOrder}
                      className="w-full bg-brand-charcoal hover:bg-brand-dusty disabled:bg-brand-taupe/30 text-white text-xs tracking-[0.2em] font-sans uppercase font-bold py-4 rounded-full transition-luxury shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                      id="complete-checkout-order-btn"
                    >
                      {isProcessingOrder ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Securing bespoke order...</span>
                        </>
                      ) : (
                        <span>Complete Luxury Order</span>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Right Side: basket content summary */}
              <div className="lg:col-span-5 glass-panel backdrop-blur-md p-6 rounded-luxury border border-white/20 h-fit space-y-4 shadow-md" id="checkout-summary-column">
                <h3 className="font-serif text-sm font-semibold text-brand-charcoal border-b border-white/10 pb-2 uppercase tracking-wider">Your Selection Summary</h3>
                <div className="space-y-4 max-h-72 overflow-y-auto" id="checkout-summary-items">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-xs" id={`checkout-summary-item-${item.id}`}>
                      <div className="flex items-center space-x-3">
                        <img src={item.product.images[0]} alt={item.product.name} className="w-9 h-11 object-cover rounded-xl border border-white/10" />
                        <div>
                          <h4 className="font-serif font-semibold text-brand-charcoal leading-tight truncate w-36 sm:w-44">{item.product.name}</h4>
                          <span className="text-[10px] text-brand-taupe font-mono">Size {item.selectedSize} | Qty {item.quantity}</span>
                        </div>
                      </div>
                      <span className="font-mono text-brand-charcoal">₹{((item.product.salePrice || item.product.price) * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/10 pt-4 space-y-2.5 text-xs font-light">
                  <div className="flex justify-between">
                    <span className="text-brand-taupe">Subtotal:</span>
                    <span className="font-mono text-brand-charcoal">₹{cartSubtotal.toLocaleString()}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Coupons Reduction:</span>
                      <span className="font-mono">- ₹{couponDiscount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-white/10 pt-2.5 text-sm font-semibold">
                    <span className="font-serif">Total Reservation:</span>
                    <span className="font-mono text-brand-dusty">₹{cartTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* VIEW 7: ORDER SUCCESS SCREEN */}
        {currentView === 'order-success' && latestOrder && (
          <div className="max-w-xl mx-auto px-6 py-16 text-center space-y-6 animate-scaleIn" id="order-success-screen">
            <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center mx-auto text-emerald-600 shadow-md">
              <CheckCircle className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] tracking-[0.3em] text-brand-dusty uppercase font-mono font-semibold">Reservation Completed</span>
              <h1 className="font-serif text-3xl font-semibold text-brand-charcoal">Wear With Pride & Elegance</h1>
              <p className="text-xs text-brand-taupe leading-relaxed max-w-sm mx-auto font-light">
                Namaste, {latestOrder.customerName}. We have securely logged your luxury ethnic apparel order. Our craftsmen are already finishing your garments at our boutique.
              </p>
            </div>

            {/* Order info summary details card */}
            <div className="glass-panel backdrop-blur-md p-5 rounded-luxury border border-white/20 text-left text-xs space-y-3 font-light shadow-sm" id="success-summary-card">
              <div className="flex justify-between font-mono pb-2 border-b border-white/10">
                <span className="text-brand-taupe">Order ID:</span>
                <span className="text-brand-charcoal font-bold">#{latestOrder.id}</span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-brand-taupe">Dispatch carrier:</span>
                <span className="text-brand-charcoal font-medium">Blue Dart Premium Insured</span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-brand-taupe">Tracking number:</span>
                <span className="text-brand-charcoal font-mono">{latestOrder.trackingNumber || 'AN-BD-9827361'}</span>
              </div>
              <div className="flex justify-between font-mono pt-2 border-t border-white/10 font-bold text-sm">
                <span className="font-serif">Total Reservation:</span>
                <span className="text-brand-dusty">₹{latestOrder.total.toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center text-xs uppercase tracking-widest font-sans font-semibold">
              <button
                onClick={() => setView('account')}
                className="bg-brand-charcoal hover:bg-brand-dusty text-white px-6 py-4 rounded-full transition-luxury shadow"
                id="success-track-btn"
              >
                Track In My Orders
              </button>
              <button
                onClick={() => setView('shop')}
                className="border border-white/20 text-brand-charcoal hover:bg-brand-rose/20 px-6 py-4 rounded-full transition-all"
                id="success-browse-btn"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        )}

        {/* VIEW 8: BRAND STORIES / ABOUT US */}
        {currentView === 'about' && (
          <div className="max-w-4xl mx-auto px-6 py-16 animate-fadeIn space-y-12 text-center" id="about-us-screen">
            <div className="space-y-3">
              <span className="text-[10px] tracking-[0.4em] text-brand-dusty uppercase font-mono font-bold">Atelier Heritage</span>
              <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-brand-charcoal tracking-tight">The Story of ANANTAMAA</h1>
              <p className="text-xs text-brand-taupe uppercase tracking-widest font-mono">Timeless grace, handcrafted Indian luxury</p>
            </div>

            <div className="aspect-[16/9] rounded-luxury overflow-hidden border border-white/20 shadow-xl glass-panel" id="about-banner-container">
              <img
                src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80"
                alt="Atelier Heritage looms"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left text-xs text-brand-taupe leading-relaxed font-serif font-light" id="about-text-grid">
              <div className="space-y-4">
                <p>
                  ANANTAMAA was born out of a profound passion to preserve the magnificent textile heritage of India while molding it for the modern, cosmopolitan woman. Inspired by the concept of 'Ananta' — meaning infinite, eternal, and unbound — the brand seeks to represent the timeless beauty, grace, and confidence of femininity.
                </p>
                <p>
                  At our core, we believe that luxury should not compromise on comfort. Traditional Indian ethnic attire is often heavy or restrictive; ANANTAMAA challenges this by selecting only the finest, softest organic cotton malmul, pure tussar silks, and lightweight tissue weaves.
                </p>
              </div>
              <div className="space-y-4">
                <p>
                  Every collection is handcrafted in our Colaba atelier in Mumbai, collaborating directly with generational weaving communities and embroidery masters from Varanasi and Lucknow. From delicate dabka and cutdana needlework to Lucknow shadow Chikankari, each garment represents over 40 hours of meticulous hand-stitching.
                </p>
                <p>
                  By marrying structural modern silhouettes (like our elegant co-ords and asymmetric kurtis) with the legendary craftsmanship of Indian looms, ANANTAMAA delivers a digitally native luxury shopping experience that honors heritage while stepping beautifully into the future.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 9: FAQ PANEL */}
        {currentView === 'faq' && (
          <div className="max-w-3xl mx-auto px-6 py-16 animate-fadeIn space-y-8" id="faq-screen">
            <div className="text-center space-y-2 border-b border-white/10 pb-6">
              <span className="text-[10px] tracking-[0.3em] text-brand-dusty uppercase font-mono font-bold">Customer Care Desk</span>
              <h1 className="font-serif text-3xl font-semibold text-brand-charcoal">Frequently Asked Questions</h1>
            </div>

            <div className="space-y-6" id="faq-questions">
              {[
                { q: 'How long does shipping take within India?', a: 'All shipments inside India are delivered free of charge. Your parcel is packed in our luxury keepsake boxes and dispatched via Blue Dart Express, typically reaching metropolitan regions within 2-3 business days and other regions within 4-5 business days.' },
                { q: 'What is your Return and Exchange policy?', a: 'We accept complimentary returns and exchanges on all unworn items with original tags intact within 14 days of delivery. You can easily trigger a simulated return inside your "My Orders" dashboard, which credits the refund directly into your boutique wallet.' },
                { q: 'How do I choose my ideal size fit?', a: 'Our garments run true to standard Indian sizing benchmarks (S-36, M-38, L-40, XL-42, XXL-44). You can tap on the "Size Guide" on any product detail screen to review exact bust, hip, and length measurements.' },
                { q: 'Are ANANTAMAA garments customizable?', a: 'For minor adjustments or special size custom requests, please consult our **AI Stylist chatbot** or contact our atelier directly at Mumbai studio support.' }
              ].map((faq, idx) => (
                <div key={idx} className="glass-panel backdrop-blur-md p-5 rounded-luxury border border-white/20 space-y-2 text-xs shadow-sm" id={`faq-${idx}`}>
                  <h4 className="font-serif font-semibold text-brand-charcoal flex items-center space-x-2">
                    <HelpCircle className="w-4 h-4 text-brand-dusty shrink-0" />
                    <span>{faq.q}</span>
                  </h4>
                  <p className="text-brand-taupe leading-relaxed pl-6 font-light">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 10: USER DASHBOARD (PROFILE & PAST ORDERS) */}
        {currentView === 'account' && (
          <div className="animate-fadeIn" id="account-dashboard-wrapper">
            <UserDashboard
              orders={orders}
              addresses={addresses}
              onAddAddress={handleAddAddress}
              onUpdateOrderStatus={handleUpdateOrderStatus}
            />
          </div>
        )}

        {/* VIEW 11: ADMIN STRATEGIC PANEL */}
        {currentView === 'admin' && (
          <div className="animate-fadeIn" id="admin-panel-wrapper">
            <AdminPanel
              products={products}
              orders={orders}
              coupons={coupons}
              onAddProduct={handleAddProduct}
              onEditProduct={handleEditProduct}
              onDeleteProduct={handleDeleteProduct}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onAddCoupon={handleAddCoupon}
              onToggleCoupon={handleToggleCoupon}
            />
          </div>
        )}

      </main>

      {/* Elegant AI Heritage Stylist Chat Widget */}
      <AIStylist
        products={products}
        onSelectProduct={handleSelectProduct}
      />

      {/* Elegant Footer */}
      <Footer setView={setView} />

      {/* Size Guide modal overlay */}
      {showSizeGuide && (
        <SizeGuide onClose={() => setShowSizeGuide(false)} />
      )}

    </div>
  );
}
