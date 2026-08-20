'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Download, Building2, Upload, Sparkles, Plus, Trash2, Palette, Shield, Save, FolderOpen, Copy, Check, Search, Loader2 } from 'lucide-react';
import { DealMemoData } from '@/types';
import { DealMemoPDF } from '@/components/DealMemoPDF';

const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);

const STORAGE_KEY = 'dealpack_saved_memos';

const DEFAULT_MEMO: DealMemoData = {
  id: 'memo-default',
  memoName: 'Bel-Air Luxury Memo',
  updatedAt: new Date().toISOString(),
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
    accentColor: '#1e3a8a',
    bgColor: '#ffffff',
    textColor: '#0f172a',
    borderRadius: 'rounded-lg'
  }
};

export default function Home() {
  const [savedMemos, setSavedMemos] = useState<DealMemoData[]>([]);
  const [currentMemo, setCurrentMemo] = useState<DealMemoData>(DEFAULT_MEMO);
  const [activeTab, setActiveTab] = useState<'content' | 'broker' | 'design' | 'saved'>('content');
  const [saveStatus, setSaveStatus] = useState<string>('');
  const [isClient, setIsClient] = useState(false);

  // Step 2 Auto-Fill UI States
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSavedMemos(parsed);
          setCurrentMemo(parsed[0]);
          return;
        }
      } catch (e) {
        console.error('Failed to parse database', e);
      }
    }
    setSavedMemos([DEFAULT_MEMO]);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([DEFAULT_MEMO]));
  }, []);

  // Step 2 Handler: Auto-Fill Ingestion Pipeline
  const handleAutoFillLookup = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch('/api/property-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: searchQuery }),
      });
      const data = await res.json();
      if (res.ok && data) {
        setCurrentMemo((prev) => ({
          ...prev,
          memoName: data.title,
          property: {
            ...prev.property,
            title: data.title,
            price: data.price,
            location: data.location,
            specs: data.specs,
            description: data.description,
            photos: data.photos,
          },
        }));
      }
    } catch (err) {
      alert('Error connecting to property lookup engine.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSaveToDatabase = () => {
    const updatedMemo = { ...currentMemo, updatedAt: new Date().toISOString() };
    const exists = savedMemos.some((m) => m.id === updatedMemo.id);
    let newList: DealMemoData[];

    if (exists) {
      newList = savedMemos.map((m) => (m.id === updatedMemo.id ? updatedMemo : m));
    } else {
      newList = [updatedMemo, ...savedMemos];
    }

    setSavedMemos(newList);
    setCurrentMemo(updatedMemo);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    setSaveStatus('Saved!');
    setTimeout(() => setSaveStatus(''), 2000);
  };

  const photoCount = currentMemo.property.photos.length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <header className="border-b border-slate-800 bg-slate-900/90 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Building2 className="w-6 h-6 text-amber-400" />
          <span className="font-semibold tracking-wider text-lg">DEALPACK LUXURY</span>
          <span className="bg-slate-800 text-amber-400 text-[10px] uppercase tracking-widest px-2 py-0.5 rounded border border-amber-400/20 font-mono">
            Auto-Fill Engine Active
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleSaveToDatabase}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2 rounded-lg flex items-center space-x-2 text-xs font-semibold transition cursor-pointer"
          >
            {saveStatus ? <Check className="w-4 h-4 text-green-400" /> : <Save className="w-4 h-4 text-amber-400" />}
            <span>{saveStatus || 'Save Project'}</span>
          </button>

          {isClient && (
            <PDFDownloadLink
              document={<DealMemoPDF data={currentMemo} />}
              fileName={`${currentMemo.memoName.toLowerCase().replace(/\s+/g, '-')}-memo.pdf`}
              className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-5 py-2 rounded-lg flex items-center space-x-2 transition cursor-pointer text-xs shadow-lg"
            >
              {/* @ts-ignore */}
              {({ loading }) => (
                <>
                  <Download className="w-4 h-4" />
                  <span>{loading ? 'Generating Direct PDF...' : 'Download Vector PDF'}</span>
                </>
              )}
            </PDFDownloadLink>
          )}
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col max-h-[calc(100vh-100px)]">
          
          {/* Step 2 MLS / Zillow Toolbar */}
          <div className="mb-4 p-3 bg-amber-400/10 border border-amber-400/30 rounded-lg">
            <label className="text-[10px] text-amber-400 uppercase tracking-widest block font-bold mb-1">
              ⚡ MLS / Zillow Auto-Fill Lookup
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Address or Zillow Link..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAutoFillLookup()}
                className="flex-1 bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-amber-400"
              />
              <button
                onClick={handleAutoFillLookup}
                disabled={isSearching}
                className="bg-amber-400 hover:bg-amber-500 text-slate-950 px-3 py-1.5 rounded font-bold text-xs flex items-center gap-1 transition cursor-pointer"
              >
                {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                Auto-Fill
              </button>
            </div>
          </div>

          <div className="flex border-b border-slate-800 pb-3 mb-4 gap-1.5">
            <button
              onClick={() => setActiveTab('content')}
              className={`flex-1 py-2 text-[11px] font-bold rounded-md flex items-center justify-center gap-1 transition ${
                activeTab === 'content' ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> Property
            </button>
            <button
              onClick={() => setActiveTab('broker')}
              className={`flex-1 py-2 text-[11px] font-bold rounded-md flex items-center justify-center gap-1 transition ${
                activeTab === 'broker' ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" /> Broker
            </button>
            <button
              onClick={() => setActiveTab('design')}
              className={`flex-1 py-2 text-[11px] font-bold rounded-md flex items-center justify-center gap-1 transition ${
                activeTab === 'design' ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Palette className="w-3.5 h-3.5" /> Styling
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex-1 py-2 text-[11px] font-bold rounded-md flex items-center justify-center gap-1 transition ${
                activeTab === 'saved' ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <FolderOpen className="w-3.5 h-3.5" /> Database ({savedMemos.length})
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {activeTab === 'content' && (
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Property Title</label>
                  <input
                    type="text"
                    value={currentMemo.property.title}
                    onChange={(e) =>
                      setCurrentMemo({ ...currentMemo, property: { ...currentMemo.property, title: e.target.value } })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-xs focus:border-amber-400 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Price</label>
                    <input
                      type="text"
                      value={currentMemo.property.price}
                      onChange={(e) =>
                        setCurrentMemo({ ...currentMemo, property: { ...currentMemo.property, price: e.target.value } })
                      }
                      className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-xs focus:border-amber-400 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Location</label>
                    <input
                      type="text"
                      value={currentMemo.property.location}
                      onChange={(e) =>
                        setCurrentMemo({ ...currentMemo, property: { ...currentMemo.property, location: e.target.value } })
                      }
                      className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-xs focus:border-amber-400 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Description</label>
                  <textarea
                    rows={4}
                    value={currentMemo.property.description}
                    onChange={(e) =>
                      setCurrentMemo({ ...currentMemo, property: { ...currentMemo.property, description: e.target.value } })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic HTML Canvas Preview */}
        <div className="lg:col-span-7 bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex justify-center items-start overflow-y-auto max-h-[calc(100vh-100px)]">
          <div
            className={`w-[210mm] min-h-[290mm] p-8 flex flex-col justify-between shadow-2xl transition-all ${currentMemo.design.bodyFont}`}
            style={{ backgroundColor: currentMemo.design.bgColor, color: currentMemo.design.textColor }}
          >
            <div>
              <div className="flex justify-between items-start border-b-2 pb-4 mb-5" style={{ borderColor: currentMemo.design.textColor }}>
                <div>
                  <p className="text-[10px] tracking-widest uppercase font-sans font-bold" style={{ color: currentMemo.design.accentColor }}>
                    CONFIDENTIAL MEMORANDUM
                  </p>
                  <h1 className="text-2xl font-bold tracking-tight mt-0.5">{currentMemo.property.title}</h1>
                  <p className="text-xs font-sans opacity-70 mt-0.5">{currentMemo.property.location}</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold font-sans block" style={{ color: currentMemo.design.accentColor }}>
                    {currentMemo.property.price}
                  </span>
                  <span className="text-[10px] font-sans opacity-60 uppercase tracking-wider">OFF-MARKET</span>
                </div>
              </div>

              {photoCount > 0 && (
                <div className={`grid gap-2 mb-5 ${photoCount === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                  {currentMemo.property.photos.map((src, i) => (
                    <img key={i} src={src} alt="" className="w-full h-36 object-cover rounded border border-slate-200/20" />
                  ))}
                </div>
              )}

              {currentMemo.property.specs.length > 0 && (
                <div className="grid grid-cols-4 gap-2 bg-slate-100/10 p-3 rounded mb-5 text-center">
                  {currentMemo.property.specs.map((s, idx) => (
                    <div key={idx}>
                      <span className="block text-[8px] uppercase tracking-wider opacity-60">{s.label}</span>
                      <span className="font-bold text-xs">{s.value}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-3 text-xs leading-relaxed opacity-90">
                <p className="font-medium">{currentMemo.property.description}</p>
              </div>
            </div>

            <div className="border-t border-black/10 pt-3 mt-6 flex justify-between items-center font-sans text-[11px] opacity-80">
              <div>
                <p className="font-bold text-xs">{currentMemo.broker.agency}</p>
                <p>{currentMemo.broker.name} • {currentMemo.broker.phone}</p>
              </div>
              <div className="text-right text-[10px]">
                <p className="italic font-medium">{currentMemo.broker.disclaimerLeft}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
