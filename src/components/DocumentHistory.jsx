'use client';

import React, { useState } from 'react';
import { Search, Filter, Eye, Copy, Trash2, CheckCircle2, XCircle, FileText, Receipt, ArrowRight } from 'lucide-react';

export default function DocumentHistory({ documents, onView, onEdit, onDelete, onTogglePaid }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'bill', 'quotation'

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = 
      doc.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.customerPhone && doc.customerPhone.includes(searchTerm)) ||
      doc.number.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesType = filterType === 'all' || doc.type === filterType;
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by customer name, phone, or bill/quote #..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 text-sm focus:ring-2 focus:ring-teal-500 text-zinc-800 dark:text-zinc-100 transition-all placeholder-zinc-400"
          />
        </div>
        
        <div className="flex gap-2">
          {[
            { value: 'all', label: 'All Docs', icon: FileText },
            { value: 'bill', label: 'Bills Only', icon: Receipt },
            { value: 'quotation', label: 'Quotations Only', icon: FileText }
          ].map(opt => {
            const Icon = opt.icon;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setFilterType(opt.value)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  filterType === opt.value
                    ? 'bg-[#0b2240] border-[#0b2240] text-white shadow-sm'
                    : 'bg-white border-zinc-200 text-zinc-650 hover:bg-zinc-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Documents List */}
      {filteredDocs.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-zinc-150 text-center shadow-sm max-w-xl mx-auto mt-6">
          <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-[#b2801e]" />
          </div>
          <h3 className="text-base font-bold text-zinc-800">No documents found</h3>
          <p className="text-sm text-zinc-500 mt-2">
            {searchTerm || filterType !== 'all'
              ? "We couldn't find any documents matching your filters."
              : "You haven't generated any bills or quotations yet. Create one to get started!"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Document container card */}
          <div className="bg-white rounded-xl border border-zinc-200/80 shadow-xs divide-y divide-zinc-100 overflow-hidden">
            {/* Table Header (hidden on mobile, visible on tablet+) */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3.5 bg-zinc-50/50 text-[10px] font-bold text-zinc-450 uppercase tracking-wider">
              <div className="col-span-2">Date & Number</div>
              <div className="col-span-4">Customer Details</div>
              <div className="col-span-2">Document Type</div>
              <div className="col-span-2 text-right">Total Amount</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {/* Document Rows */}
            {filteredDocs.map(doc => {
              const isBill = doc.type === 'bill';
              
              return (
                <div
                  key={doc.id}
                  className="p-4 md:px-6 md:py-4.5 grid grid-cols-1 md:grid-cols-12 gap-3 items-center hover:bg-zinc-50/30 transition-colors bg-white"
                >
                  {/* Number & Date */}
                  <div className="col-span-2 flex flex-col gap-0.5">
                    <span className="text-[10px] font-semibold text-zinc-400">
                      {new Date(doc.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                    <span className="text-sm font-bold text-zinc-800">
                      {doc.number}
                    </span>
                  </div>

                  {/* Customer Details */}
                  <div className="col-span-4 flex flex-col justify-center">
                    <span className="text-sm font-extrabold text-zinc-850">
                      {doc.customerName}
                    </span>
                    {doc.customerPhone && (
                      <span className="text-[11px] text-zinc-400 font-medium">
                        {doc.customerPhone}
                      </span>
                    )}
                  </div>

                  {/* Document Type Badge & Bill Payment Status */}
                  <div className="col-span-2 flex flex-wrap gap-2 items-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      isBill
                        ? 'bg-amber-50 text-[#b2801e]'
                        : 'bg-indigo-50 text-[#4f46e5]'
                    }`}>
                      {isBill ? (
                        <>
                          <Receipt className="w-3 h-3" />
                          Bill
                        </>
                      ) : (
                        <>
                          <FileText className="w-3 h-3" />
                          Quote
                        </>
                      )}
                    </span>

                    {isBill && (
                      <button
                        type="button"
                        onClick={() => onTogglePaid(doc.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-all cursor-pointer ${
                          doc.paymentStatus === 'paid'
                            ? 'bg-[#e2f0e7] text-[#2e6f40] hover:bg-[#d1e7d8]'
                            : 'bg-[#fdf3e2] text-[#c97d1e] hover:bg-[#faecd1]'
                        }`}
                        title="Click to toggle payment status"
                      >
                        {doc.paymentStatus === 'paid' ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-[#2e6f40]" />
                            Paid
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-[#c97d1e]" />
                            Unpaid
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Total Price */}
                  <div className="col-span-2 md:text-right flex items-center md:justify-end gap-1.5 md:gap-0 mt-1 md:mt-0 pt-2 md:pt-0 border-t md:border-t-0 border-zinc-100">
                    <span className="text-xs text-zinc-400 md:hidden font-medium">Grand Total:</span>
                    <span className="text-sm font-extrabold text-zinc-900">
                      ₹{doc.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  {/* Row Actions */}
                  <div className="col-span-2 flex justify-end gap-4 mt-2 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-zinc-100 text-zinc-400">
                    <button
                      type="button"
                      onClick={() => onView(doc)}
                      className="hover:text-zinc-800 transition-colors cursor-pointer"
                      title="View & Print Invoice"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => onEdit(doc)}
                      className="hover:text-indigo-650 transition-colors cursor-pointer"
                      title="Copy details / Edit"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(doc.id)}
                      className="hover:text-rose-600 transition-colors cursor-pointer"
                      title="Delete invoice"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
