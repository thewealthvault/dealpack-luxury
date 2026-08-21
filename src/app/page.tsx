import { AccessGuard } from "@/components/AccessGuard";
'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Download, Building2, Sparkles, Palette, Shield, Save, FolderOpen, Check, Search, Loader2, Plus, Trash2, Layers, Upload, X, Eye, EyeOff, Copy, FileText } from 'lucide-react';
import { DealMemoData, PropertySpec } from '@/types';
import { DealMemoPDF } from '@/components/DealMemoPDF';

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
  property: {
    title: 'THE BEL-AIR ESTATE',
    subtitle: 'Exclusive Off-Market Sanctuary',
    price: '$18,500,000',
    location: 'Bel-Air, Los Angeles, CA',
    specs: [
      { id: '1', label: 'BEDROOMS', value: '6' },
      { id: '2', label: 'BATHROOMS', value: '8' },
      { id: '3', label: 'SQ FT', value: '11,200' },
      { id: '4', label: 'LOT SIZE', value: '1.4 Acres' },
    ],
    highlights: [
      'Gated private driveway with security pavilion',
      'Infinity edge pool with panoramic ocean-to-city views',
      'Imported Italian marble finishes throughout'
    ],
    description: 'An unparalleled luxury estate crafted for ultimate privacy and high-end entertaining. Features floor-to-ceiling glass walls and smart-home integration.',
    photos: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
    ]
  },
  broker: {
    agency: 'VANCE & CO. LUXURY REAL ESTATE',
    name: 'Alexander Vance',
    phone: '+1 (310) 555-0199',
    email: 'vance@vanceluxury.com',
    disclaimerLeft: 'Privileged & Confidential',
    disclaimerRight: 'Prepared for Accredited Buyers',
    logoUrl: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=200&q=80',
    headshotUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
    showHeadshot: true,
    showLogo: true,
  },
  design: {
    fontFamily: 'sans',
    accentColor: '#1e3a8a',
    bgColor: '#ffffff',
    textColor: '#0f172a',
  }
};

