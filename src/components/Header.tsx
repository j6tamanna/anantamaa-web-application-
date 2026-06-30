/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Menu, Search, ShoppingBag, Heart, User, Settings, X } from 'lucide-react';
import { CartItem, Product } from '../types';

interface HeaderProps {
  currentView: string;
  setView: (view: string) => void;
  cart: CartItem[];
  wishlist: Product[];
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export default function Header({
  currentView,
  setView,
  cart,
  wishlist,
  products,
  onSelectProduct,
}: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Filter products for live search suggestions
  const filteredSuggestions = searchQuery.trim()
    ? products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.fabric.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleSuggestionClick = (product: Product) => {
    onSelectProduct(product);
    setSearchQuery('');
    setSearchOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setView(`shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const navigationLinks = [
    { label: 'Home', view: 'home' },
    { label: 'Shop All', view: 'shop' },
    { label: 'Pakistani Suits', view: 'shop?category=Pakistani%20Suits' },
    { label: 'Kurti Sets', view: 'shop?category=Kurti%20Sets' },
    { label: 'Co-ords', view: 'shop?category=Co-ord%20Sets' },
    { label: 'Our Story', view: 'about' },
  ];

  return (
    <header className="w-full z-40" id="anantamaa-header">
      {/* 1. Announcement Bar */}
      <div className="bg-brand-dusty text-white text-center py-2 text-[10px] tracking-[0.2em] font-sans uppercase font-medium" id="announcement-bar">
        Complimentary Worldwide Shipping on Orders Above ₹5,000
      </div>

      {/* 2. Main Navigation Bar */}
      <nav className="sticky top-0 glass-panel shadow-sm border-b border-white/20 py-4 px-4 sm:px-8 flex items-center justify-between transition-all duration-300">
        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="md:hidden text-brand-charcoal hover:text-brand-dusty p-1 transition-luxury"
          aria-label="Open menu"
          id="mobile-menu-btn"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-8 text-xs tracking-[0.2em] uppercase font-sans font-medium" id="desktop-links">
          {navigationLinks.slice(0, 3).map((link, idx) => (
            <button
              key={idx}
              onClick={() => setView(link.view)}
              className={`hover:text-brand-dusty transition-luxury relative pb-1 cosmetic-underline ${
                currentView === link.view || (link.view.startsWith('shop') && currentView === 'shop')
                  ? 'text-brand-dusty'
                  : 'text-brand-charcoal'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Brand Elegant Center Logo */}
        <div className="flex flex-col items-center cursor-pointer select-none" onClick={() => setView('home')} id="brand-logo-container">
          <h1 className="font-serif text-2xl sm:text-3xl tracking-[0.22em] uppercase font-semibold text-brand-charcoal hover:text-brand-dusty transition-luxury duration-500">
            ANANTAMAA
          </h1>
          <span className="text-[8px] tracking-[0.5em] font-sans uppercase text-brand-taupe -mt-0.5 font-light">
            Luxury Boutique
          </span>
        </div>

        {/* Desktop Navigation Links - Right Half */}
        <div className="hidden md:flex items-center space-x-8 text-xs tracking-[0.2em] uppercase font-sans font-medium" id="desktop-links-right">
          {navigationLinks.slice(3).map((link, idx) => (
            <button
              key={idx}
              onClick={() => setView(link.view)}
              className={`hover:text-brand-dusty transition-luxury relative pb-1 cosmetic-underline ${
                currentView === link.view
                  ? 'text-brand-dusty'
                  : 'text-brand-charcoal'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Icon Toolbar Controls */}
        <div className="flex items-center space-x-4 sm:space-x-6 text-brand-charcoal" id="nav-icon-toolbar">
          {/* Live Search Icon Toggle */}
          <button
            onClick={() => setSearchOpen(prev => !prev)}
            className="hover:text-brand-dusty transition-luxury p-1"
            aria-label="Search items"
            id="search-toggle-btn"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* User Account Icon Link */}
          <button
            onClick={() => setView('account')}
            className={`hover:text-brand-dusty transition-luxury p-1 flex items-center ${
              currentView === 'account' ? 'text-brand-taupe' : ''
            }`}
            aria-label="My Account"
            id="account-nav-btn"
          >
            <User className="w-5 h-5" />
          </button>

          {/* Wishlist Link */}
          <button
            onClick={() => setView('wishlist')}
            className="hover:text-brand-dusty transition-luxury p-1 relative"
            aria-label="My Wishlist"
            id="wishlist-nav-btn"
          >
            <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'fill-brand-taupe text-brand-taupe' : ''}`} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1.5 bg-brand-taupe text-white text-[9px] font-mono w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Shopping Bag / Cart */}
          <button
            onClick={() => setView('cart')}
            className="hover:text-brand-dusty transition-luxury p-1 relative"
            aria-label="Shopping Cart"
            id="cart-nav-btn"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1.5 bg-brand-dusty text-white text-[9px] font-mono w-4.5 h-4.5 rounded-full flex items-center justify-center font-semibold">
                {cartCount}
              </span>
            )}
          </button>

          {/* Admin Dashboard Panel Link */}
          <button
            onClick={() => setView('admin')}
            className={`hover:text-brand-dusty transition-luxury p-1 flex items-center space-x-1 border border-white/20 rounded-full px-2 py-0.5 text-[10px] tracking-wider font-sans uppercase bg-white/40 backdrop-blur-md ${
              currentView === 'admin' ? 'bg-brand-rose text-brand-taupe border-brand-rose/40' : 'text-brand-taupe'
            }`}
            aria-label="Admin Studio"
            id="admin-nav-btn"
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Admin</span>
          </button>
        </div>
      </nav>

      {/* 3. Search Bar Dropdown Overlay */}
      {searchOpen && (
        <div className="absolute top-full left-0 w-full glass-panel backdrop-blur-xl shadow-xl border-b border-white/20 z-50 animate-fadeIn" id="search-overlay-container">
          <div className="max-w-4xl mx-auto px-6 py-6 relative">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center border-b border-brand-charcoal pb-2">
              <Search className="w-5 h-5 text-brand-taupe mr-3" />
              <input
                type="text"
                placeholder="Search elegant apparel, fabrics, or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-lg focus:outline-none placeholder-brand-taupe/60 font-serif"
                autoFocus
                id="search-input-field"
              />
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSearchOpen(false);
                }}
                className="text-brand-taupe hover:text-brand-charcoal p-1 ml-2"
                id="search-close-btn"
              >
                <X className="w-5 h-5" />
              </button>
            </form>

            {/* Live suggestions */}
            {searchQuery.trim().length > 0 && (
              <div className="mt-4 bg-white/60 backdrop-blur-md rounded-lg border border-white/30 p-3 max-h-72 overflow-y-auto shadow-sm">
                <p className="text-[10px] tracking-widest text-brand-taupe uppercase font-semibold mb-2 px-2">Suggestions</p>
                {filteredSuggestions.length > 0 ? (
                  <div className="space-y-1">
                    {filteredSuggestions.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleSuggestionClick(product)}
                        className="flex items-center space-x-4 p-2 hover:bg-brand-rose/30 rounded cursor-pointer transition-colors"
                      >
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-12 h-14 object-cover rounded"
                        />
                        <div>
                          <p className="text-sm font-serif font-medium text-brand-charcoal">{product.name}</p>
                          <p className="text-xs text-brand-taupe font-mono">₹{product.price.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-brand-taupe p-2 italic">No matches found. Try searching "silk", "kurti", or "pakistani".</p>
                )}
              </div>
            )}

            {/* Quick Suggestions */}
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-brand-taupe font-light">Popular:</span>
              {['Pakistani Suits', 'Cotton Kurti', 'Co-ord Sets', 'Silk Suit'].map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => {
                    setSearchQuery(term);
                    setView(`shop?search=${encodeURIComponent(term)}`);
                    setSearchOpen(false);
                  }}
                  className="px-3 py-1 bg-white/40 border border-white/30 rounded-full text-brand-charcoal hover:bg-brand-rose/40 hover:border-brand-rose/60 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. Drawer Navigation for Mobile Screens */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-brand-charcoal/40 backdrop-blur-sm z-50 flex" id="mobile-drawer-overlay">
          <div className="w-4/5 max-w-sm glass-panel backdrop-blur-2xl h-full p-6 flex flex-col justify-between shadow-2xl border-r border-white/30 animate-slideRight">
            <div>
              <div className="flex items-center justify-between border-b border-white/20 pb-4 mb-6">
                <h3 className="font-serif text-xl tracking-widest uppercase font-semibold text-brand-charcoal">ANANTAMAA</h3>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-brand-charcoal hover:text-brand-dusty"
                  id="mobile-drawer-close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col space-y-4">
                {navigationLinks.map((link, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setView(link.view);
                      setMobileMenuOpen(false);
                    }}
                    className="text-left text-sm tracking-widest font-sans uppercase font-medium hover:text-brand-dusty transition-luxury py-2 border-b border-white/10"
                  >
                    {link.label}
                  </button>
                ))}
                <button
                  onClick={() => {
                    setView('admin');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left text-sm tracking-widest font-sans uppercase font-semibold text-brand-dusty transition-luxury py-2 flex items-center space-x-2"
                >
                  <Settings className="w-4 h-4" />
                  <span>Admin Panel</span>
                </button>
              </div>
            </div>

            <div className="border-t border-white/20 pt-4 text-center">
              <p className="text-[10px] tracking-widest text-brand-taupe uppercase">Timeless Luxury & Heritage</p>
              <p className="text-[9px] text-brand-taupe/70 mt-1 font-mono">ANANTAMAA © 2026</p>
            </div>
          </div>
          {/* Click outside to close */}
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)}></div>
        </div>
      )}
    </header>
  );
}
