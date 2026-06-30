/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Package, MapPin, User, Compass, Award, ShieldAlert, CheckCircle2, Truck, RefreshCw, Wallet } from 'lucide-react';
import { Order, Address } from '../types';

interface UserDashboardProps {
  orders: Order[];
  addresses: Address[];
  onAddAddress: (address: Address) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
}

export default function UserDashboard({
  orders,
  addresses,
  onAddAddress,
  onUpdateOrderStatus,
}: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'profile'>('orders');
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  
  // Wallet simulation state
  const [walletBalance, setWalletBalance] = useState(1500);

  // Address form states
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newLine1, setNewLine1] = useState('');
  const [newLine2, setNewLine2] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newPostalCode, setNewPostalCode] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newLine1 || !newCity || !newPostalCode || !newPhone) return;

    onAddAddress({
      name: newName,
      line1: newLine1,
      line2: newLine2,
      city: newCity,
      state: newState,
      postalCode: newPostalCode,
      country: 'India',
      phone: newPhone
    });

    // Reset Form
    setNewName('');
    setNewLine1('');
    setNewLine2('');
    setNewCity('');
    setNewState('');
    setNewPostalCode('');
    setNewPhone('');
    setShowAddressForm(false);
  };

  const handleReturnRequest = (order: Order) => {
    // Mark as Returned
    onUpdateOrderStatus(order.id, 'Returned');
    // Credit wallet balance as refund simulator
    setWalletBalance(prev => prev + order.total);
    alert(`Return request accepted! A refund of ₹${order.total.toLocaleString()} has been credited to your ANANTAMAA Luxury Wallet.`);
  };

  const trackingSteps = [
    { label: 'Order Placed', status: 'Pending', desc: 'We have received your reservation.' },
    { label: 'Atelier Processing', status: 'Processing', desc: 'Craftsmen are hand-finishing your garments.' },
    { label: 'Dispatched', status: 'Shipped', desc: 'Your luxury parcel is in transit via Blue Dart.' },
    { label: 'Delivered', status: 'Delivered', desc: 'Completed. Wear with pride and elegance.' }
  ];

  const getStepIndex = (status: Order['status']) => {
    if (status === 'Pending') return 0;
    if (status === 'Processing') return 1;
    if (status === 'Shipped') return 2;
    if (status === 'Delivered') return 3;
    return -1; // Returned
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8" id="user-dashboard-wrapper">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* 1. Left Sidebar Profile Overview Card */}
        <div className="md:col-span-1 glass-panel backdrop-blur-md rounded-luxury p-6 border border-white/20 shadow-sm" id="profile-summary-card">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-brand-rose/35 border border-brand-dusty flex items-center justify-center font-serif text-2xl text-brand-dusty font-bold shadow-inner">
              J
            </div>
            <div>
              <h3 className="font-serif text-base font-semibold text-brand-charcoal">Jaina Aadita</h3>
              <p className="text-xs text-brand-taupe font-mono">jainaadiitamanna@gmail.com</p>
            </div>
          </div>

          {/* Luxury Loyalty rewards tier info */}
          <div className="mt-6 pt-6 border-t border-white/10 space-y-4" id="loyalty-tier-widget">
            <div className="flex items-center justify-between text-xs">
              <span className="text-brand-taupe flex items-center space-x-1">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span>Loyalty Tier:</span>
              </span>
              <span className="font-semibold text-amber-500 uppercase tracking-wider font-mono">Silver Elite</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-brand-taupe flex items-center space-x-1">
                <Compass className="w-3.5 h-3.5 text-brand-dusty" />
                <span>Rewards Points:</span>
              </span>
              <span className="font-mono font-semibold text-brand-charcoal">550 Points</span>
            </div>
            <div className="flex items-center justify-between text-xs bg-brand-rose/25 p-2.5 rounded-xl border border-white/10">
              <span className="text-brand-taupe flex items-center space-x-1.5">
                <Wallet className="w-4 h-4 text-brand-dusty" />
                <span className="font-sans font-medium">Atelier Wallet:</span>
              </span>
              <span className="font-mono font-bold text-brand-dusty">₹{walletBalance.toLocaleString()}</span>
            </div>
          </div>

          {/* Quick tab filters */}
          <div className="mt-8 flex flex-col space-y-2 text-xs uppercase tracking-widest font-sans font-medium" id="dashboard-tab-buttons">
            <button
              onClick={() => { setActiveTab('orders'); setTrackingOrder(null); }}
              className={`text-left p-3 rounded-xl transition-luxury flex items-center space-x-2.5 ${
                activeTab === 'orders' ? 'bg-brand-dusty text-white shadow-md' : 'text-brand-charcoal hover:bg-brand-rose/25'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>My Orders ({orders.length})</span>
            </button>
            <button
              onClick={() => { setActiveTab('addresses'); setTrackingOrder(null); }}
              className={`text-left p-3 rounded-xl transition-luxury flex items-center space-x-2.5 ${
                activeTab === 'addresses' ? 'bg-brand-dusty text-white shadow-md' : 'text-brand-charcoal hover:bg-brand-rose/25'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Saved Addresses</span>
            </button>
            <button
              onClick={() => { setActiveTab('profile'); setTrackingOrder(null); }}
              className={`text-left p-3 rounded-xl transition-luxury flex items-center space-x-2.5 ${
                activeTab === 'profile' ? 'bg-brand-dusty text-white shadow-md' : 'text-brand-charcoal hover:bg-brand-rose/25'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Account Profile</span>
            </button>
          </div>
        </div>

        {/* 2. Main Tab Context Windows */}
        <div className="md:col-span-3 glass-panel backdrop-blur-md rounded-luxury p-6 border border-white/20 shadow-sm" id="dashboard-content-screen">
          
          {/* TRACKING MODULE SUB-VIEW */}
          {trackingOrder ? (
            <div className="space-y-6 animate-fadeIn" id="order-tracking-subview">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <button onClick={() => setTrackingOrder(null)} className="text-xs text-brand-dusty hover:underline uppercase tracking-wider font-semibold font-sans mb-1">
                    ← Back to Orders
                  </button>
                  <h3 className="font-serif text-lg font-semibold text-brand-charcoal">Track Order #{trackingOrder.id}</h3>
                </div>
                <span className="px-3 py-1 bg-brand-rose/30 rounded-full text-xs font-mono text-brand-charcoal">
                  {trackingOrder.status}
                </span>
              </div>

              {/* Milestones timeline vertical progress */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative py-4" id="tracking-timeline-grid">
                <div className="hidden md:block absolute top-[28px] left-[12%] right-[12%] h-0.5 bg-white/10 z-0" />
                
                {trackingSteps.map((step, index) => {
                  const activeIdx = getStepIndex(trackingOrder.status);
                  const isCompleted = index <= activeIdx;
                  const isCurrent = index === activeIdx;

                  return (
                    <div key={index} className="flex flex-col items-center text-center relative z-10" id={`tracking-step-${index}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-luxury ${
                        isCurrent
                          ? 'bg-brand-dusty text-white ring-4 ring-brand-rose/40'
                          : isCompleted
                          ? 'bg-brand-dusty text-white'
                          : 'bg-white/20 text-brand-taupe/50 border-2 border-white/10'
                      }`}>
                        {index === 0 && <Package className="w-4.5 h-4.5" />}
                        {index === 1 && <RefreshCw className="w-4.5 h-4.5" />}
                        {index === 2 && <Truck className="w-4.5 h-4.5" />}
                        {index === 3 && <CheckCircle2 className="w-4.5 h-4.5" />}
                      </div>
                      <h4 className={`text-xs font-serif font-semibold mt-3 ${isCompleted ? 'text-brand-charcoal' : 'text-brand-taupe/50'}`}>
                        {step.label}
                      </h4>
                      <p className="text-[10px] text-brand-taupe leading-relaxed mt-1 px-2 font-light">
                        {step.desc}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Courier and Details Card */}
              <div className="p-4 glass-panel bg-white/20 rounded-2xl border border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs" id="tracking-summary-card">
                <div>
                  <h4 className="font-serif font-semibold text-brand-charcoal mb-1">Parcel Information:</h4>
                  <p className="text-brand-taupe leading-relaxed">
                    Carrier: <span className="font-mono text-brand-charcoal">Blue Dart Express Premium</span><br />
                    Tracking ID: <span className="font-mono text-brand-charcoal">{trackingOrder.trackingNumber || 'AN-BD-9827361'}</span><br />
                    Est. Delivery: <span className="text-brand-charcoal">{trackingOrder.items[0]?.product.estimatedDelivery || '3-5 Days'}</span>
                  </p>
                </div>
                <div>
                  <h4 className="font-serif font-semibold text-brand-charcoal mb-1">Destination Address:</h4>
                  <p className="text-brand-taupe leading-relaxed">
                    {trackingOrder.shippingAddress.name}<br />
                    {trackingOrder.shippingAddress.line1}, {trackingOrder.shippingAddress.line2 || ''}<br />
                    {trackingOrder.shippingAddress.city}, {trackingOrder.shippingAddress.state} - {trackingOrder.shippingAddress.postalCode}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* ORDERS TAB VIEW */}
              {activeTab === 'orders' && (
                <div className="space-y-6" id="dashboard-orders-tab">
                  <div className="border-b border-white/10 pb-3 flex justify-between items-center">
                    <h3 className="font-serif text-lg font-semibold text-brand-charcoal">Past Purchase Orders</h3>
                    <span className="text-xs font-mono text-brand-taupe">{orders.length} order(s) registered</span>
                  </div>

                  {orders.length === 0 ? (
                    <div className="py-12 text-center text-brand-taupe space-y-3" id="orders-empty-state">
                      <Package className="w-12 h-12 text-brand-taupe/40 mx-auto" />
                      <p className="text-sm italic">You have not reserved any luxury items yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-4" id="orders-list-grid">
                      {orders.map((order) => (
                        <div key={order.id} className="border border-white/10 rounded-luxury overflow-hidden shadow-sm hover:shadow-md transition-luxury bg-white/30 backdrop-blur-sm">
                          {/* Order Card Head */}
                          <div className="bg-white/30 px-4 py-3 border-b border-white/10 flex flex-wrap justify-between items-center text-xs">
                            <div className="flex space-x-4">
                              <div>
                                <span className="text-brand-taupe font-light">Ordered on:</span>
                                <p className="font-mono font-medium text-brand-charcoal">{new Date(order.date).toLocaleDateString()}</p>
                              </div>
                              <div>
                                <span className="text-brand-taupe font-light">Order Number:</span>
                                <p className="font-mono font-medium text-brand-charcoal">#{order.id}</p>
                              </div>
                              <div>
                                <span className="text-brand-taupe font-light">Total Price:</span>
                                <p className="font-mono font-semibold text-brand-dusty">₹{order.total.toLocaleString()}</p>
                              </div>
                            </div>
                            {/* status pill */}
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] tracking-widest uppercase font-semibold font-sans ${
                              order.status === 'Delivered'
                                ? 'bg-emerald-100/80 text-emerald-800'
                                : order.status === 'Returned'
                                ? 'bg-amber-100/80 text-amber-800 border border-amber-300/40'
                                : 'bg-brand-rose/30 text-brand-dusty'
                            }`}>
                              {order.status}
                            </span>
                          </div>

                          {/* Order Card Items List */}
                          <div className="p-4 space-y-3">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center space-x-4">
                                <img src={item.product.images[0]} alt={item.product.name} className="w-11 h-14 object-cover rounded-xl border border-white/10" />
                                <div className="flex-1 text-xs">
                                  <h4 className="font-serif font-semibold text-brand-charcoal">{item.product.name}</h4>
                                  <p className="text-brand-taupe">
                                    Size: <span className="font-mono text-brand-charcoal">{item.selectedSize}</span> | Color: <span className="text-brand-charcoal">{item.selectedColor}</span> | Qty: <span className="font-mono text-brand-charcoal">{item.quantity}</span>
                                  </p>
                                </div>
                                <span className="text-xs font-mono text-brand-charcoal">₹{item.product.price.toLocaleString()}</span>
                              </div>
                            ))}
                          </div>

                          {/* Card Actions Toolbar */}
                          <div className="px-4 py-3 bg-white/15 border-t border-white/10 flex justify-end space-x-2 text-xs">
                            {order.status !== 'Returned' && (
                              <button
                                onClick={() => setTrackingOrder(order)}
                                className="px-3.5 py-1.5 border border-white/15 rounded-full text-brand-taupe hover:bg-brand-rose/20 transition-colors uppercase tracking-widest text-[9px] font-semibold"
                              >
                                Track Package
                              </button>
                            )}
                            
                            {/* Return Simulator Trigger for Delivered pieces */}
                            {order.status === 'Delivered' && (
                              <button
                                onClick={() => handleReturnRequest(order)}
                                className="px-3.5 py-1.5 border border-brand-dusty/20 bg-brand-rose/25 rounded-full text-brand-dusty hover:bg-brand-rose/40 transition-colors uppercase tracking-widest text-[9px] font-bold flex items-center space-x-1"
                              >
                                <RefreshCw className="w-3 h-3" />
                                <span>Request Return / Refund</span>
                              </button>
                            )}

                            {order.status === 'Returned' && (
                              <div className="flex items-center space-x-1.5 text-amber-800 text-[10px] tracking-wide font-sans uppercase font-semibold bg-amber-50/50 px-3 py-1.5 rounded-full border border-amber-200">
                                <ShieldAlert className="w-3.5 h-3.5" />
                                <span>Refund Credited to Wallet</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ADDRESSES TAB VIEW */}
              {activeTab === 'addresses' && (
                <div className="space-y-6" id="dashboard-addresses-tab">
                  <div className="border-b border-white/10 pb-3 flex justify-between items-center">
                    <h3 className="font-serif text-lg font-semibold text-brand-charcoal">Saved Atelier Addresses</h3>
                    <button
                      onClick={() => setShowAddressForm(prev => !prev)}
                      className="text-xs bg-brand-charcoal hover:bg-brand-dusty text-white px-3.5 py-1.5 rounded-full uppercase tracking-wider font-semibold font-sans transition-luxury"
                      id="toggle-add-address-btn"
                    >
                      {showAddressForm ? 'Cancel' : '+ Add Address'}
                    </button>
                  </div>

                  {/* Add Address Form Accordion */}
                  {showAddressForm && (
                    <form onSubmit={handleAddressSubmit} className="glass-panel backdrop-blur-md p-5 rounded-luxury border border-white/20 space-y-4 text-xs animate-slideDown shadow-sm" id="add-address-form">
                      <h4 className="font-serif font-semibold text-brand-charcoal border-b border-white/10 pb-1.5">New Delivery Address</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-brand-taupe mb-1">Full Name *</label>
                          <input type="text" required value={newName} onChange={e => setNewName(e.target.value)} className="w-full bg-white/40 border border-white/20 rounded-lg p-2.5 focus:outline-none focus:border-brand-dusty text-brand-charcoal" />
                        </div>
                        <div>
                          <label className="block text-brand-taupe mb-1">Phone Number *</label>
                          <input type="tel" required value={newPhone} onChange={e => setNewPhone(e.target.value)} className="w-full bg-white/40 border border-white/20 rounded-lg p-2.5 focus:outline-none focus:border-brand-dusty text-brand-charcoal" />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-brand-taupe mb-1">Address Line 1 *</label>
                          <input type="text" required value={newLine1} onChange={e => setNewLine1(e.target.value)} className="w-full bg-white/40 border border-white/20 rounded-lg p-2.5 focus:outline-none focus:border-brand-dusty text-brand-charcoal" placeholder="Street name, flat, villa number" />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-brand-taupe mb-1">Address Line 2 (Optional)</label>
                          <input type="text" value={newLine2} onChange={e => setNewLine2(e.target.value)} className="w-full bg-white/40 border border-white/20 rounded-lg p-2.5 focus:outline-none focus:border-brand-dusty text-brand-charcoal" placeholder="Apartment, suite, landmark" />
                        </div>
                        <div>
                          <label className="block text-brand-taupe mb-1">City *</label>
                          <input type="text" required value={newCity} onChange={e => setNewCity(e.target.value)} className="w-full bg-white/40 border border-white/20 rounded-lg p-2.5 focus:outline-none focus:border-brand-dusty text-brand-charcoal" />
                        </div>
                        <div>
                          <label className="block text-brand-taupe mb-1">State / Province *</label>
                          <input type="text" required value={newState} onChange={e => setNewState(e.target.value)} className="w-full bg-white/40 border border-white/20 rounded-lg p-2.5 focus:outline-none focus:border-brand-dusty text-brand-charcoal" />
                        </div>
                        <div>
                          <label className="block text-brand-taupe mb-1">Postal Code (PIN) *</label>
                          <input type="text" required value={newPostalCode} onChange={e => setNewPostalCode(e.target.value)} className="w-full bg-white/40 border border-white/20 rounded-lg p-2.5 focus:outline-none focus:border-brand-dusty text-brand-charcoal" />
                        </div>
                        <div>
                          <label className="block text-brand-taupe mb-1">Country</label>
                          <input type="text" disabled value="India" className="w-full bg-white/20 border border-white/10 rounded-lg p-2.5 text-brand-taupe" />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2 pt-2">
                        <button type="submit" className="bg-brand-charcoal hover:bg-brand-dusty text-white px-5 py-2.5 rounded-full font-medium tracking-wider uppercase transition-luxury">
                          Save Address
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Address List Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="address-cards-grid">
                    {addresses.map((addr, index) => (
                      <div key={index} className="border border-white/15 bg-white/20 backdrop-blur-sm p-4 rounded-luxury flex flex-col justify-between shadow-sm hover:border-brand-dusty/40 transition-luxury">
                        <div className="text-xs space-y-1">
                          <div className="flex items-center space-x-2 text-brand-dusty font-sans font-semibold tracking-wider uppercase text-[10px] mb-2">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{index === 0 ? 'Primary Address' : `Address #${index + 1}`}</span>
                          </div>
                          <p className="font-serif font-semibold text-brand-charcoal">{addr.name}</p>
                          <p className="text-brand-taupe leading-relaxed">
                            {addr.line1}<br />
                            {addr.line2 && `${addr.line2}, `}{addr.city}, {addr.state} - {addr.postalCode}<br />
                            Country: {addr.country}
                          </p>
                          <p className="text-brand-taupe/80 font-mono mt-1">Phone: {addr.phone}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ACCOUNT PROFILE VIEW */}
              {activeTab === 'profile' && (
                <div className="space-y-6" id="dashboard-profile-tab">
                  <div className="border-b border-white/10 pb-3">
                    <h3 className="font-serif text-lg font-semibold text-brand-charcoal">Profile Preferences</h3>
                  </div>

                  <div className="space-y-4 text-xs" id="profile-details-form">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="block text-brand-taupe mb-1 font-sans">First Name:</span>
                        <input type="text" disabled value="Jaina" className="w-full bg-white/20 border border-white/10 rounded-lg p-2.5 text-brand-charcoal" />
                      </div>
                      <div>
                        <span className="block text-brand-taupe mb-1 font-sans">Last Name:</span>
                        <input type="text" disabled value="Aadita" className="w-full bg-white/20 border border-white/10 rounded-lg p-2.5 text-brand-charcoal" />
                      </div>
                      <div>
                        <span className="block text-brand-taupe mb-1 font-sans">Email Address:</span>
                        <input type="email" disabled value="jainaadiitamanna@gmail.com" className="w-full bg-white/20 border border-white/10 rounded-lg p-2.5 text-brand-charcoal" />
                      </div>
                      <div>
                        <span className="block text-brand-taupe mb-1 font-sans">Preferred Currency:</span>
                        <input type="text" disabled value="INR (₹)" className="w-full bg-white/20 border border-white/10 rounded-lg p-2.5 text-brand-charcoal" />
                      </div>
                    </div>

                    <div className="glass-panel backdrop-blur-md border border-white/20 p-4 rounded-luxury text-[11px] leading-relaxed text-brand-charcoal flex space-x-2 shadow-sm">
                      <ShieldAlert className="w-4 h-4 shrink-0 text-brand-dusty" />
                      <p>
                        <strong>Security Note:</strong> Account parameters and credentials are managed directly by Google AI Studio authentication servers. To edit or configure multi-factor login preferences, please access the main secure settings dashboard.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

        </div>

      </div>
    </div>
  );
}