export default function Home() {
  const [savedMemos, setSavedMemos] = useState<DealMemoData[]>([]);
  const [currentMemo, setCurrentMemo] = useState<DealMemoData>(INITIAL_MEMO);
  const [activeTab, setActiveTab] = useState<'content' | 'broker' | 'design' | 'saved'>('content');
  const [saveStatus, setSaveStatus] = useState<string>('');
  const [isClient, setIsClient] = useState(false);

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
      } catch (e) {}
    }
    setSavedMemos([INITIAL_MEMO]);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([INITIAL_MEMO]));
  }, []);

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

  const createNewMemo = () => {
    const newMemo: DealMemoData = {
      ...INITIAL_MEMO,
      id: 'memo-' + Date.now(),
      memoName: 'New Luxury Memo ' + (savedMemos.length + 1),
      updatedAt: new Date().toISOString(),
    };
    const newList = [newMemo, ...savedMemos];
    setSavedMemos(newList);
    setCurrentMemo(newMemo);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    setActiveTab('content');
  };

  const deleteMemo = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (savedMemos.length <= 1) {
      alert('You must maintain at least one memo project.');
      return;
    }
    const filtered = savedMemos.filter((m) => m.id !== id);
    setSavedMemos(filtered);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    if (currentMemo.id === id) {
      setCurrentMemo(filtered[0]);
    }
  };

  const duplicateMemo = (memo: DealMemoData, e: React.MouseEvent) => {
    e.stopPropagation();
    const copyMemo: DealMemoData = {
      ...memo,
      id: 'memo-' + Date.now(),
      memoName: `${memo.memoName} (Copy)`,
      updatedAt: new Date().toISOString(),
    };
    const newList = [copyMemo, ...savedMemos];
    setSavedMemos(newList);
    setCurrentMemo(copyMemo);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
  };

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
            description: data.description,
            photos: data.photos || prev.property.photos,
          },
        }));
      }
    } catch (err) {
      alert('Error searching listing.');
    } font-mono {
      setIsSearching(false);
    }
  };

  const updateSpec = (id: string, key: 'label' | 'value', val: string) => {
    const newSpecs = currentMemo.property.specs.map((s) => (s.id === id ? { ...s, [key]: val } : s));
    setCurrentMemo({ ...currentMemo, property: { ...currentMemo.property, specs: newSpecs } });
  };

  const addSpec = () => {
    const newSpec: PropertySpec = { id: Date.now().toString(), label: 'TERM', value: 'Value' };
    setCurrentMemo({
      ...currentMemo,
      property: { ...currentMemo.property, specs: [...currentMemo.property.specs, newSpec] },
    });
  };

  const removeSpec = (id: string) => {
    const newSpecs = currentMemo.property.specs.filter((s) => s.id !== id);
    setCurrentMemo({ ...currentMemo, property: { ...currentMemo.property, specs: newSpecs } });
  };

  const updateHighlight = (index: number, val: string) => {
    const newH = [...currentMemo.property.highlights];
    newH[index] = val;
    setCurrentMemo({ ...currentMemo, property: { ...currentMemo.property, highlights: newH } });
  };

  const addHighlight = () => {
    setCurrentMemo({
      ...currentMemo,
      property: { ...currentMemo.property, highlights: [...currentMemo.property.highlights, 'New key property feature'] },
    });
  };

  const removeHighlight = (index: number) => {
    const newH = currentMemo.property.highlights.filter((_, i) => i !== index);
    setCurrentMemo({ ...currentMemo, property: { ...currentMemo.property, highlights: newH } });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = 4 - currentMemo.property.photos.length;
    if (remainingSlots <= 0) {
      alert('Maximum 4 photos allowed.');
      return;
    }

    const filesToProcess = Array.from(files).slice(0, remainingSlots);
    filesToProcess.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setCurrentMemo((prev) => ({
            ...prev,
            property: {
              ...prev.property,
              photos: [...prev.property.photos, reader.result as string].slice(0, 4),
            },
          }));
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const removePhoto = (index: number) => {
    const updatedPhotos = currentMemo.property.photos.filter((_, i) => i !== index);
    setCurrentMemo({
      ...currentMemo,
      property: { ...currentMemo.property, photos: updatedPhotos },
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, targetField: 'logoUrl' | 'headshotUrl') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentMemo({
          ...currentMemo,
          broker: { ...currentMemo.broker, [targetField]: reader.result as string },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const getCanvasGridClass = (count: number) => {
    if (count === 1) return 'grid-cols-1';
    if (count === 2) return 'grid-cols-2';
    if (count === 3) return 'grid-cols-3';
    return 'grid-cols-2';
  };

  return (
    <AccessGuard>
<div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <header className="border-b border-slate-800 bg-slate-900/90 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Building2 className="w-6 h-6 text-amber-400" />
          <span className="font-semibold tracking-wider text-lg">DEALPACK LUXURY</span>
          <span className="bg-slate-800 text-amber-400 text-[10px] uppercase tracking-widest px-2 py-0.5 rounded border border-amber-400/20 font-mono">
            Enterprise Tier
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
                  <span>{loading ? 'Generating...' : `Export ${currentMemo.pageCount || 1}-Page Vector PDF`}</span>
                </>
              )}
            </PDFDownloadLink>
          )}
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
        {/* LEFT CONTROL PANEL */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col max-h-[calc(100vh-100px)]">
          {/* MLS Lookup */}
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

          {/* Navigation Tabs */}
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
              <Shield className="w-3.5 h-3.5" /> Branding
            </button>
            <button
              onClick={() => setActiveTab('design')}
              className={`flex-1 py-2 text-[11px] font-bold rounded-md flex items-center justify-center gap-1 transition ${
                activeTab === 'design' ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Palette className="w-3.5 h-3.5" /> Format
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex-1 py-2 text-[11px] font-bold rounded-md flex items-center justify-center gap-1 transition ${
                activeTab === 'saved' ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <FolderOpen className="w-3.5 h-3.5" /> Memos ({savedMemos.length})
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {/* PROPERTY TAB */}
            {activeTab === 'content' && (
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Project Name</label>
                  <input
                    type="text"
                    value={currentMemo.memoName}
                    onChange={(e) => setCurrentMemo({ ...currentMemo, memoName: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Property Title</label>
                  <input
                    type="text"
                    value={currentMemo.property.title}
                    onChange={(e) => setCurrentMemo({ ...currentMemo, property: { ...currentMemo.property, title: e.target.value } })}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Price</label>
                    <input
                      type="text"
                      value={currentMemo.property.price}
                      onChange={(e) => setCurrentMemo({ ...currentMemo, property: { ...currentMemo.property, price: e.target.value } })}
                      className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Location</label>
                    <input
                      type="text"
                      value={currentMemo.property.location}
                      onChange={(e) => setCurrentMemo({ ...currentMemo, property: { ...currentMemo.property, location: e.target.value } })}
                      className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Specs */}
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                      Property Specs Bar (Custom Terms)
                    </label>
                    <button onClick={addSpec} className="text-amber-400 hover:text-amber-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer">
                      <Plus className="w-3 h-3" /> Add Term
                    </button>
                  </div>
                  {currentMemo.property.specs.map((s) => (
                    <div key={s.id} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={s.label}
                        onChange={(e) => updateSpec(s.id, 'label', e.target.value)}
                        placeholder="Label"
                        className="w-1/2 bg-slate-800 border border-slate-700 rounded p-1.5 text-xs font-bold uppercase text-slate-200"
                      />
                      <input
                        type="text"
                        value={s.value}
                        onChange={(e) => updateSpec(s.id, 'value', e.target.value)}
                        placeholder="Value"
                        className="w-1/2 bg-slate-800 border border-slate-700 rounded p-1.5 text-xs font-normal"
                      />
                      <button onClick={() => removeSpec(s.id)} className="text-slate-500 hover:text-red-400 cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Photos */}
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                      Property Gallery ({currentMemo.property.photos.length}/4 Images)
                    </label>
                    <span className="text-[10px] text-slate-500">Auto-adjusts Layout</span>
                  </div>

                  {currentMemo.property.photos.length > 0 && (
                    <div className="grid grid-cols-4 gap-2">
                      {currentMemo.property.photos.map((photo, idx) => (
                        <div key={idx} className="relative group rounded overflow-hidden border border-slate-700 aspect-video bg-slate-900">
                          <img src={photo} alt="" className="w-full h-full object-cover" />
                          <button
                            onClick={() => removePhoto(idx)}
                            className="absolute inset-0 bg-red-950/80 text-red-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                            title="Delete Image"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <span className="absolute bottom-0.5 left-1 text-[8px] bg-slate-950/80 text-slate-300 px-1 rounded">
                            #{idx + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {currentMemo.property.photos.length < 4 && (
                    <label className="border-2 border-dashed border-slate-800 hover:border-amber-400/50 rounded-lg p-3 flex flex-col items-center justify-center gap-1 cursor-pointer transition bg-slate-900/50">
                      <Upload className="w-4 h-4 text-amber-400" />
                      <span className="text-xs text-slate-300 font-semibold">Upload Photo</span>
                      <span className="text-[9px] text-slate-500">PNG, JPG, or WEBP (Max 4 images)</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Bullets */}
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                      Key Bullet Highlights
                    </label>
                    <button onClick={addHighlight} className="text-amber-400 hover:text-amber-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer">
                      <Plus className="w-3 h-3" /> Add Bullet
                    </button>
                  </div>
                  {currentMemo.property.highlights.map((h, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={h}
                        onChange={(e) => updateHighlight(idx, e.target.value)}
                        className="flex-1 bg-slate-800 border border-slate-700 rounded p-1.5 text-xs"
                      />
                      <button onClick={() => removeHighlight(idx)} className="text-slate-500 hover:text-red-400 cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Description Paragraph</label>
                  <textarea
                    rows={4}
                    value={currentMemo.property.description}
                    onChange={(e) => setCurrentMemo({ ...currentMemo, property: { ...currentMemo.property, description: e.target.value } })}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs outline-none"
                  />
                </div>
              </div>
            )}

            {/* BRANDING TAB */}
            {activeTab === 'broker' && (
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Agency Name</label>
                  <input
                    type="text"
                    value={currentMemo.broker.agency}
                    onChange={(e) => setCurrentMemo({ ...currentMemo, broker: { ...currentMemo.broker, agency: e.target.value } })}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Broker Name</label>
                    <input
                      type="text"
                      value={currentMemo.broker.name}
                      onChange={(e) => setCurrentMemo({ ...currentMemo, broker: { ...currentMemo.broker, name: e.target.value } })}
                      className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Phone</label>
                    <input
                      type="text"
                      value={currentMemo.broker.phone}
                      onChange={(e) => setCurrentMemo({ ...currentMemo, broker: { ...currentMemo.broker, phone: e.target.value } })}
                      className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Left Footer Text</label>
                    <input
                      type="text"
                      value={currentMemo.broker.disclaimerLeft}
                      onChange={(e) => setCurrentMemo({ ...currentMemo, broker: { ...currentMemo.broker, disclaimerLeft: e.target.value } })}
                      className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Right Footer Text</label>
                    <input
                      type="text"
                      value={currentMemo.broker.disclaimerRight}
                      onChange={(e) => setCurrentMemo({ ...currentMemo, broker: { ...currentMemo.broker, disclaimerRight: e.target.value } })}
                      className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs outline-none"
                    />
                  </div>
                </div>

                {/* Custom Assets with Distinct Box Borders */}
                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
                  <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">Custom Assets & Toggles</span>
                  
                  {/* Brokerage Logo Box */}
                  <div className="p-3 bg-slate-900 border border-slate-700/80 rounded-lg space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[11px] font-bold text-slate-200 block">Brokerage Logo</label>
                      <button
                        onClick={() =>
                          setCurrentMemo({
                            ...currentMemo,
                            broker: { ...currentMemo.broker, showLogo: !currentMemo.broker.showLogo },
                          })
                        }
                        className="text-xs text-amber-400 flex items-center gap-1 cursor-pointer hover:underline"
                      >
                        {currentMemo.broker.showLogo ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-slate-500" />}
                        <span className="text-[10px]">{currentMemo.broker.showLogo ? 'Visible' : 'Hidden'}</span>
                      </button>
                    </div>
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'logoUrl')} className="text-xs text-slate-400 w-full cursor-pointer file:mr-3 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700" />
                  </div>

                  {/* Broker Headshot Box */}
                  <div className="p-3 bg-slate-900 border border-slate-700/80 rounded-lg space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[11px] font-bold text-slate-200 block">Broker Headshot</label>
                      <button
                        onClick={() =>
                          setCurrentMemo({
                            ...currentMemo,
                            broker: { ...currentMemo.broker, showHeadshot: !currentMemo.broker.showHeadshot },
                          })
                        }
                        className="text-xs text-amber-400 flex items-center gap-1 cursor-pointer hover:underline"
                      >
                        {currentMemo.broker.showHeadshot ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-slate-500" />}
                        <span className="text-[10px]">{currentMemo.broker.showHeadshot ? 'Visible' : 'Hidden'}</span>
                      </button>
                    </div>
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'headshotUrl')} className="text-xs text-slate-400 w-full cursor-pointer file:mr-3 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700" />
                  </div>
                </div>
              </div>
            )}

            {/* FORMAT TAB */}
            {activeTab === 'design' && (
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] text-amber-400 uppercase tracking-wider block font-bold mb-2">
                    <Layers className="w-3.5 h-3.5 inline mr-1" /> Document Page Depth
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3].map((num) => (
                      <button
                        key={num}
                        onClick={() => setCurrentMemo({ ...currentMemo, pageCount: num })}
                        className={`py-2 text-xs font-bold rounded border transition cursor-pointer ${
                          (currentMemo.pageCount || 1) === num
                            ? 'bg-amber-400 text-slate-950 border-amber-400'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        {num} {num === 1 ? 'Page' : 'Pages'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Page Background Color</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { name: 'White', color: '#ffffff', text: '#0f172a' },
                      { name: 'Warm Luxury', color: '#fdfbf7', text: '#1c1917' },
                      { name: 'Slate Light', color: '#f8fafc', text: '#0f172a' },
                      { name: 'Dark Mode', color: '#0f172a', text: '#f8fafc' },
                    ].map((bg) => (
                      <button
                        key={bg.color}
                        onClick={() =>
                          setCurrentMemo({
                            ...currentMemo,
                            design: { ...currentMemo.design, bgColor: bg.color, textColor: bg.text },
                          })
                        }
                        className={`p-2 rounded text-[10px] font-bold border cursor-pointer ${
                          currentMemo.design.bgColor === bg.color ? 'border-amber-400' : 'border-slate-800'
                        }`}
                        style={{ backgroundColor: bg.color, color: bg.text }}
                      >
                        {bg.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Typography Style</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setCurrentMemo({ ...currentMemo, design: { ...currentMemo.design, fontFamily: 'sans' } })}
                      className={`p-2 text-xs font-sans rounded border cursor-pointer ${
                        currentMemo.design.fontFamily === 'sans' ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      Sans-Serif (Modern)
                    </button>
                    <button
                      onClick={() => setCurrentMemo({ ...currentMemo, design: { ...currentMemo.design, fontFamily: 'serif' } })}
                      className={`p-2 text-xs font-serif rounded border cursor-pointer ${
                        currentMemo.design.fontFamily === 'serif' ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      Serif (Editorial)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Brand Accent Color</label>
                  <div className="flex gap-2">
                    {['#1e3a8a', '#065f46', '#78350f', '#831843', '#0f172a', '#d97706'].map((color) => (
                      <button
                        key={color}
                        onClick={() => setCurrentMemo({ ...currentMemo, design: { ...currentMemo.design, accentColor: color } })}
                        className="w-7 h-7 rounded-full border border-slate-700 transition cursor-pointer"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* MEMOS MANAGER TAB */}
            {activeTab === 'saved' && (
              <div className="space-y-4">
                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg space-y-2.5">
                  <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" /> How Memos Work
                  </span>
                  <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
                    <div className="flex items-start gap-2">
                      <span className="bg-amber-400/10 text-amber-400 border border-amber-400/20 font-bold rounded-full w-4 h-4 text-[10px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                      <p><strong>Create or Import:</strong> Auto-fill property data via MLS lookup or start a new blank memo.</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="bg-amber-400/10 text-amber-400 border border-amber-400/20 font-bold rounded-full w-4 h-4 text-[10px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                      <p><strong>Custom Branding & Layout:</strong> Adjust text, photo galleries, spec grids, logos, and page length in real time.</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="bg-amber-400/10 text-amber-400 border border-amber-400/20 font-bold rounded-full w-4 h-4 text-[10px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                      <p><strong>Save & Duplicate:</strong> Save revisions locally, switch between clients, or clone existing memos for similar listings.</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={createNewMemo}
                  className="w-full bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold py-2 rounded text-xs flex items-center justify-center gap-2 cursor-pointer transition shadow"
                >
                  <Plus className="w-4 h-4" /> Create New Blank Memo
                </button>

                <div className="space-y-2">
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block">Saved Projects List</label>
                  {savedMemos.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => setCurrentMemo(m)}
                      className={`p-3 rounded-lg border cursor-pointer transition flex justify-between items-center ${
                        currentMemo.id === m.id ? 'bg-amber-400/10 border-amber-400' : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="overflow-hidden pr-2">
                        <p className="text-xs font-bold text-slate-200 truncate">{m.memoName}</p>
                        <p className="text-[10px] text-slate-500 truncate">{m.property.location}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={(e) => duplicateMemo(m, e)} className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition" title="Duplicate Memo">
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={(e) => deleteMemo(m.id, e)} className="p-1.5 text-slate-400 hover:text-red-400 rounded hover:bg-slate-800 transition" title="Delete Memo">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT HTML CANVAS PREVIEW */}
        <div className="lg:col-span-7 bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex justify-center items-start overflow-y-auto max-h-[calc(100vh-100px)]">
          <div
            className={`w-[210mm] min-h-[290mm] p-8 flex flex-col justify-between shadow-2xl transition-all ${
              currentMemo.design.fontFamily === 'serif' ? 'font-serif' : 'font-sans'
            }`}
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
                <div className="text-right flex flex-col items-end">
                  {currentMemo.broker.showLogo && currentMemo.broker.logoUrl && (
                    <img src={currentMemo.broker.logoUrl} alt="Logo" className="h-8 object-contain mb-1" />
                  )}
                  <span className="text-xl font-bold font-sans block" style={{ color: currentMemo.design.accentColor }}>
                    {currentMemo.property.price}
                  </span>
                </div>
              </div>

              {currentMemo.property.photos.length > 0 && (
                <div className={`grid ${getCanvasGridClass(currentMemo.property.photos.length)} gap-2 mb-5`}>
                  {currentMemo.property.photos.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt=""
                      className={`w-full rounded border border-black/10 object-cover ${
                        currentMemo.property.photos.length === 1 ? 'h-52' : 'h-28'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* BOLD LABELS & BODY WEIGHT VALUES FOR SPECS */}
              {currentMemo.property.specs.length > 0 && (
                <div className="grid grid-cols-4 gap-2 bg-black/5 p-3 rounded mb-5 text-center">
                  {currentMemo.property.specs.map((s) => (
                    <div key={s.id}>
                      <span className="block text-[9px] uppercase tracking-wider font-bold opacity-100">
                        {s.label}
                      </span>
                      <span className="text-xs font-normal opacity-80 mt-0.5 block">
                        {s.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {currentMemo.property.highlights.length > 0 && (
                <ul className="mb-4 space-y-1 text-xs opacity-90 pl-1">
                  {currentMemo.property.highlights.map((h, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span style={{ color: currentMemo.design.accentColor }}>•</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              )}

              <p className="text-xs leading-relaxed opacity-90">{currentMemo.property.description}</p>
            </div>

            <div className="border-t border-black/10 pt-3 mt-6 flex justify-between items-center font-sans text-[11px] opacity-80">
              <div className="flex items-center gap-2">
                {currentMemo.broker.showHeadshot && currentMemo.broker.headshotUrl && (
                  <img src={currentMemo.broker.headshotUrl} alt="" className="w-7 h-7 rounded-full object-cover" />
                )}
                <div>
                  <p className="font-bold text-xs">{currentMemo.broker.agency}</p>
                  <p>{currentMemo.broker.name} • {currentMemo.broker.phone}</p>
                </div>
              </div>
              <div className="text-right text-[9px] opacity-70">
                <p>{currentMemo.broker.disclaimerLeft}</p>
                <p>{currentMemo.broker.disclaimerRight}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
      </AccessGuard>
  );
}
