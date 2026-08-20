'use client';

import React, { useState } from 'react';
import { Download, Building2, Image as ImageIcon, Sparkles } from 'lucide-react';
import { usePdfGenerator } from '@/hooks/usePdfGenerator';
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
      'Temperature-controlled 1,000 bottle wine cellars',
      'Sub-Zero & Wolf chef kitchen with dual islands'
    ],
    description: 'An unparalleled luxury estate crafted for ultimate privacy and high-end entertaining. Features floor-to-ceiling glass walls, imported Italian marble finishings, and smart-home integration throughout.',
    photos: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    ]
  },
  broker: {
    name: 'Alexander Vance',
    agency: 'VANCE & CO. LUXURY REAL ESTATE',
    phone: '+1 (310) 555-0199',
    email: 'vance@vanceluxury.com',
    logoUrl: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=200&q=80'
  }
};

export default function Home() {
  const [data, setData] = useState<DealMemoData>(INITIAL_DATA);
  const { generatePdf, isGenerating } = usePdfGenerator();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar */}
      <header className="border-b border-slate-800 bg-slate-900/50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Building2 className="w-6 h-6 text-amber-400" />
          <span className="font-semibold tracking-wider text-lg">DEALPACK LUXURY</span>
        </div>
        <button
          onClick={() => generatePdf('pdf-document', `${data.property.title.replace(/\s+/g, '-')}-Memo.pdf`)}
          disabled={isGenerating}
          className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-5 py-2.5 rounded-lg flex items-center space-x-2 transition disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>{isGenerating ? 'Generating Memo...' : 'Export Deal Memo (PDF)'}</span>
        </button>
      </header>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        
        {/* Editor Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-100px)]">
          <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2">
            <Sparkles className="w-5 h-5" /> Property & Asset Details
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

            <div className="grid grid-cols-2 gap-4">
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

            <div>
              <label className="text-xs text-slate-400 uppercase tracking-wider block mb-1">Overview Description</label>
              <textarea
                rows={3}
                value={data.property.description}
                onChange={(e) => setData({ ...data, property: { ...data.property, description: e.target.value } })}
                className="w-full bg-slate-800 border border-slate-700 rounded-md p-2.5 text-sm focus:border-amber-400 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Live Executive Document Preview */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex justify-center items-start overflow-y-auto max-h-[calc(100vh-100px)]">
          <div id="pdf-document" className="w-[210mm] min-h-[297mm] bg-white text-slate-900 p-10 font-serif flex flex-col justify-between shadow-2xl">
            
            {/* Executive Document Header */}
            <div>
              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-6">
                <div>
                  <p className="text-xs tracking-widest text-amber-700 uppercase font-sans font-semibold">CONFIDENTIAL MEMORANDUM</p>
                  <h1 className="text-3xl font-bold tracking-tight text-slate-950 mt-1">{data.property.title}</h1>
                  <p className="text-sm font-sans text-slate-600 mt-1">{data.property.location}</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold font-sans text-amber-800 block">{data.property.price}</span>
                  <span className="text-xs font-sans text-slate-500 uppercase tracking-wider">OFF-MARKET</span>
                </div>
              </div>

              {/* Photo Showcase */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {data.property.photos.map((src, i) => (
                  <img key={i} src={src} alt="Asset photo" className="w-full h-44 object-cover rounded-sm border border-slate-200" />
                ))}
              </div>

              {/* Specs Bar */}
              <div className="grid grid-cols-4 gap-2 bg-slate-50 border border-slate-200 p-4 rounded-sm text-center font-sans mb-6">
                <div>
                  <span className="block text-xs text-slate-500">BEDROOMS</span>
                  <span className="font-bold text-slate-900">{data.property.specs.bedrooms}</span>
                </div>
                <div>
                  <span className="block text-xs text-slate-500">BATHROOMS</span>
                  <span className="font-bold text-slate-900">{data.property.specs.bathrooms}</span>
                </div>
                <div>
                  <span className="block text-xs text-slate-500">SQ FT</span>
                  <span className="font-bold text-slate-900">{data.property.specs.squareFeet}</span>
                </div>
                <div>
                  <span className="block text-xs text-slate-500">LOT SIZE</span>
                  <span className="font-bold text-slate-900">{data.property.specs.lotSize}</span>
                </div>
              </div>

              {/* Description & Highlights */}
              <div className="space-y-4 font-sans text-sm text-slate-700">
                <p>{data.property.description}</p>
                <ul className="list-disc pl-5 space-y-1">
                  {data.property.highlights.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Footer / Broker Credentials */}
            <div className="border-t border-slate-200 pt-4 mt-8 flex justify-between items-center font-sans text-xs text-slate-600">
              <div>
                <p className="font-bold text-slate-900 text-sm">{data.broker.agency}</p>
                <p>{data.broker.name} • {data.broker.phone}</p>
                <p>{data.broker.email}</p>
              </div>
              <div className="text-right">
                <p className="italic">Privileged & Confidential</p>
                <p>Prepared for Accredited Buyers Only</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}