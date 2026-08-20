'use client';

import React, { useState } from 'react';
import { Download, Building2, Upload, Sparkles, Plus, Trash2 } from 'lucide-react';
import { DealMemoData } from '@/types';

const INITIAL_DATA: DealMemoData = {
  property: {
    title: 'THE BEL-AIR ESTATE',
    subtitle: 'Exclusive Off-Market Architectural Sanctuary',
    price: '$18,500,000',
    location: 'Bel-Air, Los Angeles, CA',
    propertyType: 'Single Family Residence',
    specs: {
      bedrooms: '6',
      bathrooms: '8',
      squareFeet: '11,200',
      lotSize: '1.4 Acres'
    },
    highlights: [
      'Gated private driveway with security pavilion',
      'Infinity edge pool overlooking city-to-ocean views',
      'Temperature-controlled 1,000 bottle wine cellar',
      'Sub-Zero & Wolf chef kitchen with dual islands'
    ],
    description: 'An unparalleled luxury estate crafted for ultimate privacy and high-end entertaining. Features floor-to-ceiling glass walls, imported Italian marble finishings, and smart-home integration throughout.',
    photos: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80'
    ]
  },
  broker: {
    name: 'Alexander Vance',
    agency: 'VANCE & CO. LUXURY REAL ESTATE',
    phone: '+1 (310) 555-0199',
    email: 'vance@vanceluxury.com'
  }
};

