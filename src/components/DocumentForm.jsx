'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, User, Phone, MapPin, Receipt, FileText, ChevronDown } from 'lucide-react';

const COMMON_FABRICATION_ITEMS = [
  'MS Safety Gate',
  'SS Balcony Railing',
  'MS Window Grill',
  'SS Staircase Railing',
  'Rolling Shutter',
  'MS Safety Door',
  'Laser Cutting CNC Main Gate',
  'Polycarbonate Shed',
  'MS Spiral Staircase',
  'SS Glass Railing',
  'Structural Fabrication per Kg',
  'Installation Charges',
  'Transport Charges'
];

const UNITS = ['Nos', 'Sq.Ft', 'Rft', 'Kg', 'Lumpsum', 'Set'];

export default function DocumentForm({ onSave, initialData = null, nextNumber = 1, defaultType = 'bill' }) {
  const [docType, setDocType] = useState(defaultType);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [docNumber, setDocNumber] = useState('');
  const [date, setDate] = useState('');
  const [validUntil, setValidUntil] = useState('');
  
  const [items, setItems] = useState([
    { id: '1', description: '', qty: 1, unit: 'Sq.Ft', rate: 0, amount: 0 }
  ]);
  
  const [gstType, setGstType] = useState('none'); // 'none', 'exclusive', 'inclusive'
  const [gstRate, setGstRate] = useState(18);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(null); // stores active item index

  const get30DaysLater = (baseDateStr) => {
    if (!baseDateStr) return '';
    const d = new Date(baseDateStr);
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  };

  const syncValidationNotes = (baseDate, validDate) => {
    if (!baseDate || !validDate) return;
    const d1 = new Date(baseDate);
    const d2 = new Date(validDate);
    const diffTime = d2 - d1;
    const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    setNotes(`Validity: This quotation is valid for ${diffDays} days. Payment terms: 50% advance, balance on delivery.`);
  };

  // Set default state based on edit/new
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setDate(today);

    if (initialData) {
      setDocType(initialData.type);
      setCustomerName(initialData.customerName);
      setCustomerPhone(initialData.customerPhone || '');
      setCustomerAddress(initialData.customerAddress || '');
      setDocNumber(initialData.number);
      setDate(initialData.date);
      setValidUntil(initialData.validUntil || get30DaysLater(initialData.date));
      setItems(initialData.items.map((it, idx) => ({ ...it, id: String(idx + 1) })));
      setGstType(initialData.gstType || 'none');
      setGstRate(initialData.gstRate || 18);
      setDiscount(initialData.discount || 0);
      setNotes(initialData.notes || '');
    } else {
      const year = new Date().getFullYear();
      const prefix = docType === 'bill' ? 'AE' : 'AQ';
      const formattedNum = String(nextNumber).padStart(4, '0');
      setDocNumber(`${prefix}-${year}-${formattedNum}`);
      setValidUntil(get30DaysLater(today));
      
      // Default notes
      setNotes(
        docType === 'bill'
          ? 'Thank you for your business with us!'
          : 'Validity: This quotation is valid for 30 days. Payment terms: 50% advance, balance on delivery.'
      );
    }
  }, [initialData, nextNumber]);

  // Handle docType toggle details
  const handleDocTypeChange = (type) => {
    setDocType(type);
    
    // Switch prefix of document number if it exists and uses standard structure
    if (docNumber && (docNumber.startsWith('AE-') || docNumber.startsWith('AQ-'))) {
      const newNum = type === 'bill' 
        ? docNumber.replace(/^AQ-/, 'AE-') 
        : docNumber.replace(/^AE-/, 'AQ-');
      setDocNumber(newNum);
    } else {
      const year = new Date().getFullYear();
      const prefix = type === 'bill' ? 'AE' : 'AQ';
      const formattedNum = String(nextNumber).padStart(4, '0');
      setDocNumber(`${prefix}-${year}-${formattedNum}`);
    }
    
    if (type === 'quotation') {
      const defaultValidDate = get30DaysLater(date);
      setValidUntil(defaultValidDate);
      setNotes('Validity: This quotation is valid for 30 days. Payment terms: 50% advance, balance on delivery.');
    } else {
      setNotes('Thank you for your business with us!');
    }
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);
    if (docType === 'quotation') {
      const newValid = get30DaysLater(newDate);
      setValidUntil(newValid);
      syncValidationNotes(newDate, newValid);
    }
  };

  const handleValidUntilChange = (newValid) => {
    setValidUntil(newValid);
    if (docType === 'quotation') {
      syncValidationNotes(date, newValid);
    }
  };

  // Add Item row
  const addItemRow = () => {
    const newId = String(items.length + 1);
    setItems([...items, { id: newId, description: '', qty: 1, unit: 'Sq.Ft', rate: 0, amount: 0 }]);
  };

  // Delete Item row
  const deleteItemRow = (id) => {
    if (items.length === 1) return;
    const filtered = items.filter(it => it.id !== id);
    setItems(filtered);
  };

  // Update Item row
  const updateItemRow = (id, key, value) => {
    const updated = items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [key]: value };
        // Recalculate amount
        if (key === 'qty' || key === 'rate') {
          const qtyVal = key === 'qty' ? Number(value) : Number(item.qty);
          const rateVal = key === 'rate' ? Number(value) : Number(item.rate);
          updatedItem.amount = Number((qtyVal * rateVal).toFixed(2));
        }
        return updatedItem;
      }
      return item;
    });
    setItems(updated);
  };

  // Select suggestion
  const selectSuggestion = (index, value) => {
    const updated = items.map((item, idx) => {
      if (idx === index) {
        return { ...item, description: value };
      }
      return item;
    });
    setItems(updated);
    setShowSuggestions(null);
  };

  // Calculations
  const subtotal = Number(items.reduce((sum, item) => sum + item.amount, 0).toFixed(2));
  
  let gstAmount = 0;
  let cgst = 0;
  let sgst = 0;
  let total = subtotal;

  if (gstType === 'exclusive') {
    gstAmount = Number((subtotal * (gstRate / 100)).toFixed(2));
    cgst = Number((gstAmount / 2).toFixed(2));
    sgst = Number((gstAmount / 2).toFixed(2));
    total = Number((subtotal + gstAmount - Number(discount)).toFixed(2));
  } else if (gstType === 'inclusive') {
    // Inclusive: Tax = Total - (Total / (1 + Rate%))
    gstAmount = Number((subtotal - (subtotal / (1 + (gstRate / 100)))).toFixed(2));
    cgst = Number((gstAmount / 2).toFixed(2));
    sgst = Number((gstAmount / 2).toFixed(2));
    total = Number((subtotal - Number(discount)).toFixed(2)); // subtotal already includes tax
  } else {
    total = Number((subtotal - Number(discount)).toFixed(2));
  }

  // Ensure total doesn't go negative
  total = Math.max(0, total);

  // Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customerName.trim()) return;
    
    const docData = {
      id: initialData?.id || `${docType}_${Date.now()}`,
      type: docType,
      number: docNumber,
      date,
      validUntil: docType === 'quotation' ? validUntil : null,
      customerName,
      customerPhone,
      customerAddress,
      items: items.map(({ description, qty, unit, rate, amount }) => ({
        description,
        qty: Number(qty),
        unit,
        rate: Number(rate),
        amount: Number(amount)
      })),
      subtotal,
      gstType,
      gstRate,
      cgst,
      sgst,
      discount: Number(discount),
      total,
      notes,
      paymentStatus: docType === 'bill' ? (initialData?.paymentStatus === 'paid' ? 'paid' : 'unpaid') : 'quote'
    };
    
    onSave(docData);
  };

  return (
    <div className="bg-white rounded-xl border border-zinc-200 shadow-xs overflow-hidden">
      {/* Header Controls */}
      <div className="bg-white border-b border-zinc-200 px-6 py-5 flex justify-between items-center flex-wrap gap-3">
        <div>
          <h2 className="text-base font-extrabold text-zinc-800 tracking-tight">
            {initialData ? 'Edit Document' : 'Generate New Document'}
          </h2>
          <p className="text-xs text-zinc-400 mt-1">Create customized receipts and quotes for clients</p>
        </div>
        <div className="flex bg-zinc-100/80 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => handleDocTypeChange('bill')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all cursor-pointer ${
              docType === 'bill' 
                ? 'bg-white text-zinc-800 shadow-xs' 
                : 'text-zinc-500 hover:text-zinc-700'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            Cash Bill
          </button>
          <button
            type="button"
            onClick={() => handleDocTypeChange('quotation')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all cursor-pointer ${
              docType === 'quotation' 
                ? 'bg-white text-zinc-800 shadow-xs' 
                : 'text-zinc-500 hover:text-zinc-700'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Quotation
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Document Info Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
              Document Number
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400">
                <span className="text-sm font-semibold">#</span>
              </span>
              <input
                type="text"
                value={docNumber}
                onChange={(e) => setDocNumber(e.target.value)}
                className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 text-sm font-medium focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all text-zinc-800 dark:text-zinc-200"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
              Date
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400">
                <Calendar className="w-4 h-4" />
              </span>
              <input
                type="date"
                value={date}
                onChange={(e) => handleDateChange(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 text-sm font-medium focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all text-zinc-800 dark:text-zinc-200"
                required
              />
            </div>
          </div>

          {docType === 'quotation' && (
            <div>
              <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                Valid Until
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400">
                  <Calendar className="w-4 h-4 text-emerald-500" />
                </span>
                <input
                  type="date"
                  value={validUntil}
                  onChange={(e) => handleValidUntilChange(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 text-sm font-medium focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all text-zinc-800 dark:text-zinc-200"
                />
              </div>
            </div>
          )}
        </div>

        {/* Customer Details Card */}
        <div className="bg-zinc-50/70 dark:bg-zinc-800/20 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800/50 space-y-4">
          <h3 className="text-xs font-bold text-teal-800 dark:text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            Client / Customer Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">
                Customer Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="e.g. Rajesh Kumar"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-zinc-800 dark:text-zinc-200 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400">
                  <Phone className="w-4 h-4" />
                </span>
                <input
                  type="tel"
                  placeholder="e.g. +91 98765 43210"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-zinc-800 dark:text-zinc-200 transition-all"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">
                Billing Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 pt-3 items-start text-zinc-400">
                  <MapPin className="w-4 h-4" />
                </span>
                <textarea
                  placeholder="e.g. Plot No. 12, Hinjewadi Phase 1, Pune"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  rows="2"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-zinc-800 dark:text-zinc-200 transition-all resize-none animate-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Items Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-[#0b2240] uppercase tracking-wider flex items-center gap-1.5">
              <Receipt className="w-3.5 h-3.5 text-[#dda137]" />
              Material & Fabrication Items
            </h3>
            <button
              type="button"
              onClick={addItemRow}
              className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-[#b2801e] rounded-lg text-xs font-semibold transition-all border border-amber-200/50 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Item
            </button>
          </div>

          <div className="space-y-3.5">
            {items.map((item, index) => (
              <div 
                key={item.id} 
                className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-4 bg-zinc-50 dark:bg-zinc-800/30 rounded-xl border border-zinc-200/55 dark:border-zinc-800/40 items-start relative group"
              >
                {/* Mobile Drag/Count */}
                <div className="sm:hidden absolute left-3 top-3 text-[10px] font-bold text-zinc-400 uppercase bg-zinc-200/50 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                  Item #{index + 1}
                </div>

                {/* Description Column */}
                <div className="sm:col-span-4 relative mt-3 sm:mt-0">
                  <label className="block text-[10px] font-bold text-zinc-400 sm:hidden uppercase mb-1">
                    Item Description
                  </label>
                  <input
                    type="text"
                    placeholder="Enter item name or select suggestion..."
                    value={item.description}
                    onChange={(e) => {
                      updateItemRow(item.id, 'description', e.target.value);
                      setShowSuggestions(index);
                    }}
                    onFocus={() => setShowSuggestions(index)}
                    onBlur={() => setTimeout(() => setShowSuggestions(null), 200)}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 text-sm focus:ring-2 focus:ring-teal-500 text-zinc-800 dark:text-zinc-200 transition-all"
                  />
                  {showSuggestions === index && (
                    <div className="absolute z-20 w-full mt-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-xl max-h-52 overflow-y-auto">
                      {COMMON_FABRICATION_ITEMS.filter(sug => 
                        sug.toLowerCase().includes((item.description || '').toLowerCase())
                      ).map((sug, sIdx) => (
                        <button
                          key={sIdx}
                          type="button"
                          onMouseDown={() => selectSuggestion(index, sug)}
                          className="w-full text-left px-3 py-2 text-xs text-zinc-700 dark:text-zinc-200 hover:bg-teal-50 dark:hover:bg-zinc-700 transition-colors border-b border-zinc-100 dark:border-zinc-800 last:border-b-0"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quantity */}
                <div className="sm:col-span-2 grid grid-cols-2 gap-1.5 sm:block">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 sm:hidden uppercase mb-1">
                      Qty
                    </label>
                    <input
                      type="number"
                      step="any"
                      min="0.01"
                      value={item.qty}
                      onChange={(e) => updateItemRow(item.id, 'qty', e.target.value)}
                      placeholder="Qty"
                      className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 text-sm text-center focus:ring-2 focus:ring-teal-500 text-zinc-800 dark:text-zinc-200"
                      required
                    />
                  </div>

                  {/* Unit inside the same Qty col for small screens */}
                  <div className="sm:hidden">
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">
                      Unit
                    </label>
                    <div className="relative">
                      <select
                        value={item.unit}
                        onChange={(e) => updateItemRow(item.id, 'unit', e.target.value)}
                        className="w-full appearance-none pl-3 pr-8 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 text-sm focus:ring-2 focus:ring-teal-500 text-zinc-800 dark:text-zinc-200"
                      >
                        {UNITS.map(u => (
                          <option key={u} value={u}>{u}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Unit for desktop screens */}
                <div className="hidden sm:block sm:col-span-2">
                  <div className="relative">
                    <select
                      value={item.unit}
                      onChange={(e) => updateItemRow(item.id, 'unit', e.target.value)}
                      className="w-full appearance-none pl-3 pr-8 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-855 text-sm focus:ring-2 focus:ring-teal-500 text-zinc-800 dark:text-zinc-200"
                    >
                      {UNITS.map(u => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                  </div>
                </div>

                {/* Rate */}
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-zinc-400 sm:hidden uppercase mb-1">
                    Rate (₹)
                  </label>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    placeholder="Rate"
                    value={item.rate === 0 ? '' : item.rate}
                    onChange={(e) => updateItemRow(item.id, 'rate', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-855 text-sm text-right focus:ring-2 focus:ring-teal-500 text-zinc-800 dark:text-zinc-200"
                    required
                  />
                </div>

                {/* Amount Output & Delete Button */}
                <div className="sm:col-span-2 flex items-center justify-between sm:justify-end gap-3 mt-3 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-zinc-200 dark:border-zinc-700/60 w-full sm:self-center">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 sm:hidden uppercase mb-0.5">
                      Amount
                    </label>
                    <div className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                      ₹{item.amount.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteItemRow(item.id)}
                    className="p-1.5 text-zinc-400 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
                    disabled={items.length === 1}
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Calculation & Settings Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          {/* Notes & GST Config */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                Tax Configuration (GST)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'none', label: 'No GST' },
                  { value: 'exclusive', label: '18% Ext' },
                  { value: 'inclusive', label: '18% Inc' }
                ].map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setGstType(opt.value);
                      setGstRate(opt.value === 'none' ? 0 : 18);
                    }}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                      gstType === opt.value
                        ? 'bg-amber-500/10 border-[#dda137] text-[#b2801e]'
                        : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                Terms / Notes
              </label>
              <textarea
                placeholder="Include custom terms or details..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows="3"
                className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 text-sm focus:ring-2 focus:ring-teal-500 text-zinc-800 dark:text-zinc-200 resize-none transition-all"
              />
            </div>
          </div>

          {/* Pricing Totals list */}
          <div className="bg-zinc-50 dark:bg-zinc-800/25 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800/50 space-y-3.5 h-fit">
            <h4 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Summary Details
            </h4>
            
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500 dark:text-zinc-400">Subtotal</span>
              <span className="font-semibold text-zinc-700 dark:text-zinc-200">
                ₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>

            {gstType !== 'none' && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500 dark:text-zinc-400">CGST (9%)</span>
                  <span className="font-semibold text-zinc-700 dark:text-zinc-200">
                    ₹{cgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500 dark:text-zinc-400">SGST (9%)</span>
                  <span className="font-semibold text-zinc-700 dark:text-zinc-200">
                    ₹{sgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </>
            )}

            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-500 dark:text-zinc-400">Discount (Flat ₹)</span>
              <input
                type="number"
                min="0"
                max={subtotal}
                value={discount === 0 ? '' : discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                placeholder="₹0.00"
                className="w-28 px-2.5 py-1 text-right text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 font-semibold focus:ring-2 focus:ring-teal-500 text-zinc-800 dark:text-zinc-100"
              />
            </div>

            <div className="border-t border-zinc-200 pt-3 flex justify-between items-center">
              <span className="text-sm font-bold text-zinc-700">Grand Total</span>
              <span className="text-xl font-extrabold text-[#0b2240]">
                ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 justify-end pt-4 border-t border-zinc-100">
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#0b2240] hover:bg-[#1a3556] text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            {initialData ? 'Update & Preview' : 'Generate & Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
