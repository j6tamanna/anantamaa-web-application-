/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LayoutDashboard, ShoppingBag, Truck, Ticket, Plus, Save, Trash2, Edit3, TrendingUp, AlertTriangle, Users, DollarSign } from 'lucide-react';
import { Product, Order, Coupon, AdminStats } from '../types';

interface AdminPanelProps {
  products: Product[];
  orders: Order[];
  coupons: Coupon[];
  onAddProduct: (product: Product) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status'], payStatus?: Order['paymentStatus']) => void;
  onAddCoupon: (coupon: Coupon) => void;
  onToggleCoupon: (code: string) => void;
}

export default function AdminPanel({
  products,
  orders,
  coupons,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onAddCoupon,
  onToggleCoupon,
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'coupons'>('dashboard');

  // Product CRUD states
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formCat, setFormCat] = useState('Pakistani Suits');
  const [formPrice, setFormPrice] = useState(0);
  const [formSalePrice, setFormSalePrice] = useState(0);
  const [formImage, setFormImage] = useState('');
  const [formSizes, setFormSizes] = useState<string[]>(['S', 'M', 'L']);
  const [formColors, setFormColors] = useState<string[]>(['Dusty Pink']);
  const [formFabric, setFormFabric] = useState('');
  const [formCare, setFormCare] = useState('');
  const [formStock, setFormStock] = useState(10);
  const [formSku, setFormSku] = useState('');
  const [formTags, setFormTags] = useState<string[]>(['New Arrivals']);

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [couponType, setCouponType] = useState<'percent' | 'fixed'>('percent');
  const [couponValue, setCouponValue] = useState(10);
  const [couponMin, setCouponMin] = useState(1000);

  // Generate Admin Statistics from current state
  const computeStats = (): AdminStats => {
    const totalRev = orders
      .filter(o => o.status !== 'Returned')
      .reduce((sum, o) => sum + o.total, 0);
    const lowStock = products.filter(p => p.stock <= 5).length;
    
    // Category sales
    const categoryMap: { [key: string]: number } = {};
    orders.forEach(o => {
      if (o.status !== 'Returned') {
        o.items.forEach(item => {
          categoryMap[item.product.category] = (categoryMap[item.product.category] || 0) + (item.product.price * item.quantity);
        });
      }
    });

    const categorySales = Object.keys(categoryMap).map(cat => ({
      name: cat,
      value: categoryMap[cat]
    }));

    // Pre-seeded static monthly sales with current month dynamic addition
    const monthlyRevenue = [
      { month: 'Jan', sales: 45000 },
      { month: 'Feb', sales: 58000 },
      { month: 'Mar', sales: 72000 },
      { month: 'Apr', sales: 61000 },
      { month: 'May', sales: 89000 },
      { month: 'Jun', sales: 90000 + totalRev }
    ];

    return {
      totalRevenue: totalRev,
      totalOrders: orders.length,
      totalCustomers: Array.from(new Set(orders.map(o => o.customerEmail))).length || 4,
      lowStockCount: lowStock,
      categorySales: categorySales.length > 0 ? categorySales : [
        { name: 'Pakistani Suits', value: 24000 },
        { name: 'Kurti Sets', value: 18500 },
        { name: 'Co-ord Sets', value: 12000 }
      ],
      monthlyRevenue
    };
  };

  const stats = computeStats();

  const handleOpenNewProductForm = () => {
    setEditingProduct(null);
    setFormName('');
    setFormDesc('');
    setFormCat('Pakistani Suits');
    setFormPrice(4999);
    setFormSalePrice(0);
    setFormImage('https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80');
    setFormSizes(['S', 'M', 'L', 'XL']);
    setFormColors(['Dusty Pink', 'Beige']);
    setFormFabric('Chanderi Silk');
    setFormCare('Dry Clean Only');
    setFormStock(15);
    setFormSku(`AN-PROD-${Date.now().toString().slice(-4)}`);
    setFormTags(['New Arrivals']);
    setShowProductForm(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setFormName(prod.name);
    setFormDesc(prod.description);
    setFormCat(prod.category);
    setFormPrice(prod.price);
    setFormSalePrice(prod.salePrice || 0);
    setFormImage(prod.images[0]);
    setFormSizes(prod.sizes);
    setFormColors(prod.colors);
    setFormFabric(prod.fabric);
    setFormCare(prod.careInstructions);
    setFormStock(prod.stock);
    setFormSku(prod.sku);
    setFormTags(prod.tags);
    setShowProductForm(true);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formSku || formPrice <= 0) return;

    const payload: Product = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      name: formName,
      description: formDesc,
      category: formCat,
      price: Number(formPrice),
      salePrice: formSalePrice ? Number(formSalePrice) : undefined,
      rating: editingProduct ? editingProduct.rating : 5.0,
      images: [formImage || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80'],
      sizes: formSizes,
      colors: formColors,
      fabric: formFabric,
      careInstructions: formCare,
      estimatedDelivery: '3 - 5 business days',
      reviews: editingProduct ? editingProduct.reviews : [],
      stock: Number(formStock),
      sku: formSku,
      tags: formTags,
    };

    if (editingProduct) {
      onEditProduct(payload);
    } else {
      onAddProduct(payload);
    }

    setShowProductForm(false);
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    onAddCoupon({
      code: couponCode.trim().toUpperCase(),
      discountType: couponType,
      value: Number(couponValue),
      minOrderValue: Number(couponMin),
      active: true,
    });

    setCouponCode('');
  };

  const categoriesList = [
    'Pakistani Suits',
    'Kurti Sets',
    'Cotton Kurti Sets',
    'Silk Kurti Sets',
    'Co-ord Sets',
    'Cotton Co-ord Sets',
    'Silk Co-ord Sets'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8" id="admin-workspace-grid">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Admin Navigation Side Control */}
        <div className="w-full md:w-64 shrink-0 glass-panel backdrop-blur-md rounded-luxury p-6 border border-white/20 shadow-sm text-brand-charcoal h-fit space-y-6" id="admin-navbar-panel">
          <div>
            <h3 className="font-serif text-lg tracking-widest uppercase font-semibold text-brand-charcoal">Atelier Admin</h3>
            <p className="text-[9px] text-brand-dusty uppercase tracking-wider font-mono">ANANTAMAA Studio Control</p>
          </div>

          <div className="flex flex-col space-y-1.5 text-xs font-sans tracking-widest font-medium uppercase" id="admin-nav-tabs">
            <button
              onClick={() => { setActiveTab('dashboard'); setShowProductForm(false); }}
              className={`flex items-center space-x-3 p-3 rounded-xl transition-colors ${
                activeTab === 'dashboard' ? 'bg-brand-dusty text-white shadow-md' : 'hover:bg-brand-rose/25 text-brand-charcoal/80'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => { setActiveTab('products'); }}
              className={`flex items-center space-x-3 p-3 rounded-xl transition-colors ${
                activeTab === 'products' ? 'bg-brand-dusty text-white shadow-md' : 'hover:bg-brand-rose/25 text-brand-charcoal/80'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Products Catalog</span>
            </button>
            <button
              onClick={() => { setActiveTab('orders'); setShowProductForm(false); }}
              className={`flex items-center space-x-3 p-3 rounded-xl transition-colors ${
                activeTab === 'orders' ? 'bg-brand-dusty text-white shadow-md' : 'hover:bg-brand-rose/25 text-brand-charcoal/80'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Fulfillment Orders</span>
            </button>
            <button
              onClick={() => { setActiveTab('coupons'); setShowProductForm(false); }}
              className={`flex items-center space-x-3 p-3 rounded-xl transition-colors ${
                activeTab === 'coupons' ? 'bg-brand-dusty text-white shadow-md' : 'hover:bg-brand-rose/25 text-brand-charcoal/80'
              }`}
            >
              <Ticket className="w-4 h-4" />
              <span>Coupons & Promos</span>
            </button>
          </div>
        </div>

        {/* Right Active Admin Screen Panel */}
        <div className="flex-1 glass-panel backdrop-blur-md rounded-luxury p-6 border border-white/20 shadow-sm text-brand-charcoal" id="admin-workspace-content">
          
          {/* TAB 1: ANALYTICS DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fadeIn" id="admin-dashboard-view">
              <div className="border-b border-white/10 pb-3 flex justify-between items-center">
                <h3 className="font-serif text-xl font-bold text-brand-charcoal">Operational Analytics</h3>
                <span className="text-[10px] tracking-wider text-brand-taupe uppercase font-mono bg-white/25 border border-white/10 px-2.5 py-1 rounded-full">
                  System: Live Online
                </span>
              </div>

              {/* Core metrics widgets */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="metrics-grid">
                <div className="p-4 glass-panel bg-white/25 rounded-2xl border border-white/10 shadow-sm">
                  <div className="flex items-center justify-between text-brand-taupe mb-2">
                    <span className="text-xs font-sans uppercase tracking-wider font-medium">Atelier Revenue</span>
                    <DollarSign className="w-4 h-4 text-brand-dusty" />
                  </div>
                  <h4 className="font-mono text-xl font-bold text-brand-charcoal">₹{stats.totalRevenue.toLocaleString()}</h4>
                  <p className="text-[10px] text-emerald-600 mt-1 font-sans">↑ 14.2% from last week</p>
                </div>

                <div className="p-4 glass-panel bg-white/25 rounded-2xl border border-white/10 shadow-sm">
                  <div className="flex items-center justify-between text-brand-taupe mb-2">
                    <span className="text-xs font-sans uppercase tracking-wider font-medium">Orders Placed</span>
                    <ShoppingBag className="w-4 h-4 text-brand-dusty" />
                  </div>
                  <h4 className="font-mono text-xl font-bold text-brand-charcoal">{stats.totalOrders}</h4>
                  <p className="text-[10px] text-emerald-600 mt-1 font-sans">100% fulfilled safely</p>
                </div>

                <div className="p-4 glass-panel bg-white/25 rounded-2xl border border-white/10 shadow-sm">
                  <div className="flex items-center justify-between text-brand-taupe mb-2">
                    <span className="text-xs font-sans uppercase tracking-wider font-medium">Customers</span>
                    <Users className="w-4 h-4 text-brand-dusty" />
                  </div>
                  <h4 className="font-mono text-xl font-bold text-brand-charcoal">{stats.totalCustomers}</h4>
                  <p className="text-[10px] text-brand-taupe mt-1 font-sans">Exclusive club registrants</p>
                </div>

                <div className="p-4 glass-panel bg-white/25 rounded-2xl border border-white/10 shadow-sm">
                  <div className="flex items-center justify-between text-brand-taupe mb-2">
                    <span className="text-xs font-sans uppercase tracking-wider font-medium">Low Stock Alerts</span>
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                  </div>
                  <h4 className="font-mono text-xl font-bold text-brand-charcoal">{stats.lowStockCount}</h4>
                  <p className="text-[10px] text-amber-600 mt-1 font-sans">Requires atelier production</p>
                </div>
              </div>

              {/* Custom SVG Data Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" id="visual-charts-block">
                
                {/* Chart A: Monthly Revenue Trend */}
                <div className="p-5 border border-white/10 rounded-luxury bg-white/30 backdrop-blur-sm shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-serif text-sm font-semibold text-brand-charcoal">Revenue Trend (H1 2026)</h4>
                    <TrendingUp className="w-4 h-4 text-brand-taupe" />
                  </div>
                  
                  {/* SVG Bar chart */}
                  <div className="relative h-44 w-full" id="revenue-svg-chart">
                    <svg className="w-full h-full" viewBox="0 0 320 160">
                      {/* Grid Lines */}
                      <line x1="20" y1="20" x2="300" y2="20" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                      <line x1="20" y1="60" x2="300" y2="60" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                      <line x1="20" y1="100" x2="300" y2="100" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                      <line x1="20" y1="140" x2="300" y2="140" stroke="#2D2B2A" strokeWidth="1" />

                      {/* Bar charts representing monthly revenue */}
                      {stats.monthlyRevenue.map((item, idx) => {
                        const barWidth = 24;
                        const barGap = 20;
                        const startX = 40 + idx * (barWidth + barGap);
                        // Scale sales (max 100,000 to 120 pixels max height)
                        const barHeight = (item.sales / 110000) * 120;
                        const startY = 140 - barHeight;

                        return (
                          <g key={idx}>
                            {/* Bar rectangle */}
                            <rect
                              x={startX}
                              y={startY}
                              width={barWidth}
                              height={barHeight}
                              fill={idx === 5 ? 'var(--color-brand-dusty)' : 'var(--color-brand-rose)'}
                              rx="3"
                              className="transition-all hover:opacity-85 cursor-pointer"
                            />
                            {/* Label */}
                            <text x={startX + 12} y="155" fill="var(--color-brand-taupe)" fontSize="9" textAnchor="middle" fontFamily="monospace">
                              {item.month}
                            </text>
                            {/* Value tooltip */}
                            <text x={startX + 12} y={startY - 6} fill="var(--color-brand-charcoal)" fontSize="8" textAnchor="middle" fontWeight="bold" fontFamily="monospace">
                              ₹{(item.sales / 1000).toFixed(0)}k
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                </div>

                {/* Chart B: Category Share tracker */}
                <div className="p-5 border border-white/10 rounded-luxury bg-white/30 backdrop-blur-sm shadow-sm">
                  <h4 className="font-serif text-sm font-semibold text-brand-charcoal mb-4">Category Revenue Breakdown</h4>
                  <div className="space-y-4" id="category-progress-bars">
                    {stats.categorySales.map((cat, idx) => {
                      const totalSum = stats.categorySales.reduce((acc, c) => acc + c.value, 0) || 54500;
                      const percentage = Math.round((cat.value / totalSum) * 100) || 30;

                      return (
                        <div key={idx} className="space-y-1.5" id={`category-breakdown-row-${idx}`}>
                          <div className="flex justify-between text-xs font-sans">
                            <span className="font-medium text-brand-charcoal">{cat.name}</span>
                            <span className="font-mono text-brand-taupe">{percentage}% (₹{cat.value.toLocaleString()})</span>
                          </div>
                          {/* Progress tracking line */}
                          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-brand-dusty h-full rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS CRUD CATALOG */}
          {activeTab === 'products' && (
            <div className="space-y-6 animate-fadeIn" id="admin-products-view">
              <div className="border-b border-white/10 pb-3 flex justify-between items-center">
                <h3 className="font-serif text-lg font-bold text-brand-charcoal">Catalog Inventory</h3>
                {!showProductForm && (
                  <button
                    onClick={handleOpenNewProductForm}
                    className="flex items-center space-x-1 text-xs bg-brand-charcoal hover:bg-brand-dusty text-white px-4 py-2 rounded-full transition-luxury font-sans uppercase tracking-wider font-semibold"
                    id="add-new-product-btn"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Product</span>
                  </button>
                )}
              </div>

              {/* Add/Edit Product form overlay */}
              {showProductForm ? (
                <form onSubmit={handleProductSubmit} className="glass-panel backdrop-blur-md p-5 rounded-luxury border border-white/20 space-y-4 text-xs animate-slideDown shadow-sm" id="product-crud-form">
                  <h4 className="font-serif text-sm font-semibold text-brand-charcoal border-b border-white/10 pb-1.5">
                    {editingProduct ? `Edit Apparel - ${editingProduct.name}` : 'Create Brand New Apparel'}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-brand-taupe mb-1">Product Title *</label>
                      <input type="text" required value={formName} onChange={e => setFormName(e.target.value)} className="w-full bg-white/40 border border-white/20 rounded-lg p-2.5 focus:outline-none focus:border-brand-dusty text-brand-charcoal" placeholder="e.g. Shahi Ivory Raw Silk Kurta" />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-brand-taupe mb-1">Apparel Description *</label>
                      <textarea required value={formDesc} onChange={e => setFormDesc(e.target.value)} rows={3} className="w-full bg-white/40 border border-white/20 rounded-lg p-2.5 focus:outline-none focus:border-brand-dusty text-brand-charcoal" placeholder="Detailed descriptions of design, weave, neck embellishments..." />
                    </div>

                    <div>
                      <label className="block text-brand-taupe mb-1">Category Category *</label>
                      <select value={formCat} onChange={e => setFormCat(e.target.value)} className="w-full bg-white/40 border border-white/20 rounded-lg p-2.5 focus:outline-none focus:border-brand-dusty text-brand-charcoal">
                        {categoriesList.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-brand-taupe mb-1">SKU identifier *</label>
                      <input type="text" required value={formSku} onChange={e => setFormSku(e.target.value)} className="w-full bg-white/40 border border-white/20 rounded-lg p-2.5 focus:outline-none focus:border-brand-dusty text-brand-charcoal" />
                    </div>

                    <div>
                      <label className="block text-brand-taupe mb-1">Retail Price (₹) *</label>
                      <input type="number" required value={formPrice} onChange={e => setFormPrice(Number(e.target.value))} className="w-full bg-white/40 border border-white/20 rounded-lg p-2.5 focus:outline-none focus:border-brand-dusty text-brand-charcoal" />
                    </div>

                    <div>
                      <label className="block text-brand-taupe mb-1">Sale Discount Price (₹ - Optional)</label>
                      <input type="number" value={formSalePrice} onChange={e => setFormSalePrice(Number(e.target.value))} className="w-full bg-white/40 border border-white/20 rounded-lg p-2.5 focus:outline-none focus:border-brand-dusty text-brand-charcoal" />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-brand-taupe mb-1">Premium Product Image URL *</label>
                      <input type="text" required value={formImage} onChange={e => setFormImage(e.target.value)} className="w-full bg-white/40 border border-white/20 rounded-lg p-2.5 focus:outline-none focus:border-brand-dusty text-brand-charcoal" />
                    </div>

                    <div>
                      <label className="block text-brand-taupe mb-1">Fabric details *</label>
                      <input type="text" required value={formFabric} onChange={e => setFormFabric(e.target.value)} className="w-full bg-white/40 border border-white/20 rounded-lg p-2.5 focus:outline-none focus:border-brand-dusty text-brand-charcoal" placeholder="e.g. 100% Chanderi Silk with organza border" />
                    </div>

                    <div>
                      <label className="block text-brand-taupe mb-1">Stock Level *</label>
                      <input type="number" required value={formStock} onChange={e => setFormStock(Number(e.target.value))} className="w-full bg-white/40 border border-white/20 rounded-lg p-2.5 focus:outline-none focus:border-brand-dusty text-brand-charcoal" />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-brand-taupe mb-1">Care & Wash Instructions *</label>
                      <input type="text" required value={formCare} onChange={e => setFormCare(e.target.value)} className="w-full bg-white/40 border border-white/20 rounded-lg p-2.5 focus:outline-none focus:border-brand-dusty text-brand-charcoal" placeholder="Dry clean only" />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setShowProductForm(false)}
                      className="border border-white/15 rounded-full px-4 py-2 text-brand-taupe hover:bg-white/20 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-brand-charcoal hover:bg-brand-dusty text-white px-5 py-2 rounded-full font-medium tracking-wider uppercase flex items-center space-x-1 transition-luxury"
                    >
                      <Save className="w-4 h-4" />
                      <span>{editingProduct ? 'Save Edits' : 'Launch Item'}</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="overflow-x-auto border border-white/10 rounded-luxury bg-white/20 backdrop-blur-sm overflow-hidden shadow-sm" id="products-table-container">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-white/30 text-brand-taupe font-sans tracking-wider uppercase text-[10px] border-b border-white/10">
                        <th className="py-3.5 px-4">Apparel</th>
                        <th className="py-3.5 px-4">Category</th>
                        <th className="py-3.5 px-4">SKU</th>
                        <th className="py-3.5 px-4 text-right">Price</th>
                        <th className="py-3.5 px-4 text-center">Stock</th>
                        <th className="py-3.5 px-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 font-sans text-brand-charcoal" id="admin-products-table-body">
                      {products.map((p) => (
                        <tr key={p.id} className="hover:bg-brand-rose/25 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-3">
                              <img src={p.images[0]} alt={p.name} className="w-9 h-11 object-cover rounded-xl border border-white/10" />
                              <div>
                                <span className="font-serif font-semibold text-sm block">{p.name}</span>
                                <span className="text-[10px] font-mono text-brand-taupe">{p.fabric}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-brand-taupe">{p.category}</td>
                          <td className="py-3 px-4 font-mono">{p.sku}</td>
                          <td className="py-3 px-4 text-right font-mono font-medium">₹{p.price.toLocaleString()}</td>
                          <td className="py-3 px-4 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                              p.stock <= 5 ? 'bg-amber-100/80 text-amber-800 font-bold' : 'bg-white/20 text-brand-taupe'
                            }`}>
                              {p.stock}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center space-x-1">
                              <button
                                onClick={() => handleOpenEditProduct(p)}
                                className="p-1.5 rounded-lg border border-white/15 text-brand-taupe hover:bg-white/30 hover:text-brand-dusty transition-colors"
                                title="Edit Item"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm('Are you absolutely sure you want to remove this garment from the boutique catalog?')) {
                                    onDeleteProduct(p.id);
                                  }
                                }}
                                className="p-1.5 rounded-lg border border-white/15 text-brand-taupe hover:bg-red-50/50 hover:text-red-600 transition-colors"
                                title="Delete Item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ORDER FULFILLMENT MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-6 animate-fadeIn" id="admin-orders-view">
              <div className="border-b border-white/10 pb-3 flex justify-between items-center">
                <h3 className="font-serif text-lg font-bold text-brand-charcoal">Client Order Fullfillments</h3>
                <span className="text-xs font-mono text-brand-taupe">{orders.length} transaction logs</span>
              </div>

              <div className="overflow-x-auto border border-white/10 rounded-luxury bg-white/20 backdrop-blur-sm overflow-hidden shadow-sm" id="orders-table-container">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-white/30 text-brand-taupe font-sans tracking-wider uppercase text-[10px] border-b border-white/10">
                      <th className="py-3.5 px-4">Order Details</th>
                      <th className="py-3.5 px-4">Customer</th>
                      <th className="py-3.5 px-4 text-right">Revenue</th>
                      <th className="py-3.5 px-4 text-center">Fulfillment Status</th>
                      <th className="py-3.5 px-4 text-center">Payment Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 font-sans text-brand-charcoal" id="admin-orders-table-body">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-brand-rose/25 transition-colors">
                        <td className="py-3.5 px-4 font-mono">
                          <span className="font-semibold block">#{o.id}</span>
                          <span className="text-[10px] text-brand-taupe">{new Date(o.date).toLocaleDateString()}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-medium block">{o.customerName}</span>
                          <span className="text-[10px] text-brand-taupe">{o.customerEmail}</span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-semibold text-brand-dusty">
                          ₹{o.total.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <select
                             value={o.status}
                             onChange={(e) => onUpdateOrderStatus(o.id, e.target.value as Order['status'])}
                             className="bg-white/40 border border-white/15 rounded-lg px-2.5 py-1 text-[11px] font-sans focus:outline-none focus:border-brand-dusty text-brand-charcoal font-medium"
                          >
                            <option value="Pending">Pending Approval</option>
                            <option value="Processing">Atelier Processing</option>
                            <option value="Shipped">Dispatched / Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Returned">Returned / Refunded</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] tracking-wider font-semibold font-sans uppercase ${
                            o.paymentStatus === 'Paid'
                              ? 'bg-emerald-100/80 text-emerald-800'
                              : o.paymentStatus === 'Refunded'
                              ? 'bg-amber-100/80 text-amber-800'
                              : 'bg-rose-100/80 text-rose-800'
                          }`}>
                            {o.paymentStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: COUPONS & PROMOS COORDINATOR */}
          {activeTab === 'coupons' && (
            <div className="space-y-6 animate-fadeIn" id="admin-coupons-view">
              <div className="border-b border-white/10 pb-3 flex justify-between items-center">
                <h3 className="font-serif text-lg font-bold text-brand-charcoal">Promo Coupon Management</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8" id="coupons-split-workspace">
                
                {/* Left Form: Create new coupon */}
                <div className="md:col-span-1 glass-panel backdrop-blur-md p-5 rounded-luxury border border-white/20 shadow-sm h-fit">
                  <h4 className="font-serif font-semibold text-brand-charcoal border-b border-white/10 pb-2 mb-4">Generate Coupon</h4>
                  <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-brand-taupe mb-1">Coupon Code *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. FESTIVE25"
                        value={couponCode}
                        onChange={e => setCouponCode(e.target.value)}
                        className="w-full bg-white/40 border border-white/20 rounded-lg p-2.5 focus:outline-none focus:border-brand-dusty text-brand-charcoal font-mono text-center uppercase"
                      />
                    </div>

                    <div>
                      <label className="block text-brand-taupe mb-1">Discount Mode *</label>
                      <select
                        value={couponType}
                        onChange={e => setCouponType(e.target.value as 'percent' | 'fixed')}
                        className="w-full bg-white/40 border border-white/20 rounded-lg p-2.5 focus:outline-none focus:border-brand-dusty text-brand-charcoal"
                      >
                        <option value="percent">Percentage Off (%)</option>
                        <option value="fixed">Fixed Cash Off (₹)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-brand-taupe mb-1">Discount Value *</label>
                      <input
                        type="number"
                        required
                        value={couponValue}
                        onChange={e => setCouponValue(Number(e.target.value))}
                        className="w-full bg-white/40 border border-white/20 rounded-lg p-2.5 focus:outline-none focus:border-brand-dusty text-brand-charcoal"
                      />
                    </div>

                    <div>
                      <label className="block text-brand-taupe mb-1">Min Order Threshold (₹) *</label>
                      <input
                        type="number"
                        required
                        value={couponMin}
                        onChange={e => setCouponMin(Number(e.target.value))}
                        className="w-full bg-white/40 border border-white/20 rounded-lg p-2.5 focus:outline-none focus:border-brand-dusty text-brand-charcoal"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-brand-charcoal hover:bg-brand-dusty text-white py-2.5 rounded-full tracking-widest uppercase font-sans font-semibold transition-luxury mt-2"
                    >
                      Issue Coupon
                    </button>
                  </form>
                </div>

                {/* Right Table: Active coupons catalog */}
                <div className="md:col-span-2 space-y-4">
                  <h4 className="font-serif text-sm font-semibold text-brand-charcoal border-b border-white/10 pb-1">Issued Coupons Directory</h4>
                  <div className="border border-white/10 rounded-luxury bg-white/20 backdrop-blur-sm overflow-hidden shadow-sm" id="coupons-table-container">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-white/30 text-brand-taupe font-sans tracking-wider uppercase text-[10px] border-b border-white/10">
                          <th className="py-3 px-4">Coupon Code</th>
                          <th className="py-3 px-4 text-center">Benefit</th>
                          <th className="py-3 px-4 text-center">Min Order Required</th>
                          <th className="py-3 px-4 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10 font-sans text-brand-charcoal" id="admin-coupons-table-body">
                        {coupons.map((c) => (
                          <tr key={c.code} className="hover:bg-brand-rose/25 transition-colors">
                            <td className="py-3 px-4 font-mono font-bold text-brand-dusty">{c.code}</td>
                            <td className="py-3 px-4 text-center font-mono">
                              {c.discountType === 'percent' ? `${c.value}% Off` : `₹${c.value} Off`}
                            </td>
                            <td className="py-3 px-4 text-center font-mono">₹{c.minOrderValue.toLocaleString()}</td>
                            <td className="py-3 px-4 text-center">
                              <button
                                onClick={() => onToggleCoupon(c.code)}
                                className={`px-2.5 py-0.5 rounded-full text-[10px] tracking-wider font-semibold font-sans uppercase ${
                                  c.active
                                    ? 'bg-emerald-100/80 text-emerald-800'
                                    : 'bg-white/20 text-brand-taupe/60 border border-white/10'
                                }`}
                              >
                                {c.active ? 'Active' : 'Disabled'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
