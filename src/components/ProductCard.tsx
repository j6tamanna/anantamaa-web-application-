/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  addToCart: (product: Product, size: string, color: string) => void;
  key?: React.Key;
}

export default function ProductCard({
  product,
  onSelect,
  wishlist,
  toggleWishlist,
  addToCart,
}: ProductCardProps) {
  const isWishlisted = wishlist.some(item => item.id === product.id);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Default to the first size and color
    const defaultSize = product.sizes[0] || 'M';
    const defaultColor = product.colors[0] || 'Original';
    addToCart(product, defaultSize, defaultColor);
  };

  return (
    <div
      onClick={() => onSelect(product)}
      className="group glass-panel rounded-luxury overflow-hidden shadow-sm hover:shadow-xl hover:border-brand-dusty/50 border-white/20 transition-luxury duration-500 flex flex-col justify-between cursor-pointer"
      id={`product-card-${product.id}`}
    >
      {/* 1. Image and Badges */}
      <div className="relative aspect-[3/4] overflow-hidden bg-white/10" id="card-image-container">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10" id="card-badges">
          {product.isBestSeller && (
            <span className="bg-brand-charcoal text-white text-[9px] tracking-widest font-sans uppercase px-2.5 py-1 rounded-full font-semibold">
              Best Seller
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-brand-taupe text-white text-[9px] tracking-widest font-sans uppercase px-2.5 py-1 rounded-full font-semibold">
              New Arrival
            </span>
          )}
          {product.isLimitedEdition && (
            <span className="bg-brand-dusty text-white text-[9px] tracking-widest font-sans uppercase px-2.5 py-1 rounded-full font-semibold">
              Limited Edition
            </span>
          )}
          {product.salePrice && (
            <span className="bg-brand-rose text-brand-charcoal text-[9px] tracking-widest font-sans uppercase px-2.5 py-1 rounded-full font-semibold border border-white/20">
              Sale
            </span>
          )}
        </div>

        {/* Heart Wishlist Toggler */}
        <button
          onClick={handleToggleWishlist}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/50 backdrop-blur-md border border-white/30 hover:bg-white/80 text-brand-charcoal hover:text-brand-taupe shadow-sm hover:shadow z-10 transition-luxury duration-300"
          aria-label="Add to Wishlist"
          id={`wishlist-btn-${product.id}`}
        >
          <Heart
            className={`w-4.5 h-4.5 transition-colors ${
              isWishlisted ? 'fill-brand-dusty text-brand-dusty' : 'text-brand-taupe'
            }`}
          />
        </button>

        {/* Floating Quick Action overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-12 group-hover:translate-y-0 transition-all duration-500 bg-gradient-to-t from-brand-charcoal/30 via-transparent to-transparent flex gap-2">
          <button
            onClick={handleQuickAdd}
            className="w-full bg-white/80 hover:bg-brand-dusty text-brand-charcoal hover:text-white text-[10px] tracking-widest uppercase font-sans font-semibold py-2.5 rounded-full flex items-center justify-center space-x-1.5 transition-luxury shadow-md backdrop-blur-sm"
            id={`quick-add-btn-${product.id}`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Quick Add</span>
          </button>
        </div>
      </div>

      {/* 2. Apparel details */}
      <div className="p-4 flex-1 flex flex-col justify-between" id="card-details-container">
        <div>
          <span className="text-[10px] tracking-wider font-mono text-brand-taupe uppercase">
            {product.category}
          </span>
          <h4 className="font-serif text-sm font-medium text-brand-charcoal mt-0.5 group-hover:text-brand-dusty transition-colors leading-tight">
            {product.name}
          </h4>
        </div>

        <div className="mt-2.5 pt-2 border-t border-white/15 flex items-center justify-between">
          {/* Rating */}
          <div className="flex items-center space-x-1 text-brand-dusty" id="card-rating">
            <Star className="w-3 h-3 fill-brand-dusty" />
            <span className="text-[10px] font-mono text-brand-taupe">
              {product.rating.toFixed(1)}
            </span>
          </div>

          {/* Pricing */}
          <div className="text-right" id="card-pricing">
            {product.salePrice ? (
              <div className="flex items-center space-x-1.5">
                <span className="text-xs text-brand-taupe/50 line-through font-mono font-light">
                  ₹{product.price.toLocaleString()}
                </span>
                <span className="text-sm text-brand-charcoal font-mono font-semibold">
                  ₹{product.salePrice.toLocaleString()}
                </span>
              </div>
            ) : (
              <span className="text-sm text-brand-charcoal font-mono font-semibold">
                ₹{product.price.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
