'use client';

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  Settings as SettingsIcon, 
  Sun, 
  Moon, 
  Hammer, 
  Menu, 
  X,
  CreditCard
} from 'lucide-react';
import Dashboard from '@/components/Dashboard';
import DocumentForm from '@/components/DocumentForm';
import DocumentHistory from '@/components/DocumentHistory';
import DocumentPreview from '@/components/DocumentPreview';
import Settings from '@/components/Settings';

const INITIAL_MOCK_DOCUMENTS = [
  {
    id: 'bill_1',
    type: 'bill',
    number: 'AE-2026-0001',
    date: '2026-06-15',
    customerName: 'Rajesh Patil',
    customerPhone: '+91-9844012345',
    customerAddress: 'Kaspate Wasti, Wakad, Pune',
    items: [
      { description: 'MS Safety Gate (Designer laser cut sheet)', qty: 45, unit: 'Sq.Ft', rate: 350, amount: 15750 },
      { description: 'Installation Charges', qty: 1, unit: 'Lumpsum', rate: 1500, amount: 1500 }
    ],
    subtotal: 17250,
    gstType: 'none',
    gstRate: 0,
    cgst: 0,
    sgst: 0,
    discount: 500,
    total: 16750,
    notes: 'Thank you for your business with us!',
    paymentStatus: 'paid'
  },
  {
    id: 'quo_1',
    type: 'quotation',
    number: 'AQ-2026-0001',
    date: '2026-07-02',
    customerName: 'Skyline Builders & Developers',
    customerPhone: '+91-7722098765',
    customerAddress: 'Phase 3, Hinjewadi, Pune',
    items: [
      { description: 'SS Balcony Railing (304 Grade)', qty: 85, unit: 'Rft', rate: 650, amount: 55250 },
      { description: 'Laser Cutting CNC Main Gate', qty: 120, unit: 'Sq.Ft', rate: 420, amount: 50400 },
      { description: 'Transport Charges', qty: 1, unit: 'Lumpsum', rate: 2500, amount: 2500 }
    ],
    subtotal: 108150,
    gstType: 'exclusive',
    gstRate: 18,
    cgst: 9733.5,
    sgst: 9733.5,
    discount: 5000,
    total: 122617,
    notes: 'Validity: This quotation is valid for 30 days. Payment terms: 50% advance, balance on delivery.',
  }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'create', 'history', 'settings'
  const [documents, setDocuments] = useState([]);
  const [viewingDoc, setViewingDoc] = useState(null);
  const [editingDoc, setEditingDoc] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sellerInfo, setSellerInfo] = useState(null);

  // Initialize data on mount
  useEffect(() => {
    // Force light mode
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');

    // Documents setup
    const savedDocs = localStorage.getItem('a1_documents');
    if (savedDocs) {
      try {
        setDocuments(JSON.parse(savedDocs));
      } catch (e) {
        setDocuments(INITIAL_MOCK_DOCUMENTS);
      }
    } else {
      setDocuments(INITIAL_MOCK_DOCUMENTS);
      localStorage.setItem('a1_documents', JSON.stringify(INITIAL_MOCK_DOCUMENTS));
    }

    // Load Seller details
    const savedSeller = localStorage.getItem('a1_seller_details');
    if (savedSeller) {
      setSellerInfo(JSON.parse(savedSeller));
    }
  }, []);

  // Sync documents to localStorage
  const saveDocumentsToStorage = (updatedDocs) => {
    setDocuments(updatedDocs);
    localStorage.setItem('a1_documents', JSON.stringify(updatedDocs));
  };

  // Save new or updated document
  const handleSaveDoc = (docData) => {
    let updatedDocs;
    const exists = documents.some(d => d.id === docData.id);
    
    if (exists) {
      updatedDocs = documents.map(d => d.id === docData.id ? docData : d);
    } else {
      updatedDocs = [docData, ...documents];
    }
    
    saveDocumentsToStorage(updatedDocs);
    setViewingDoc(docData);
    setEditingDoc(null);
  };

  // Toggle paid status
  const handleTogglePaidStatus = (id) => {
    const updated = documents.map(d => {
      if (d.id === id && d.type === 'bill') {
        return { ...d, paymentStatus: d.paymentStatus === 'paid' ? 'unpaid' : 'paid' };
      }
      return d;
    });
    saveDocumentsToStorage(updated);
  };

  // Delete document
  const handleDeleteDoc = (id) => {
    if (window.confirm('Are you sure you want to delete this document from history?')) {
      const updated = documents.filter(d => d.id !== id);
      saveDocumentsToStorage(updated);
      if (viewingDoc?.id === id) setViewingDoc(null);
    }
  };

  // Calculate next document sequential index
  const getNextNumber = (type) => {
    const relevantDocs = documents.filter(d => d.type === type);
    return relevantDocs.length + 1;
  };

  // Switch tab handlers
  const navigateToTab = (tab) => {
    setActiveTab(tab);
    setViewingDoc(null);
    setEditingDoc(null);
    setSidebarOpen(false);
  };

  const handleEditDoc = (doc) => {
    setEditingDoc(doc);
    setActiveTab('create');
    setViewingDoc(null);
  };

  const startNewDoc = (type) => {
    setEditingDoc(null);
    setActiveTab('create');
    setViewingDoc(null);
  };

  return (
    <div className="min-h-screen bg-[#f4f6f8] font-sans flex flex-col md:flex-row">
      {/* Sidebar Navigation (Desktop) */}
      <aside className={`fixed md:sticky top-0 left-0 z-35 h-screen w-64 bg-white border-r border-zinc-200/80 p-5 flex flex-col justify-between transition-transform duration-300 md:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="space-y-6">
          {/* Logo Brand Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#0b2240] flex items-center justify-center text-white shadow-sm">
                <Hammer className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-sm text-zinc-800 block leading-tight">
                  A-1 Enterprises
                </span>
                <span className="text-[9px] text-[#2d5e3b] font-bold uppercase tracking-wider block mt-0.5">
                  Fabrication Works
                </span>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1.5 hover:bg-zinc-50 rounded-lg text-zinc-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'create', label: 'Create Invoice', icon: PlusCircle },
              { id: 'history', label: 'Billing History', icon: History },
              { id: 'settings', label: 'Configuration', icon: SettingsIcon }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id && !viewingDoc;
              return (
                <button
                  key={tab.id}
                  onClick={() => navigateToTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#e2ede7] text-[#2d5e3b] font-bold shadow-xs'
                      : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer info */}
        <div className="space-y-3 pt-4 border-t border-zinc-100">
          <div className="text-[11px] text-zinc-400 font-medium leading-relaxed">
            <p className="text-zinc-500 font-semibold">Admin Panel</p>
            <p className="font-medium text-zinc-450">enterprises.a1@gmail.com</p>
          </div>
        </div>
      </aside>

      {/* Backdrop overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-xs md:hidden"
        ></div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-6">
        {/* Top Header bar */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-5 py-4 border-b border-zinc-200 flex justify-between items-center print:hidden">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 hover:bg-zinc-50 rounded-xl text-zinc-650"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-base font-extrabold text-zinc-800 capitalize">
              {viewingDoc 
                ? 'Document Preview' 
                : activeTab === 'dashboard' 
                  ? 'Overview Dashboard' 
                  : activeTab === 'create' 
                    ? editingDoc ? 'Edit Document' : 'New Document'
                    : activeTab === 'history' 
                      ? 'Billing History' 
                      : 'Business Configuration'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
          </div>
        </header>

        {/* Tab/Content Container */}
        <main className="p-5 flex-1 max-w-5xl mx-auto w-full">
          {viewingDoc ? (
            <DocumentPreview 
              doc={viewingDoc} 
              onBack={() => {
                setViewingDoc(null);
                setActiveTab('history');
              }} 
            />
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <Dashboard
                  documents={documents}
                  onCreateBill={() => startNewDoc('bill')}
                  onCreateQuotation={() => startNewDoc('quotation')}
                  onViewDoc={setViewingDoc}
                  onViewHistory={() => setActiveTab('history')}
                />
              )}

              {activeTab === 'create' && (
                <DocumentForm
                  onSave={handleSaveDoc}
                  initialData={editingDoc}
                  nextNumber={getNextNumber(editingDoc?.type || 'bill')}
                />
              )}

              {activeTab === 'history' && (
                <DocumentHistory
                  documents={documents}
                  onView={setViewingDoc}
                  onEdit={handleEditDoc}
                  onDelete={handleDeleteDoc}
                  onTogglePaid={handleTogglePaidStatus}
                />
              )}

              {activeTab === 'settings' && (
                <Settings 
                  onSaveSettings={(data) => setSellerInfo(data)} 
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Hidden on Print & Desktop) */}
      <nav className="fixed bottom-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-md border-t border-zinc-200 py-2 px-3 flex justify-around md:hidden print:hidden shadow-lg">
        {[
          { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
          { id: 'create', label: 'Create', icon: PlusCircle },
          { id: 'history', label: 'History', icon: History },
          { id: 'settings', label: 'Settings', icon: SettingsIcon }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id && !viewingDoc;
          return (
            <button
              key={tab.id}
              onClick={() => navigateToTab(tab.id)}
              className={`flex flex-col items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                isActive
                  ? 'text-[#dda137] font-bold scale-105'
                  : 'text-zinc-400 hover:text-zinc-650'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] tracking-wide font-semibold">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
