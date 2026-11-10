'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Ruler, Check, HelpCircle } from 'lucide-react';

export default function SizeGuidePage() {
  const [activeTab, setActiveTab] = useState<'men' | 'women' | 'kids'>('men');
  const [unit, setUnit] = useState<'inches' | 'cm'>('inches');

  return (
    <div className="bg-[#F7F4EE] text-stone-900 pb-20 space-y-12">
      {/* Header */}
      <section className="bg-[#E7DED0] border-b border-stone-200/80 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-[#242735]">
            <Ruler className="w-3.5 h-3.5 text-[#242735]" />
            Size Guide
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-black text-stone-900 tracking-tight">
            Official Size & Measurement Guide
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm font-light max-w-xl mx-auto leading-relaxed">
            Compare the measurements shown for each item before choosing a size. If you need help, contact us before ordering.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Tabs & Unit Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('men')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'men'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              Men&apos;s Shirts & Tops
            </button>
            <button
              onClick={() => setActiveTab('women')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'women'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              Women&apos;s Kurtis & Sets
            </button>
            <button
              onClick={() => setActiveTab('kids')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'kids'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              Kids (Boys & Girls)
            </button>
          </div>

          {/* Unit Toggle (Inches vs Centimeters) */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-full border border-stone-300 self-start sm:self-auto text-xs font-bold">
            <button
              onClick={() => setUnit('inches')}
              className={`px-3 py-1 rounded-full transition-all ${
                unit === 'inches' ? 'bg-[#242735] text-white shadow-2xs' : 'text-stone-600'
              }`}
            >
              Inches (in)
            </button>
            <button
              onClick={() => setUnit('cm')}
              className={`px-3 py-1 rounded-full transition-all ${
                unit === 'cm' ? 'bg-[#242735] text-white shadow-2xs' : 'text-stone-600'
              }`}
            >
              Centimeters (cm)
            </button>
          </div>
        </div>

        {/* Measurement Tables */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
          {activeTab === 'men' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-[#E7DED0] text-stone-900 uppercase font-serif text-[11px] border-b border-stone-200">
                  <tr>
                    <th className="py-3.5 px-4 font-bold">Size</th>
                    <th className="py-3.5 px-4 font-bold">Chest ({unit})</th>
                    <th className="py-3.5 px-4 font-bold">Length ({unit})</th>
                    <th className="py-3.5 px-4 font-bold">Shoulder ({unit})</th>
                    <th className="py-3.5 px-4 font-bold">Sleeve ({unit})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  <tr>
                    <td className="py-3.5 px-4 font-extrabold text-stone-900">S (Small)</td>
                    <td className="py-3.5 px-4">{unit === 'inches' ? '38"' : '96.5 cm'}</td>
                    <td className="py-3.5 px-4">{unit === 'inches' ? '28"' : '71 cm'}</td>
                    <td className="py-3.5 px-4">{unit === 'inches' ? '17.5"' : '44.5 cm'}</td>
                    <td className="py-3.5 px-4">{unit === 'inches' ? '24.5"' : '62 cm'}</td>
                  </tr>
                  <tr className="bg-stone-50/50">
                    <td className="py-3.5 px-4 font-extrabold text-stone-900">M (Medium)</td>
                    <td className="py-3.5 px-4">{unit === 'inches' ? '40"' : '101.6 cm'}</td>
                    <td className="py-3.5 px-4">{unit === 'inches' ? '29"' : '73.5 cm'}</td>
                    <td className="py-3.5 px-4">{unit === 'inches' ? '18"' : '46 cm'}</td>
                    <td className="py-3.5 px-4">{unit === 'inches' ? '25"' : '63.5 cm'}</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-extrabold text-stone-900">L (Large)</td>
                    <td className="py-3.5 px-4">{unit === 'inches' ? '42"' : '106.7 cm'}</td>
                    <td className="py-3.5 px-4">{unit === 'inches' ? '30"' : '76 cm'}</td>
                    <td className="py-3.5 px-4">{unit === 'inches' ? '18.75"' : '47.6 cm'}</td>
                    <td className="py-3.5 px-4">{unit === 'inches' ? '25.5"' : '65 cm'}</td>
                  </tr>
                  <tr className="bg-stone-50/50">
                    <td className="py-3.5 px-4 font-extrabold text-stone-900">XL (Extra Large)</td>
                    <td className="py-3.5 px-4">{unit === 'inches' ? '44"' : '111.8 cm'}</td>
                    <td className="py-3.5 px-4">{unit === 'inches' ? '31"' : '78.7 cm'}</td>
                    <td className="py-3.5 px-4">{unit === 'inches' ? '19.5"' : '49.5 cm'}</td>
                    <td className="py-3.5 px-4">{unit === 'inches' ? '26"' : '66 cm'}</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-extrabold text-stone-900">XXL (Double XL)</td>
                    <td className="py-3.5 px-4">{unit === 'inches' ? '46"' : '116.8 cm'}</td>
                    <td className="py-3.5 px-4">{unit === 'inches' ? '32"' : '81 cm'}</td>
                    <td className="py-3.5 px-4">{unit === 'inches' ? '20.25"' : '51.5 cm'}</td>
                    <td className="py-3.5 px-4">{unit === 'inches' ? '26.5"' : '67.3 cm'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'women' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-[#E7DED0] text-stone-900 uppercase font-serif text-[11px] border-b border-stone-200">
                  <tr>
                    <th className="py-3.5 px-4 font-bold">Standard Size</th>
                    <th className="py-3.5 px-4 font-bold">Bust ({unit})</th>
                    <th className="py-3.5 px-4 font-bold">Waist ({unit})</th>
                    <th className="py-3.5 px-4 font-bold">Hip ({unit})</th>
                    <th className="py-3.5 px-4 font-bold">Kurti Length ({unit})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  <tr>
                    <td className="py-3.5 px-4 font-extrabold text-stone-900">38 (Small)</td>
                    <td className="py-3.5 px-4">{unit === 'inches' ? '38"' : '96.5 cm'}</td>
                    <td className="py-3.5 px-4">{unit === 'inches' ? '34"' : '86.4 cm'}</td>
                    <td className="py-3.5 px-4">{unit === 'inches' ? '40"' : '101.6 cm'}</td>
                    <td className="py-3.5 px-4">{unit === 'inches' ? '42"' : '106.7 cm'}</td>
                  </tr>
                  <tr className="bg-stone-50/50">
                    <td className="py-3.5 px-4 font-extrabold text-stone-900">40 (Medium)</td>
                    <td className="py-3.5 px-4">{unit === 'inches' ? '40"' : '101.6 cm'}</td>
                    <td className="py-3.5 px-4">{unit === 'inches' ? '36"' : '91.4 cm'}</td>
                    <td className="py-3.5 px-4">{unit === 'inches' ? '42"' : '106.7 cm'}</td>
                    <td className="py-3.5 px-4">{unit === 'inches' ? '43"' : '109.2 cm'}</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-extrabold text-stone-900">42 (Large)</td>
                    <td className="py-3.5 px-4">{unit === 'inches' ? '42"' : '106.7 cm'}</td>
                    <td className="py-3.5 px-4">{unit === 'inches' ? '38"' : '96.5 cm'}</td>
                    <td className="py-3.5 px-4">{unit === 'inches' ? '44"' : '111.8 cm'}</td>
                    <td className="py-3.5 px-4">{unit === 'inches' ? '44"' : '111.8 cm'}</td>
                  </tr>
                  <tr className="bg-stone-50/50">
                    <td className="py-3.5 px-4 font-extrabold text-stone-900">44 (XL)</td>
                    <td className="py-3.5 px-4">{unit === 'inches' ? '44"' : '111.8 cm'}</td>
                    <td className="py-3.5 px-4">{unit === 'inches' ? '40"' : '101.6 cm'}</td>
                    <td className="py-3.5 px-4">{unit === 'inches' ? '46"' : '116.8 cm'}</td>
                    <td className="py-3.5 px-4">{unit === 'inches' ? '44"' : '111.8 cm'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'kids' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-[#E7DED0] text-stone-900 uppercase font-serif text-[11px] border-b border-stone-200">
                  <tr>
                    <th className="py-3.5 px-4 font-bold">Age Bracket</th>
                    <th className="py-3.5 px-4 font-bold">Height ({unit})</th>
                    <th className="py-3.5 px-4 font-bold">Chest ({unit})</th>
                    <th className="py-3.5 px-4 font-bold">Waist ({unit})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  <tr>
                    <td className="py-3.5 px-4 font-extrabold text-stone-900">4 - 5 Years</td>
                    <td className="py-3.5 px-4">{unit === 'inches' ? '40-43"' : '102-110 cm'}</td>
                    <td className="py-3.5 px-4">{unit === 'inches' ? '22-23"' : '56-58 cm'}</td>
                    <td className="py-3.5 px-4">{unit === 'inches' ? '21"' : '53 cm'}</td>
                  </tr>
                  <tr className="bg-stone-50/50">
                    <td className="py-3.5 px-4 font-extrabold text-stone-900">6 - 7 Years</td>
                    <td className="py-3.5 px-4">{unit === 'inches' ? '45-48"' : '114-122 cm'}</td>
                    <td className="py-3.5 px-4">{unit === 'inches' ? '24-25"' : '61-64 cm'}</td>
                    <td className="py-3.5 px-4">{unit === 'inches' ? '22"' : '56 cm'}</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-extrabold text-stone-900">8 - 9 Years</td>
                    <td className="py-3.5 px-4">{unit === 'inches' ? '50-53"' : '127-135 cm'}</td>
                    <td className="py-3.5 px-4">{unit === 'inches' ? '26-27"' : '66-69 cm'}</td>
                    <td className="py-3.5 px-4">{unit === 'inches' ? '23.5"' : '60 cm'}</td>
                  </tr>
                  <tr className="bg-stone-50/50">
                    <td className="py-3.5 px-4 font-extrabold text-stone-900">10 - 12 Years</td>
                    <td className="py-3.5 px-4">{unit === 'inches' ? '55-58"' : '140-148 cm'}</td>
                    <td className="py-3.5 px-4">{unit === 'inches' ? '28-30"' : '71-76 cm'}</td>
                    <td className="py-3.5 px-4">{unit === 'inches' ? '25"' : '64 cm'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* How to Measure Instructions */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
          <h3 className="text-base font-serif font-bold text-stone-900 flex items-center gap-2">
            <Ruler className="w-5 h-5 text-[#242735]" />
            How to Measure Correctly
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-stone-600 leading-relaxed">
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80">
              <strong className="text-stone-900 block font-semibold mb-1">1. Chest / Bust</strong>
              Measure around the fullest part of your chest, keeping the measuring tape horizontal and comfortably relaxed.
            </div>
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80">
              <strong className="text-stone-900 block font-semibold mb-1">2. Body Length</strong>
              Measure straight down from the highest point of the shoulder seam to the hem of the garment.
            </div>
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80">
              <strong className="text-stone-900 block font-semibold mb-1">3. Shoulder Width</strong>
              Measure across the back from the edge of one shoulder bone across to the edge of the other.
            </div>
          </div>
        </div>

        {/* Reassurance Callout */}
        <div className="p-5 bg-[#E7DED0] rounded-2xl border border-stone-300 text-xs text-stone-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <strong className="text-stone-900 block font-bold">Unsure about which size to pick?</strong>
            <span>Review the product description and size measurements before ordering. Exchange eligibility is not yet confirmed.</span>
          </div>
          <Link
            href="/contact"
            className="px-5 py-2 bg-[#242735] hover:bg-[#191C28] text-white font-bold rounded-full transition-colors shrink-0"
          >
            Ask a Stylist
          </Link>
        </div>
      </div>
    </div>
  );
}
