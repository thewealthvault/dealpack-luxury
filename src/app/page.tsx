'use client';

import React, { useState, useEffect } from 'react';
import { Download, Building2, Upload, Sparkles, Plus, Trash2, Palette, Shield, Save, FolderOpen, Copy, FileText, Check } from 'lucide-react';
import { DealMemoData } from '@/types';

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

  // Load Saved Memos on Mount
  useEffect(() => {
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
    // Initial setup if empty
    setSavedMemos([DEFAULT_MEMO]);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([DEFAULT_MEMO]));
  }, []);

  // Save Current Memo to Database
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

  // Create New Empty Project
  const handleCreateNewProject = () => {
    const newMemo: DealMemoData = {
      ...DEFAULT_MEMO,
      id: `memo-${Date.now()}`,
      memoName: `New Listing ${savedMemos.length + 1}`,
      updatedAt: new Date().toISOString(),
      property: {
        ...DEFAULT_MEMO.property,
        title: 'NEW LUXURY PROPERTY',
        price: '$0,000,000'
      }
    };
    const newList = [newMemo, ...savedMemos];
    setSavedMemos(newList);
    setCurrentMemo(newMemo);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    setActiveTab('content');
  };

  // Duplicate Current Project
  const handleDuplicateProject = (memoToDup: DealMemoData) => {
    const duplicated: DealMemoData = {
      ...memoToDup,
      id: `memo-${Date.now()}`,
      memoName: `${memoToDup.memoName} (Copy)`,
      updatedAt: new Date().toISOString()
    };
    const newList = [duplicated, ...savedMemos];
    setSavedMemos(newList);
    setCurrentMemo(duplicated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
  };

  // Delete Project
  const handleDeleteProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (savedMemos.length <= 1) {
      alert('You must keep at least one property memo in your database.');
      return;
    }
    const newList = savedMemos.filter((m) => m.id !== id);
    setSavedMemos(newList);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    if (currentMemo.id === id) {
      setCurrentMemo(newList[0]);
    }
  };

  // Photo Handlers
  const handleImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedPhotos = [...currentMemo.property.photos];
        updatedPhotos[index] = reader.result as string;
        setCurrentMemo({
          ...currentMemo,
          property: { ...currentMemo.property, photos: updatedPhotos.slice(0, 4) }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = (index: number) => {
    const updated = currentMemo.property.photos.filter((_, i) => i !== index);
    setCurrentMemo({ ...currentMemo, property: { ...currentMemo.property, photos: updated } });
  };

  // Specs Handlers
  const handleSpecChange = (index: number, field: 'label' | 'value', val: string) => {
    const updated = [...currentMemo.property.specs];
    updated[index][field] = val;
    setCurrentMemo({ ...currentMemo, property: { ...currentMemo.property, specs: updated } });
  };

  const addSpec = () => {
    if (currentMemo.property.specs.length < 6) {
      setCurrentMemo({
        ...currentMemo,
        property: {
          ...currentMemo.property,
          specs: [...currentMemo.property.specs, { label: 'NEW SPEC', value: 'Val' }]
        }
      });
    }
  };

  const removeSpec = (index: number) => {
    const updated = currentMemo.property.specs.filter((_, i) => i !== index);
    setCurrentMemo({ ...currentMemo, property: { ...currentMemo.property, specs: updated } });
  };

  // Highlights Handlers
  const handleHighlightChange = (index: number, value: string) => {
    const updated = [...currentMemo.property.highlights];
    updated[index] = value;
    setCurrentMemo({ ...currentMemo, property: { ...currentMemo.property, highlights: updated } });
  };

  const addHighlight = () => {
    if (currentMemo.property.highlights.length < 5) {
      setCurrentMemo({
        ...currentMemo,
        property: { ...currentMemo.property, highlights: [...currentMemo.property.highlights, ''] }
      });
    }
  };

  const removeHighlight = (index: number) => {
    const updated = currentMemo.property.highlights.filter((_, i) => i !== index);
    setCurrentMemo({ ...currentMemo, property: { ...currentMemo.property, highlights: updated } });
  };

  const photoCount = currentMemo.property.photos.length;

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
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          @page { size: A4 portrait; margin: 0; }
        }
      `}</style>

      {/* Top Bar */}
      <header className="no-print border-b border-slate-800 bg-slate-900/90 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Building2 className="w-6 h-6 text-amber-400" />
          <span className="font-semibold tracking-wider text-lg">DEALPACK LUXURY</span>
          <span className="bg-slate-800 text-amber-400 text-[10px] uppercase tracking-widest px-2 py-0.5 rounded border border-amber-400/20 font-mono">
            Pro Engine
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

          <button
            onClick={() => window.print()}
            className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-5 py-2 rounded-lg flex items-center space-x-2 transition cursor-pointer text-xs shadow-lg"
          >
            <Download className="w-4 h-4" />
            <span>Export Deal Memo (PDF)</span>
          </button>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
        {/* Editor Sidebar */}
        <div className="no-print lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col max-h-[calc(100vh-100px)]">
          
          {/* Project Name Header Input */}
          <div className="mb-4 pb-3 border-b border-slate-800 flex items-center justify-between gap-2">
            <div className="flex-1">
              <label className="text-[9px] text-slate-400 uppercase tracking-widest block font-bold">Project Name in Database</label>
              <input
                type="text"
                value={currentMemo.memoName}
                onChange={(e) => setCurrentMemo({ ...currentMemo, memoName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-amber-300 font-medium outline-none focus:border-amber-400/50"
              />
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

          <div className="flex-1 overflow-y-auto space-y-5 pr-1">
            {/* TAB: SAVED DATABASE PROJECTS */}
            {activeTab === 'saved' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-medium">Saved Projects Portfolio</span>
                  <button
                    onClick={handleCreateNewProject}
                    className="bg-amber-400 text-slate-950 text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1 hover:bg-amber-500 transition"
                  >
                    <Plus className="w-3.5 h-3.5" /> New Project
                  </button>
                </div>

                <div className="space-y-2">
                  {savedMemos.map((memo) => (
                    <div
                      key={memo.id}
                      onClick={() => setCurrentMemo(memo)}
                      className={`p-3 rounded-lg border transition cursor-pointer flex justify-between items-center ${
                        currentMemo.id === memo.id
                          ? 'border-amber-400 bg-amber-400/10'
                          : 'border-slate-800 bg-slate-800/40 hover:bg-slate-800'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-200">{memo.memoName}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {memo.property.title} • {memo.property.price}
                        </p>
                        <p className="text-[9px] text-slate-500 font-mono mt-1">
                          Updated: {new Date(memo.updatedAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center space-x-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicateProject(memo);
                          }}
                          className="p-1.5 text-slate-400 hover:text-amber-400 rounded hover:bg-slate-700"
                          title="Duplicate"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteProject(memo.id, e)}
                          className="p-1.5 text-slate-400 hover:text-red-400 rounded hover:bg-slate-700"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: PROPERTY CONTENT */}
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

                {/* Photos */}
                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-2">Photos (Up to 4)</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[0, 1, 2, 3].map((index) => (
                      <div key={index}>
                        {currentMemo.property.photos[index] ? (
                          <div className="relative h-16 rounded overflow-hidden border border-amber-400/50">
                            <img src={currentMemo.property.photos[index]} alt="" className="w-full h-full object-cover" />
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
                    {currentMemo.property.specs.length < 6 && (
                      <button onClick={addSpec} className="text-[10px] text-amber-400 flex items-center gap-1">
                        <Plus className="w-3 h-3" /> Add Spec
                      </button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {currentMemo.property.specs.map((spec, idx) => (
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
                    {currentMemo.property.highlights.length < 5 && (
                      <button onClick={addHighlight} className="text-[10px] text-amber-400 flex items-center gap-1">
                        <Plus className="w-3 h-3" /> Add Bullet
                      </button>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    {currentMemo.property.highlights.map((item, idx) => (
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
                    value={currentMemo.property.description}
                    onChange={(e) =>
                      setCurrentMemo({ ...currentMemo, property: { ...currentMemo.property, description: e.target.value } })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs outline-none"
                  />
                </div>
              </div>
            )}

            {/* TAB: BROKER & FOOTER */}
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
                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Agent Name</label>
                  <input
                    type="text"
                    value={currentMemo.broker.name}
                    onChange={(e) => setCurrentMemo({ ...currentMemo, broker: { ...currentMemo.broker, name: e.target.value } })}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Phone</label>
                    <input
                      type="text"
                      value={currentMemo.broker.phone}
                      onChange={(e) => setCurrentMemo({ ...currentMemo, broker: { ...currentMemo.broker, phone: e.target.value } })}
                      className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Email</label>
                    <input
                      type="text"
                      value={currentMemo.broker.email}
                      onChange={(e) => setCurrentMemo({ ...currentMemo, broker: { ...currentMemo.broker, email: e.target.value } })}
                      className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Left Footer Note</label>
                  <input
                    type="text"
                    value={currentMemo.broker.disclaimerLeft}
                    onChange={(e) =>
                      setCurrentMemo({ ...currentMemo, broker: { ...currentMemo.broker, disclaimerLeft: e.target.value } })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Right Footer Note</label>
                  <input
                    type="text"
                    value={currentMemo.broker.disclaimerRight}
                    onChange={(e) =>
                      setCurrentMemo({ ...currentMemo, broker: { ...currentMemo.broker, disclaimerRight: e.target.value } })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs outline-none"
                  />
                </div>
              </div>
            )}

            {/* TAB: DESIGN & STYLING */}
            {activeTab === 'design' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Heading Font</label>
                    <select
                      value={currentMemo.design.headingFont}
                      onChange={(e) =>
                        setCurrentMemo({ ...currentMemo, design: { ...currentMemo.design, headingFont: e.target.value } })
                      }
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
                      value={currentMemo.design.bodyFont}
                      onChange={(e) =>
                        setCurrentMemo({ ...currentMemo, design: { ...currentMemo.design, bodyFont: e.target.value } })
                      }
                      className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs outline-none"
                    >
                      <option value="font-sans">Sans-Serif</option>
                      <option value="font-serif">Serif Classic</option>
                    </select>
                  </div>
                </div>

                {/* Accent Colors */}
                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Accent Theme Color</label>
                  <div className="flex gap-2">
                    {[
                      { name: 'Amber Gold', hex: '#b45309' },
                      { name: 'Emerald Green', hex: '#047857' },
                      { name: 'Royal Navy', hex: '#1e3a8a' },
                      { name: 'Deep Burgundy', hex: '#881337' },
                      { name: 'Onyx Black', hex: '#09090b' }
                    ].map((theme) => (
                      <button
                        key={theme.hex}
                        onClick={() =>
                          setCurrentMemo({ ...currentMemo, design: { ...currentMemo.design, accentColor: theme.hex } })
                        }
                        className={`w-8 h-8 rounded-full border-2 transition ${
                          currentMemo.design.accentColor === theme.hex ? 'border-amber-400 scale-110' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: theme.hex }}
                        title={theme.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Paper Background Color Presets */}
                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Paper Background Color</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: 'Pure White', bg: '#ffffff', text: '#0f172a' },
                      { name: 'Warm Ivory', bg: '#fdfbf7', text: '#1c1917' },
                      { name: 'Cream Parchment', bg: '#fef3c7', text: '#451a03' },
                      { name: 'Soft Off-White', bg: '#f8fafc', text: '#0f172a' },
                      { name: 'Dark Executive', bg: '#0f172a', text: '#f8fafc' }
                    ].map((paper) => (
                      <button
                        key={paper.bg}
                        onClick={() =>
                          setCurrentMemo({
                            ...currentMemo,
                            design: { ...currentMemo.design, bgColor: paper.bg, textColor: paper.text }
                          })
                        }
                        className={`p-2 text-xs rounded border text-left font-medium transition flex items-center justify-between ${
                          currentMemo.design.bgColor === paper.bg
                            ? 'border-amber-400 bg-slate-800'
                            : 'border-slate-700 bg-slate-800/50 hover:bg-slate-800'
                        }`}
                      >
                        <span>{paper.name}</span>
                        <span className="w-4 h-4 rounded-full border border-slate-600 inline-block" style={{ backgroundColor: paper.bg }} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Color Pickers */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Custom Paper Color</label>
                    <input
                      type="color"
                      value={currentMemo.design.bgColor}
                      onChange={(e) =>
                        setCurrentMemo({ ...currentMemo, design: { ...currentMemo.design, bgColor: e.target.value } })
                      }
                      className="w-full h-9 bg-slate-800 border border-slate-700 rounded cursor-pointer p-1"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Custom Text Color</label>
                    <input
                      type="color"
                      value={currentMemo.design.textColor}
                      onChange={(e) =>
                        setCurrentMemo({ ...currentMemo, design: { ...currentMemo.design, textColor: e.target.value } })
                      }
                      className="w-full h-9 bg-slate-800 border border-slate-700 rounded cursor-pointer p-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Corner Radius</label>
                  <select
                    value={currentMemo.design.borderRadius}
                    onChange={(e) =>
                      setCurrentMemo({ ...currentMemo, design: { ...currentMemo.design, borderRadius: e.target.value } })
                    }
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

        {/* Executive Dynamic Preview Canvas */}
        <div className="lg:col-span-7 bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex justify-center items-start overflow-y-auto max-h-[calc(100vh-100px)]">
          <div
            id="printable-memo"
            className={`w-[210mm] min-h-[290mm] p-8 flex flex-col justify-between shadow-2xl transition-all ${currentMemo.design.bodyFont}`}
            style={{ backgroundColor: currentMemo.design.bgColor, color: currentMemo.design.textColor }}
          >
            <div>
              {/* Header */}
              <div
                className="flex justify-between items-start border-b-2 pb-4 mb-5"
                style={{ borderColor: currentMemo.design.textColor }}
              >
                <div>
                  <p
                    className="text-[10px] tracking-widest uppercase font-sans font-bold"
                    style={{ color: currentMemo.design.accentColor }}
                  >
                    CONFIDENTIAL MEMORANDUM
                  </p>
                  <h1 className={`text-2xl font-bold tracking-tight mt-0.5 ${currentMemo.design.headingFont}`}>
                    {currentMemo.property.title}
                  </h1>
                  <p className="text-xs font-sans opacity-70 mt-0.5">{currentMemo.property.location}</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold font-sans block" style={{ color: currentMemo.design.accentColor }}>
                    {currentMemo.property.price}
                  </span>
                  <span className="text-[10px] font-sans opacity-60 uppercase tracking-wider">OFF-MARKET</span>
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
                  {currentMemo.property.photos.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt=""
                      className={`w-full object-cover border border-slate-200/20 ${currentMemo.design.borderRadius} ${
                        photoCount === 1 ? 'h-52' : photoCount === 4 ? 'h-28' : 'h-36'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Specs Grid */}
              {currentMemo.property.specs.length > 0 && (
                <div
                  className={`grid gap-2 bg-black/5 border border-black/10 p-3 text-center font-sans mb-5 ${currentMemo.design.borderRadius}`}
                  style={{ gridTemplateColumns: `repeat(${currentMemo.property.specs.length}, minmax(0, 1fr))` }}
                >
                  {currentMemo.property.specs.map((spec, i) => (
                    <div key={i}>
                      <span className="block text-[9px] opacity-60 uppercase">{spec.label}</span>
                      <span className="font-bold text-xs">{spec.value}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Description & Highlights */}
              <div className="space-y-3 text-xs leading-relaxed opacity-90">
                <p className="font-medium">{currentMemo.property.description}</p>
                {currentMemo.property.highlights.length > 0 && (
                  <div>
                    <p className="font-bold text-xs mb-1 uppercase tracking-wide">Key Features & Amenities:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      {currentMemo.property.highlights.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Custom Broker Footer */}
            <div className="border-t border-black/10 pt-3 mt-6 flex justify-between items-center font-sans text-[11px] opacity-80">
              <div>
                <p className="font-bold text-xs">{currentMemo.broker.agency}</p>
                <p>
                  {currentMemo.broker.name} • {currentMemo.broker.phone}
                </p>
                <p>{currentMemo.broker.email}</p>
              </div>
              <div className="text-right text-[10px]">
                <p className="italic font-medium">{currentMemo.broker.disclaimerLeft}</p>
                <p>{currentMemo.broker.disclaimerRight}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
