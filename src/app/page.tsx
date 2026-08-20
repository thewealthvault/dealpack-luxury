'use client';

import React, { useState } from 'react';
import { Download, Building2, Upload, Sparkles, Plus, Trash2, Palette, Type, Sliders, Shield } from 'lucide-react';
import { DealMemoData } from '@/types';

const INITIAL_DATA: DealMemoData = {
  property: {
    title: 'THE BEL-AIR ESTATE',
    subtitle: 'Exclusive Off-Market Architectural Sanctuary',
    price: '$18,500,000',
    location: 'Bel-Air, Los Angeles, CA',
    specs: [
      { label: 'BEDROOMS', value: '6' },
      { label: 'BATHROOMS', value: '8' },
      { label: 'SQ FT', value: '11,200' },
      { label: 'LOT SIZE', value: '1.4 Acres' }
    ],
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
    agency: 'VANCE & CO. LUXURY REAL ESTATE',
    name: 'Alexander Vance',
    phone: '+1 (310) 555-0199',
    email: 'vance@vanceluxury.com',
    disclaimerLeft: 'Privileged & Confidential',
    disclaimerRight: 'Prepared for Accredited Buyers Only'
  },
  design: {
    headingFont: 'font-serif',
    bodyFont: 'font-sans',
    accentColor: '#b45309', // Amber-700
    bgColor: '#ffffff',
    textColor: '#0f172a',
    borderRadius: 'rounded-sm'
  }
};

