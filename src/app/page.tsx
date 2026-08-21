'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Download, Building2, Sparkles, Palette, Shield, Save, FolderOpen, Check, Search, Loader2, Plus, Trash2, Layers, Upload, X, Eye, EyeOff, Copy, FileText } from 'lucide-react';
import { DealMemoData, PropertySpec } from '@/types';
import { DealMemoPDF } from '@/components/DealMemoPDF';
import { AccessGuard } from '@/components/AccessGuard';

const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);

const STORAGE_KEY = 'dealpack_saved_memos_v2';

const INITIAL_MEMO: DealMemoData = {
  id: 'memo-' + Date.now(),
  memoName: 'Bel-Air Luxury Estate',
  updatedAt: new Date().toISOString(),
  pageCount: 1,
  design: {
    bgColor: '#ffffff',
    textColor: '#0f172a',
    accentColor: '#d97706',
    fontFamily: 'sans',
  },
  property: {
    title: 'THE BEL-AIR ESTATE',
    subtitle: 'Exclusive Off-Market Sanctuary',
    price: '$18,500,000',
    location: 'Bel-Air, Los Angeles, CA',
    description: 'An unparalleled luxury estate crafted for ultimate privacy and high-end entertaining. Features floor-to-ceiling glass walls, panoramic ocean-to-city views, and world-class architectural finishes throughout.',
    photos: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80',
    ],
    specs: [
      { id: '1', label: 'BEDROOMS', value: '6' },
      { id: '2', label: 'BATHROOMS', value: '8' },
      { id: '3', label: 'SQ FT', value: '11,200' },
      { id: '4', label: 'LOT SIZE', value: '1.4 Acres' },
    ],
    highlights: [
      'Gated private driveway with security pavilion',
      'Infinity edge pool with panoramic ocean-to-city views',
      'Imported Italian marble finishes throughout',
    ],
  },
  broker: {
    agency: 'DEALPACK LUXURY',
    name: 'Executive Director',
    phone: '+1 (555) 019-2831',
    showLogo: true,
    showHeadshot: false,
    disclaimerLeft: 'Confidential Investment Memorandum',
    disclaimerRight: 'All Information Deemed Reliable But Not Guaranteed',
  },
};

export default function Home() {
  const [memo, setMemo] = useState<DealMemoData>(INITIAL_MEMO);
  const [savedMemos, setSavedMemos] = useState<DealMemoData[]>([]);
  const [activeTab, setActiveTab] = useState<'property' | 'branding' | 'format' | 'memos'>('property');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setSavedMemos(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load saved memos', e);
      }
    }
  }, []);

  const handleSave = () => {
    const updated = [memo, ...savedMemos.filter((m) => m.id !== memo.id)];
    setSavedMemos(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    alert('Project saved successfully!');
  };

  return (
    <AccessGuard>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        {/* Top Navbar */}
        <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg border border-amber-500/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-white tracking-tight flex items-center gap-2">
                DEALPACK LUXURY
                <span className="text-[10px] uppercase bg-amber-500/20 text-amber-400 font-mono px-2 py-0.5 rounded border border-amber-500/30">
                  ENTERPRISE TIER
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition"
            >
              <Save className="w-4 h-4" /> Save Project
            </button>

            <PDFDownloadLink
              document={<DealMemoPDF data={memo} />}
              fileName={`${memo.memoName.toLowerCase().replace(/\s+/g, '-')}-memo.pdf`}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-lg transition shadow-lg shadow-amber-500/20"
            >
              {/* @ts-ignore */}
              {({ loading }) => (
                <>
                  <Download className="w-4 h-4" />
                  {loading ? 'Generating PDF...' : 'Export 1-Page Vector PDF'}
                </>
              )}
            </PDFDownloadLink>
          </div>
        </header>

        {/* Main App Workspace */}
        <div className="flex-1 grid grid-cols-12 p-6 gap-6 max-w-[1800px] w-full mx-auto">
          {/* Editor Panel */}
          <div className="col-span-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden">
            <div className="flex border-b border-slate-800 bg-slate-950/40 p-2 gap-1">
              <button
                onClick={() => setActiveTab('property')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition ${
                  activeTab === 'property' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" /> Property
              </button>
              <button
                onClick={() => setActiveTab('branding')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition ${
                  activeTab === 'branding' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Shield className="w-3.5 h-3.5" /> Branding
              </button>
              <button
                onClick={() => setActiveTab('format')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition ${
                  activeTab === 'format' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Palette className="w-3.5 h-3.5" /> Format
              </button>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              {activeTab === 'property' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">
                      Project Name
                    </label>
                    <input
                      type="text"
                      value={memo.memoName}
                      onChange={(e) => setMemo({ ...memo, memoName: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">
                      Property Title
                    </label>
                    <input
                      type="text"
                      value={memo.property.title}
                      onChange={(e) =>
                        setMemo({ ...memo, property: { ...memo.property, title: e.target.value } })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">
                        Price
                      </label>
                      <input
                        type="text"
                        value={memo.property.price}
                        onChange={(e) =>
                          setMemo({ ...memo, property: { ...memo.property, price: e.target.value } })
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">
                        Location
                      </label>
                      <input
                        type="text"
                        value={memo.property.location}
                        onChange={(e) =>
                          setMemo({ ...memo, property: { ...memo.property, location: e.target.value } })
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'branding' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">
                      Agency Name
                    </label>
                    <input
                      type="text"
                      value={memo.broker.agency}
                      onChange={(e) =>
                        setMemo({ ...memo, broker: { ...memo.broker, agency: e.target.value } })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">
                      Broker Name
                    </label>
                    <input
                      type="text"
                      value={memo.broker.name}
                      onChange={(e) =>
                        setMemo({ ...memo, broker: { ...memo.broker, name: e.target.value } })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'format' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">
                      Accent Color
                    </label>
                    <input
                      type="color"
                      value={memo.design.accentColor}
                      onChange={(e) =>
                        setMemo({ ...memo, design: { ...memo.design, accentColor: e.target.value } })
                      }
                      className="w-full h-10 bg-slate-950 border border-slate-800 rounded-lg p-1 cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Live Preview Panel */}
          <div className="col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-start overflow-y-auto">
            <div className="w-full max-w-[595px] bg-white text-slate-900 rounded shadow-2xl p-8 space-y-6 aspect-[1/1.414]">
              <div className="border-b-2 border-slate-900 pb-3 flex justify-between items-start">
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-amber-600 font-bold">
                    CONFIDENTIAL MEMORANDUM
                  </p>
                  <h2 className="text-xl font-bold tracking-tight text-slate-900">
                    {memo.property.title}
                  </h2>
                  <p className="text-xs text-slate-500">{memo.property.location}</p>
                </div>
                <p className="text-lg font-bold text-amber-600">{memo.property.price}</p>
              </div>

              {memo.property.photos.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {memo.property.photos.slice(0, 4).map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt="Property"
                      className="w-full h-24 object-cover rounded"
                    />
                  ))}
                </div>
              )}

              <div className="bg-slate-100 p-3 rounded grid grid-cols-4 gap-2 text-center">
                {memo.property.specs.map((spec) => (
                  <div key={spec.id}>
                    <p className="text-[8px] text-slate-500 font-semibold">{spec.label}</p>
                    <p className="text-xs font-bold text-slate-800">{spec.value}</p>
                  </div>
                ))}
              </div>

              <p className="text-xs leading-relaxed text-slate-600">
                {memo.property.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </AccessGuard>
  );
}