export default function Home() {
  const [data, setData] = useState<DealMemoData>(INITIAL_DATA);

  // Handle Photo Uploads (Max 4 Photos)
  const handleImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedPhotos = [...data.property.photos];
        updatedPhotos[index] = reader.result as string;
        setData({
          ...data,
          property: { ...data.property, photos: updatedPhotos.slice(0, 4) }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = (index: number) => {
    const updatedPhotos = data.property.photos.filter((_, i) => i !== index);
    setData({
      ...data,
      property: { ...data.property, photos: updatedPhotos }
    });
  };

  // Bullet Points Management
  const handleHighlightChange = (index: number, value: string) => {
    const updated = [...data.property.highlights];
    updated[index] = value;
    setData({ ...data, property: { ...data.property, highlights: updated } });
  };

  const addHighlight = () => {
    if (data.property.highlights.length < 5) {
      setData({
        ...data,
        property: { ...data.property, highlights: [...data.property.highlights, ''] }
      });
    }
  };

  const removeHighlight = (index: number) => {
    const updated = data.property.highlights.filter((_, i) => i !== index);
    setData({ ...data, property: { ...data.property, highlights: updated } });
  };

  // Dedicated Print-to-PDF Engine
  const handlePrintPdf = () => {
    window.print();
  };

  const photoCount = data.property.photos.length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Global Print Styles to isolate PDF document to exactly 1 Page */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-memo, #printable-memo * {
            visibility: visible !important;
          }
          #printable-memo {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 20px !important;
            box-shadow: none !important;
          }
          @page {
            size: A4 portrait;
            margin: 0;
          }
        }
      `}</style>

      {/* Top Navbar */}
      <header className="no-print border-b border-slate-800 bg-slate-900/80 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Building2 className="w-6 h-6 text-amber-400" />
          <span className="font-semibold tracking-wider text-lg">DEALPACK LUXURY</span>
        </div>
        <button
          onClick={handlePrintPdf}
          className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-6 py-2.5 rounded-lg flex items-center space-x-2 transition cursor-pointer shadow-lg"
        >
          <Download className="w-4 h-4" />
          <span>Export Deal Memo (PDF)</span>
        </button>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
        {/* Left Form Controls (Hidden on Print) */}
        <div className="no-print lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-100px)]">
          <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2">
            <Sparkles className="w-5 h-5" /> Property Details
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 uppercase tracking-wider block mb-1">Property Title</label>
              <input
                type="text"
                value={data.property.title}
                onChange={(e) => setData({ ...data, property: { ...data.property, title: e.target.value } })}
                className="w-full bg-slate-800 border border-slate-700 rounded-md p-2.5 text-sm focus:border-amber-400 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-wider block mb-1">Price</label>
                <input
                  type="text"
                  value={data.property.price}
                  onChange={(e) => setData({ ...data, property: { ...data.property, price: e.target.value } })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-md p-2.5 text-sm focus:border-amber-400 outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-wider block mb-1">Location</label>
                <input
                  type="text"
                  value={data.property.location}
                  onChange={(e) => setData({ ...data, property: { ...data.property, location: e.target.value } })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-md p-2.5 text-sm focus:border-amber-400 outline-none"
                />
              </div>
            </div>

            {/* Photo Upload Slots (Up to 4) */}
            <div>
              <label className="text-xs text-slate-400 uppercase tracking-wider block mb-2">
                Property Photos (Up to 4)
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[0, 1, 2, 3].map((index) => (
                  <div key={index} className="relative">
                    {data.property.photos[index] ? (
                      <div className="relative h-20 rounded-lg overflow-hidden border border-amber-400/50 group">
                        <img src={data.property.photos[index]} alt="" className="w-full h-full object-cover" />
                        <button
                          onClick={() => removePhoto(index)}
                          className="absolute top-1 right-1 bg-red-600/90 text-white p-1 rounded-full opacity-80 hover:opacity-100 transition"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center h-20 bg-slate-800 border border-dashed border-slate-700 rounded-lg cursor-pointer hover:border-amber-400 transition">
                        <Upload className="w-4 h-4 text-amber-400 mb-1" />
                        <span className="text-[10px] text-slate-400">Photo {index + 1}</span>
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(index, e)} className="hidden" />
                      </label>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Highlights Bullet Inputs */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs text-slate-400 uppercase tracking-wider">Key Highlights</label>
                {data.property.highlights.length < 5 && (
                  <button onClick={addHighlight} className="text-xs text-amber-400 flex items-center gap-1 hover:underline">
                    <Plus className="w-3 h-3" /> Add Highlight
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {data.property.highlights.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleHighlightChange(idx, e.target.value)}
                      className="flex-1 bg-slate-800 border border-slate-700 rounded-md p-2 text-xs focus:border-amber-400 outline-none"
                    />
                    <button onClick={() => removeHighlight(idx)} className="text-slate-500 hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 uppercase tracking-wider block mb-1">Description</label>
              <textarea
                rows={3}
                value={data.property.description}
                onChange={(e) => setData({ ...data, property: { ...data.property, description: e.target.value } })}
                className="w-full bg-slate-800 border border-slate-700 rounded-md p-2.5 text-sm focus:border-amber-400 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Executive Memo Document Live Preview */}
        <div className="lg:col-span-7 bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex justify-center items-start overflow-y-auto max-h-[calc(100vh-100px)]">
          <div
            id="printable-memo"
            className="w-[210mm] min-h-[290mm] bg-white text-slate-900 p-8 font-serif flex flex-col justify-between shadow-2xl rounded-sm"
          >
            <div>
              {/* Document Header */}
              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4 mb-5">
                <div>
                  <p className="text-[10px] tracking-widest text-amber-700 uppercase font-sans font-bold">CONFIDENTIAL MEMORANDUM</p>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-950 mt-0.5">{data.property.title}</h1>
                  <p className="text-xs font-sans text-slate-600 mt-0.5">{data.property.location}</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold font-sans text-amber-800 block">{data.property.price}</span>
                  <span className="text-[10px] font-sans text-slate-500 uppercase tracking-wider">OFF-MARKET</span>
                </div>
              </div>

              {/* Dynamic Auto-Adjusting Photo Grid */}
              {photoCount > 0 && (
                <div
                  className={`grid gap-2 mb-5 ${
                    photoCount === 1
                      ? 'grid-cols-1'
                      : photoCount === 2
                      ? 'grid-cols-2'
                      : photoCount === 3
                      ? 'grid-cols-3'
                      : 'grid-cols-2'
                  }`}
                >
                  {data.property.photos.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt="Property Detail"
                      className={`w-full object-cover rounded-sm border border-slate-200 ${
                        photoCount === 1 ? 'h-52' : photoCount === 4 ? 'h-28' : 'h-36'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Specs Bar */}
              <div className="grid grid-cols-4 gap-2 bg-slate-50 border border-slate-200 p-3 rounded-sm text-center font-sans mb-5">
                <div>
                  <span className="block text-[10px] text-slate-500 uppercase">Bedrooms</span>
                  <span className="font-bold text-sm text-slate-900">{data.property.specs.bedrooms}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-500 uppercase">Bathrooms</span>
                  <span className="font-bold text-sm text-slate-900">{data.property.specs.bathrooms}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-500 uppercase">Sq Ft</span>
                  <span className="font-bold text-sm text-slate-900">{data.property.specs.squareFeet}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-500 uppercase">Lot Size</span>
                  <span className="font-bold text-sm text-slate-900">{data.property.specs.lotSize}</span>
                </div>
              </div>

              {/* Description & Key Highlights */}
              <div className="space-y-3 font-sans text-xs text-slate-700 leading-relaxed">
                <p className="font-medium text-slate-800">{data.property.description}</p>
                <div>
                  <p className="font-bold text-slate-900 text-xs mb-1 uppercase tracking-wide">Key Features & Amenities:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    {data.property.highlights.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Document Footer */}
            <div className="border-t border-slate-200 pt-3 mt-6 flex justify-between items-center font-sans text-[11px] text-slate-600">
              <div>
                <p className="font-bold text-slate-900 text-xs">{data.broker.agency}</p>
                <p>{data.broker.name} • {data.broker.phone}</p>
                <p>{data.broker.email}</p>
              </div>
              <div className="text-right text-[10px]">
                <p className="italic font-medium">Privileged & Confidential</p>
                <p>Prepared for Accredited Buyers Only</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