export default function Home() {
  const [data, setData] = useState<DealMemoData>(INITIAL_DATA);
  const [activeTab, setActiveTab] = useState<'content' | 'broker' | 'design'>('content');

  // Photo Handlers
  const handleImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedPhotos = [...data.property.photos];
        updatedPhotos[index] = reader.result as string;
        setData({ ...data, property: { ...data.property, photos: updatedPhotos.slice(0, 4) } });
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = (index: number) => {
    const updated = data.property.photos.filter((_, i) => i !== index);
    setData({ ...data, property: { ...data.property, photos: updated } });
  };

  // Specs Handlers
  const handleSpecChange = (index: number, field: 'label' | 'value', val: string) => {
    const updated = [...data.property.specs];
    updated[index][field] = val;
    setData({ ...data, property: { ...data.property, specs: updated } });
  };

  const addSpec = () => {
    if (data.property.specs.length < 6) {
      setData({
        ...data,
        property: { ...data.property, specs: [...data.property.specs, { label: 'NEW SPEC', value: 'Val' }] }
      });
    }
  };

  const removeSpec = (index: number) => {
    const updated = data.property.specs.filter((_, i) => i !== index);
    setData({ ...data, property: { ...data.property, specs: updated } });
  };

  // Highlights Handlers
  const handleHighlightChange = (index: number, value: string) => {
    const updated = [...data.property.highlights];
    updated[index] = value;
    setData({ ...data, property: { ...data.property, highlights: updated } });
  };

  const addHighlight = () => {
    if (data.property.highlights.length < 5) {
      setData({ ...data, property: { ...data.property, highlights: [...data.property.highlights, ''] } });
    }
  };

  const removeHighlight = (index: number) => {
    const updated = data.property.highlights.filter((_, i) => i !== index);
    setData({ ...data, property: { ...data.property, highlights: updated } });
  };

  const photoCount = data.property.photos.length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <style jsx global>{`
        @media print {
          body * { visibility: hidden !important; }
          #printable-memo, #printable-memo * { visibility: visible !important; }
          #printable-memo {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 24px !important;
            box-shadow: none !important;
          }
          @page { size: A4 portrait; margin: 0; }
        }
      `}</style>

      {/* Header */}
      <header className="no-print border-b border-slate-800 bg-slate-900/90 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Building2 className="w-6 h-6 text-amber-400" />
          <span className="font-semibold tracking-wider text-lg">DEALPACK LUXURY</span>
        </div>
        <button
          onClick={() => window.print()}
          className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-6 py-2.5 rounded-lg flex items-center space-x-2 transition cursor-pointer shadow-lg"
        >
          <Download className="w-4 h-4" />
          <span>Export Deal Memo (PDF)</span>
        </button>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
        {/* Editor Sidebar */}
        <div className="no-print lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col max-h-[calc(100vh-100px)]">
          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-800 pb-3 mb-4 gap-2">
            <button
              onClick={() => setActiveTab('content')}
              className={`flex-1 py-2 text-xs font-bold rounded-md flex items-center justify-center gap-1.5 transition ${
                activeTab === 'content' ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> Property
            </button>
            <button
              onClick={() => setActiveTab('broker')}
              className={`flex-1 py-2 text-xs font-bold rounded-md flex items-center justify-center gap-1.5 transition ${
                activeTab === 'broker' ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" /> Broker & Footer
            </button>
            <button
              onClick={() => setActiveTab('design')}
              className={`flex-1 py-2 text-xs font-bold rounded-md flex items-center justify-center gap-1.5 transition ${
                activeTab === 'design' ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Palette className="w-3.5 h-3.5" /> Styling
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-5 pr-1">
            {/* TAB 1: PROPERTY CONTENT */}
            {activeTab === 'content' && (
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Property Title</label>
                  <input
                    type="text"
                    value={data.property.title}
                    onChange={(e) => setData({ ...data, property: { ...data.property, title: e.target.value } })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-xs focus:border-amber-400 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Price</label>
                    <input
                      type="text"
                      value={data.property.price}
                      onChange={(e) => setData({ ...data, property: { ...data.property, price: e.target.value } })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-xs focus:border-amber-400 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Location</label>
                    <input
                      type="text"
                      value={data.property.location}
                      onChange={(e) => setData({ ...data, property: { ...data.property, location: e.target.value } })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-xs focus:border-amber-400 outline-none"
                    />
                  </div>
                </div>

                {/* Photos */}
                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-2">Photos (Up to 4)</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[0, 1, 2, 3].map((index) => (
                      <div key={index}>
                        {data.property.photos[index] ? (
                          <div className="relative h-16 rounded overflow-hidden border border-amber-400/50">
                            <img src={data.property.photos[index]} alt="" className="w-full h-full object-cover" />
                            <button
                              onClick={() => removePhoto(index)}
                              className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full text-xs"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center h-16 bg-slate-800 border border-dashed border-slate-700 rounded cursor-pointer hover:border-amber-400">
                            <Upload className="w-3.5 h-3.5 text-amber-400 mb-0.5" />
                            <span className="text-[9px] text-slate-400">Photo {index + 1}</span>
                            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(index, e)} className="hidden" />
                          </label>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Specs */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider">Specs Cards</label>
                    {data.property.specs.length < 6 && (
                      <button onClick={addSpec} className="text-[10px] text-amber-400 flex items-center gap-1">
                        <Plus className="w-3 h-3" /> Add Spec
                      </button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {data.property.specs.map((spec, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={spec.label}
                          onChange={(e) => handleSpecChange(idx, 'label', e.target.value)}
                          className="w-1/2 bg-slate-800 border border-slate-700 rounded p-1.5 text-[11px] outline-none"
                        />
                        <input
                          type="text"
                          value={spec.value}
                          onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                          className="w-1/2 bg-slate-800 border border-slate-700 rounded p-1.5 text-[11px] outline-none"
                        />
                        <button onClick={() => removeSpec(idx)} className="text-slate-500 hover:text-red-400">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Highlights */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider">Highlights</label>
                    {data.property.highlights.length < 5 && (
                      <button onClick={addHighlight} className="text-[10px] text-amber-400 flex items-center gap-1">
                        <Plus className="w-3 h-3" /> Add Bullet
                      </button>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    {data.property.highlights.map((item, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => handleHighlightChange(idx, e.target.value)}
                          className="flex-1 bg-slate-800 border border-slate-700 rounded p-1.5 text-xs outline-none"
                        />
                        <button onClick={() => removeHighlight(idx)} className="text-slate-500 hover:text-red-400">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={data.property.description}
                    onChange={(e) => setData({ ...data, property: { ...data.property, description: e.target.value } })}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs outline-none"
                  />
                </div>
              </div>
            )}

            {/* TAB 2: BROKER & FOOTER */}
            {activeTab === 'broker' && (
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Agency Name</label>
                  <input
                    type="text"
                    value={data.broker.agency}
                    onChange={(e) => setData({ ...data, broker: { ...data.broker, agency: e.target.value } })}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Agent Name</label>
                  <input
                    type="text"
                    value={data.broker.name}
                    onChange={(e) => setData({ ...data, broker: { ...data.broker, name: e.target.value } })}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Phone</label>
                    <input
                      type="text"
                      value={data.broker.phone}
                      onChange={(e) => setData({ ...data, broker: { ...data.broker, phone: e.target.value } })}
                      className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Email</label>
                    <input
                      type="text"
                      value={data.broker.email}
                      onChange={(e) => setData({ ...data, broker: { ...data.broker, email: e.target.value } })}
                      className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Left Footer Note</label>
                  <input
                    type="text"
                    value={data.broker.disclaimerLeft}
                    onChange={(e) => setData({ ...data, broker: { ...data.broker, disclaimerLeft: e.target.value } })}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Right Footer Note</label>
                  <input
                    type="text"
                    value={data.broker.disclaimerRight}
                    onChange={(e) => setData({ ...data, broker: { ...data.broker, disclaimerRight: e.target.value } })}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs outline-none"
                  />
                </div>
              </div>
            )}

            {/* TAB 3: DESIGN & STYLING */}
            {activeTab === 'design' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Heading Font</label>
                    <select
                      value={data.design.headingFont}
                      onChange={(e) => setData({ ...data, design: { ...data.design, headingFont: e.target.value } })}
                      className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs outline-none"
                    >
                      <option value="font-serif">Serif (Editorial)</option>
                      <option value="font-sans">Sans (Modern Clean)</option>
                      <option value="font-mono">Mono (Technical)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Body Font</label>
                    <select
                      value={data.design.bodyFont}
                      onChange={(e) => setData({ ...data, design: { ...data.design, bodyFont: e.target.value } })}
                      className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs outline-none"
                    >
                      <option value="font-sans">Sans-Serif</option>
                      <option value="font-serif">Serif Classic</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Accent Theme Color</label>
                  <div className="flex gap-2">
                    {[
                      { name: 'Gold', hex: '#b45309' },
                      { name: 'Emerald', hex: '#047857' },
                      { name: 'Navy', hex: '#1e3a8a' },
                      { name: 'Burgundy', hex: '#881337' },
                      { name: 'Onyx', hex: '#09090b' }
                    ].map((theme) => (
                      <button
                        key={theme.hex}
                        onClick={() => setData({ ...data, design: { ...data.design, accentColor: theme.hex } })}
                        className={`w-8 h-8 rounded-full border-2 transition ${
                          data.design.accentColor === theme.hex ? 'border-amber-400 scale-110' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: theme.hex }}
                        title={theme.name}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Corner Radius</label>
                  <select
                    value={data.design.borderRadius}
                    onChange={(e) => setData({ ...data, design: { ...data.design, borderRadius: e.target.value } })}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs outline-none"
                  >
                    <option value="rounded-none">Sharp Corners (Modern)</option>
                    <option value="rounded-sm">Subtle Soft Corners</option>
                    <option value="rounded-lg">Rounded Cards</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Executive Canvas */}
        <div className="lg:col-span-7 bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex justify-center items-start overflow-y-auto max-h-[calc(100vh-100px)]">
          <div
            id="printable-memo"
            className={`w-[210mm] min-h-[290mm] p-8 flex flex-col justify-between shadow-2xl transition-all ${data.design.bodyFont}`}
            style={{ backgroundColor: data.design.bgColor, color: data.design.textColor }}
          >
            <div>
              {/* Header */}
              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4 mb-5">
                <div>
                  <p className="text-[10px] tracking-widest uppercase font-sans font-bold" style={{ color: data.design.accentColor }}>
                    CONFIDENTIAL MEMORANDUM
                  </p>
                  <h1 className={`text-2xl font-bold tracking-tight mt-0.5 ${data.design.headingFont}`}>{data.property.title}</h1>
                  <p className="text-xs font-sans text-slate-600 mt-0.5">{data.property.location}</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold font-sans block" style={{ color: data.design.accentColor }}>
                    {data.property.price}
                  </span>
                  <span className="text-[10px] font-sans text-slate-500 uppercase tracking-wider">OFF-MARKET</span>
                </div>
              </div>

              {/* Photo Grid */}
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
                      alt=""
                      className={`w-full object-cover border border-slate-200 ${data.design.borderRadius} ${
                        photoCount === 1 ? 'h-52' : photoCount === 4 ? 'h-28' : 'h-36'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Specs Grid */}
              {data.property.specs.length > 0 && (
                <div
                  className={`grid gap-2 bg-slate-50 border border-slate-200 p-3 text-center font-sans mb-5 ${data.design.borderRadius}`}
                  style={{ gridTemplateColumns: `repeat(${data.property.specs.length}, minmax(0, 1fr))` }}
                >
                  {data.property.specs.map((spec, i) => (
                    <div key={i}>
                      <span className="block text-[9px] text-slate-500 uppercase">{spec.label}</span>
                      <span className="font-bold text-xs text-slate-900">{spec.value}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Description & Highlights */}
              <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
                <p className="font-medium text-slate-800">{data.property.description}</p>
                {data.property.highlights.length > 0 && (
                  <div>
                    <p className="font-bold text-slate-900 text-xs mb-1 uppercase tracking-wide">Key Features & Amenities:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      {data.property.highlights.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Custom Broker Footer */}
            <div className="border-t border-slate-200 pt-3 mt-6 flex justify-between items-center font-sans text-[11px] text-slate-600">
              <div>
                <p className="font-bold text-slate-900 text-xs">{data.broker.agency}</p>
                <p>{data.broker.name} • {data.broker.phone}</p>
                <p>{data.broker.email}</p>
              </div>
              <div className="text-right text-[10px]">
                <p className="italic font-medium">{data.broker.disclaimerLeft}</p>
                <p>{data.broker.disclaimerRight}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
