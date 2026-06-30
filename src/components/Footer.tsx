/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, ArrowRight, Instagram, Facebook, Phone, MapPin } from 'lucide-react';

interface FooterProps {
  setView: (view: string) => void;
}

export default function Footer({ setView }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-brand-charcoal text-white/90 pt-16 pb-8 border-t border-white/10 font-sans" id="anantamaa-footer">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 grid grid-cols-1 md:grid-cols-4 gap-12" id="footer-grid">
        {/* Column 1: Brand Story & Philosophy */}
        <div className="space-y-4" id="footer-col-story">
          <h2 className="font-serif text-2xl tracking-[0.2em] text-white uppercase font-semibold">ANANTAMAA</h2>
          <p className="text-xs text-white/60 leading-relaxed font-light">
            Representing timeless femininity, softness, grace, and modern Indian luxury. Inspiring modern silhouettes deeply rooted in the exquisite handblock prints, tussar silks, and delicate zari craftsmanship of Indian heritage.
          </p>
          <div className="flex items-center space-x-4 pt-2">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-brand-rose transition-colors p-1" aria-label="Instagram Page">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-brand-rose transition-colors p-1" aria-label="Facebook Page">
              <Facebook className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Column 2: Exquisite Collections Links */}
        <div className="space-y-4" id="footer-col-collections">
          <h3 className="font-sans text-xs tracking-[0.25em] text-white uppercase font-semibold border-b border-white/10 pb-2">Collections</h3>
          <ul className="space-y-2.5 text-xs font-light text-white/70">
            <li><button onClick={() => setView('shop?category=Pakistani%20Suits')} className="hover:text-brand-rose transition-colors">Pakistani Suits</button></li>
            <li><button onClick={() => setView('shop?category=Kurti%20Sets')} className="hover:text-brand-rose transition-colors">Silk Kurti Sets</button></li>
            <li><button onClick={() => setView('shop?category=Cotton%20Kurti%20Sets')} className="hover:text-brand-rose transition-colors">Cotton Kurti Sets</button></li>
            <li><button onClick={() => setView('shop?category=Co-ord%20Sets')} className="hover:text-brand-rose transition-colors">Co-ord Sets</button></li>
            <li><button onClick={() => setView('shop?tag=Luxury%20Collection')} className="hover:text-brand-rose transition-colors">Luxury Collection</button></li>
            <li><button onClick={() => setView('shop?tag=Summer%20Collection')} className="hover:text-brand-rose transition-colors">Summer Collection</button></li>
          </ul>
        </div>

        {/* Column 3: Customer Care & Policies */}
        <div className="space-y-4" id="footer-col-care">
          <h3 className="font-sans text-xs tracking-[0.25em] text-white uppercase font-semibold border-b border-white/10 pb-2">Customer Care</h3>
          <ul className="space-y-2.5 text-xs font-light text-white/70">
            <li><button onClick={() => setView('about')} className="hover:text-brand-rose transition-colors">Our Heritage</button></li>
            <li><button onClick={() => setView('faq')} className="hover:text-brand-rose transition-colors">FAQs & Size Guide</button></li>
            <li><button onClick={() => setView('shipping')} className="hover:text-brand-rose transition-colors">Shipping & Delivery</button></li>
            <li><button onClick={() => setView('returns')} className="hover:text-brand-rose transition-colors">Returns & Exchanges</button></li>
            <li><button onClick={() => setView('terms')} className="hover:text-brand-rose transition-colors">Terms of Service</button></li>
          </ul>
        </div>

        {/* Column 4: Newsletter & Contact */}
        <div className="space-y-4" id="footer-col-newsletter">
          <h3 className="font-sans text-xs tracking-[0.25em] text-white uppercase font-semibold border-b border-white/10 pb-2">The Newsletter</h3>
          <p className="text-xs text-white/60 leading-relaxed font-light">
            Subscribe to receive exclusive invitations to seasonal collection launches, limited editions, and bespoke stories.
          </p>

          {!subscribed ? (
            <form onSubmit={handleSubscribe} className="flex items-center border-b border-white/30 pb-2 pt-1" id="newsletter-form">
              <Mail className="w-4 h-4 text-white/40 mr-2.5" />
              <input
                type="email"
                placeholder="Enter your email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent text-xs text-white focus:outline-none placeholder-white/40 w-full font-sans"
                id="newsletter-email-field"
              />
              <button type="submit" className="text-white/60 hover:text-brand-rose transition-colors" aria-label="Submit newsletter">
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="bg-white/15 p-3 rounded-luxury text-xs text-brand-rose border border-brand-rose/25 text-center font-serif animate-fadeIn" id="newsletter-success">
              Welcome to the family of ANANTAMAA.
            </div>
          )}

          {/* Luxury Contact Info */}
          <div className="space-y-2 pt-4 text-xs font-light text-white/60" id="footer-contact-info">
            <div className="flex items-center space-x-2">
              <Phone className="w-3.5 h-3.5 text-brand-rose" />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-3.5 h-3.5 text-brand-rose" />
              <span>Colaba Atelier, Mumbai, India</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom copyright and systems */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] font-light text-white/40" id="footer-bottom">
        <p>© 2026 ANANTAMAA Luxury. All Rights Reserved.</p>
        <div className="flex space-x-4 mt-4 sm:mt-0 font-mono text-[9px] uppercase tracking-wider">
          <span>Crafted in India</span>
          <span>•</span>
          <span>Atelier Quality Standard</span>
          <span>•</span>
          <span>Security Guaranteed</span>
        </div>
      </div>
    </footer>
  );
}
