/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Ruler } from 'lucide-react';

interface SizeGuideProps {
  onClose: () => void;
}

export default function SizeGuide({ onClose }: SizeGuideProps) {
  const [unit, setUnit] = useState<'inches' | 'cm'>('inches');

  const sizeChartData = [
    { size: 'S', india: '36', bust: { in: '34-35', cm: '86-89' }, waist: { in: '27-28', cm: '68-71' }, hips: { in: '37-38', cm: '94-97' } },
    { size: 'M', india: '38', bust: { in: '36-37', cm: '91-94' }, waist: { in: '29-30', cm: '73-76' }, hips: { in: '39-40', cm: '99-102' } },
    { size: 'L', india: '40', bust: { in: '38-40', cm: '96-101' }, waist: { in: '31-33', cm: '78-84' }, hips: { in: '41-43', cm: '104-109' } },
    { size: 'XL', india: '42', bust: { in: '41-43', cm: '104-109' }, waist: { in: '34-36', cm: '86-91' }, hips: { in: '44-46', cm: '111-117' } },
    { size: 'XXL', india: '44', bust: { in: '44-46', cm: '111-117' }, waist: { in: '37-39', cm: '94-99' }, hips: { in: '47-49', cm: '119-124' } },
  ];

  return (
    <div className="fixed inset-0 bg-brand-charcoal/40 backdrop-blur-md z-50 flex items-center justify-center p-4" id="size-guide-modal-overlay">
      <div className="glass-panel backdrop-blur-xl rounded-luxury w-full max-w-xl shadow-2xl overflow-hidden animate-scaleIn border border-white/20" id="size-guide-box">
        {/* Header */}
        <div className="bg-brand-charcoal text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Ruler className="w-4 h-4 text-brand-dusty" />
            <h3 className="font-serif text-sm tracking-wider uppercase font-semibold">ANANTAMAA Size Guide</h3>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white p-1" id="close-size-guide-btn">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-xs text-brand-taupe font-medium">Select your preferred measurement unit:</p>
            {/* Unit Toggles */}
            <div className="flex bg-white/20 border border-white/10 p-1 rounded-lg text-[10px] font-sans tracking-wider font-semibold uppercase">
              <button
                onClick={() => setUnit('inches')}
                className={`px-3 py-1 rounded-md transition-luxury ${
                  unit === 'inches' ? 'bg-brand-dusty text-white shadow-sm' : 'text-brand-taupe'
                }`}
              >
                Inches
              </button>
              <button
                onClick={() => setUnit('cm')}
                className={`px-3 py-1 rounded-md transition-luxury ${
                  unit === 'cm' ? 'bg-brand-dusty text-white shadow-sm' : 'text-brand-taupe'
                }`}
              >
                Centimeters
              </button>
            </div>
          </div>

          {/* Sizing Matrix Table */}
          <div className="overflow-x-auto border border-white/10 rounded-2xl" id="sizing-table-container">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-white/20 text-brand-taupe font-sans tracking-wider uppercase text-[9px] border-b border-white/10">
                  <th className="py-3 px-4 font-semibold">ANANTAMAA Size</th>
                  <th className="py-3 px-4 font-semibold">India Size</th>
                  <th className="py-3 px-4 font-semibold">Bust</th>
                  <th className="py-3 px-4 font-semibold">Waist</th>
                  <th className="py-3 px-4 font-semibold">Hips</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 font-mono text-brand-charcoal">
                {sizeChartData.map((row) => (
                   <tr key={row.size} className="hover:bg-brand-rose/25 transition-colors">
                     <td className="py-3.5 px-4 font-sans font-bold text-brand-dusty">{row.size}</td>
                    <td className="py-3.5 px-4">{row.india}</td>
                    <td className="py-3.5 px-4">{unit === 'inches' ? row.bust.in : row.bust.cm}</td>
                    <td className="py-3.5 px-4">{unit === 'inches' ? row.waist.in : row.waist.cm}</td>
                    <td className="py-3.5 px-4">{unit === 'inches' ? row.hips.in : row.hips.cm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Fitting Notes */}
          <div className="glass-panel bg-white/10 p-4 rounded-2xl border border-white/10 space-y-2 text-xs">
            <h4 className="font-serif font-medium text-brand-charcoal">Bespoke Measurement Tips:</h4>
            <ul className="list-disc list-inside space-y-1 text-brand-taupe font-light leading-relaxed">
              <li>Our straight-cut kurtis and co-ords generally offer a relaxed regular fit.</li>
              <li>If your chest/bust measurements fall between sizes, we strongly suggest selecting the larger size for ideal comfort and grace.</li>
              <li>Need custom tailored sizing? Contact our Atelier Support or consult our **AI Stylist** at any time.</li>
            </ul>
          </div>
        </div>

        {/* Action Button */}
        <div className="bg-white/10 border-t border-white/10 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-brand-charcoal hover:bg-brand-dusty text-white text-[11px] tracking-widest font-sans uppercase px-5 py-2.5 rounded-full font-medium transition-luxury"
            id="sizing-guide-done-btn"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}
