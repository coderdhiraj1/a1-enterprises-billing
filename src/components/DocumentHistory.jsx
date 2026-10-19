'use client';

import React from 'react';
import Link from 'next/link';
import { Search, Eye, Pencil, Trash2, CheckCircle2, XCircle, FileText, Receipt } from 'lucide-react';

export default function DocumentHistory({ 
  documents = [], 
  onView, 
  onEdit, 
  onDelete, 
  onTogglePaid,
  // Pagination & Filter parameters
  page = 1,
  totalPages = 1,
  totalDocs = 0,
  onPageChange,
  searchTerm = '',
  onSearchChange,
  typeFilter = 'all',
  onTypeFilterChange,
  companyFilter = 'all',
  onCompanyFilterChange,
  isSearching = false
}) {

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-xs flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search documents by name, phone, or number..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-sm focus:ring-2 focus:ring-[#0b2240]/20 focus:border-[#0b2240] text-zinc-800 transition-all placeholder-zinc-400 font-medium"
          />
        </div>
        
        <div className="flex flex-wrap sm:flex-nowrap gap-2 items-center">
          {/* Company Filter Tabs */}
          {onCompanyFilterChange && (
            <div className="flex bg-zinc-100/80 p-1.5 rounded-xl flex-1 sm:flex-none">
              {[
                { value: 'all', label: 'All Companies' },
                { value: 'a1', label: 'A-1' },
                { value: 'shiv_mahima', label: 'Shiv Mahima' }
              ].map(opt => {
                const isActive = companyFilter === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onCompanyFilterChange(opt.value)}
                    className={`flex-1 sm:flex-none px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-white shadow-xs text-[#0b2240]'
                        : 'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-200/50'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Doc Type Filter Tabs */}
          <div className="flex bg-zinc-100/80 p-1.5 rounded-xl flex-1 sm:flex-none">
            {[
              { value: 'all', label: 'All Docs' },
              { value: 'bill', label: 'Invoices' },
              { value: 'quotation', label: 'Quotations' }
            ].map(opt => {
              const isActive = typeFilter === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onTypeFilterChange(opt.value)}
                  className={`flex-1 sm:flex-none px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white shadow-xs text-[#0b2240]'
                      : 'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-200/50'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Documents List */}
      {documents.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-zinc-200/80 text-center shadow-xs max-w-xl mx-auto mt-6">
          <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-[#b2801e]" />
          </div>
          <h3 className="text-base font-bold text-zinc-800">No documents found</h3>
          <p className="text-sm text-zinc-500 mt-2">
            {searchTerm || typeFilter !== 'all'
              ? "We couldn't find any documents matching your filters."
              : "You haven't generated any bills or quotations yet. Create one to get started!"}
          </p>
        </div>
      ) : (
        <div className={`space-y-4 transition-opacity duration-200 ${isSearching ? 'opacity-55 pointer-events-none' : ''}`}>
          {/* Document container card */}
          {/* Document container card */}
          <div className="flex flex-col gap-4 md:gap-0 md:bg-white md:rounded-xl md:border md:border-zinc-200/80 md:shadow-xs md:divide-y md:divide-zinc-100 overflow-hidden">
            {/* Table Header (hidden on mobile, visible on tablet+) */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3.5 bg-zinc-50/80 border-b border-zinc-200 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
              <div className="col-span-2">Date & Number</div>
              <div className="col-span-3">Customer Details</div>
              <div className="col-span-3">Document Status</div>
              <div className="col-span-2 text-right">Total Amount</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {/* Document Rows */}
            {documents.map(doc => {
              const isBill = doc.type === 'bill';
              
              return (
                <div
                  key={doc.id || doc._id}
                  onClick={() => onView && onView(doc)}
                  className="p-4 md:px-6 md:py-4 flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-4 items-stretch md:items-center hover:bg-zinc-50/80 transition-all bg-white rounded-2xl md:rounded-none border border-zinc-200/80 md:border-0 shadow-sm md:shadow-none cursor-pointer"
                >
                  {/* Number & Date */}
                  <div className="col-span-2 flex justify-between items-center md:flex-col md:items-start md:justify-center">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider order-2 md:order-1">
                      {new Date(doc.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                    <div className="flex items-center gap-1.5 order-1 md:order-2 flex-wrap">
                      <span className="text-sm font-black text-[#0b2240]">
                        {doc.number}
                      </span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        doc.companyId === 'shiv_mahima'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                          : 'bg-amber-50 text-[#b2801e] border border-amber-200/60'
                      }`}>
                        {doc.companyId === 'shiv_mahima' ? 'SM' : 'A-1'}
                      </span>
                    </div>
                  </div>

                  {/* Customer Details */}
                  <div className="col-span-3 flex flex-col justify-center">
                    <span className="text-sm font-extrabold text-zinc-800">
                      {doc.customerName}
                    </span>
                    {doc.customerPhone && (
                      <span className="text-[11px] text-zinc-500 font-medium mt-0.5">
                        {doc.customerPhone}
                      </span>
                    )}
                  </div>

                  {/* Badges and Total Wrapper for Mobile Compactness */}
                  <div className="flex justify-between items-center md:contents">
                    {/* Document Type Badge & Bill Payment Status */}
                    <div className="col-span-3 flex flex-wrap gap-2 items-center">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[9px] md:text-[10px] font-bold uppercase tracking-wider ${
                        isBill
                          ? 'bg-[#0b2240]/5 text-[#0b2240] border border-[#0b2240]/10'
                          : 'bg-[#b2801e]/10 text-[#b2801e] border border-[#b2801e]/20'
                      }`}>
                        {isBill ? <Receipt className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                        {isBill ? 'Invoice' : 'Quotation'}
                      </span>

                      {isBill && (
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); onTogglePaid(doc.id || doc._id); }}
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[9px] md:text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                            doc.paymentStatus === 'paid'
                              ? 'bg-[#2d5e3b]/10 text-[#2d5e3b] border-[#2d5e3b]/20 hover:bg-[#2d5e3b]/20'
                              : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                          }`}
                          title="Click to toggle payment status"
                        >
                          {doc.paymentStatus === 'paid' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {doc.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                        </button>
                      )}
                    </div>

                    {/* Total Price */}
                    <div className="col-span-2 flex flex-col md:flex-row justify-end items-end md:items-center">
                      <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider md:hidden">Total Amount</span>
                      <span className="text-sm md:text-[15px] font-black text-[#0b2240]">
                        ₹{doc.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  {/* Row Actions */}
                  <div className="col-span-2 flex justify-end gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-zinc-100">
                    <Link
                      href={`/document/${doc.id || doc._id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 md:flex-none flex justify-center items-center py-1.5 md:p-2 rounded-lg bg-white border border-zinc-200 shadow-sm text-zinc-600 hover:bg-[#0b2240] hover:text-white hover:border-[#0b2240] transition-colors cursor-pointer"
                      title="View & Print"
                    >
                      <Eye className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </Link>
                    <Link
                      href={`/create?edit=${doc.id || doc._id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 md:flex-none flex justify-center items-center py-1.5 md:p-2 rounded-lg bg-white border border-zinc-200 shadow-sm text-zinc-600 hover:bg-[#b2801e] hover:text-white hover:border-[#b2801e] transition-colors cursor-pointer"
                      title="Edit Document"
                    >
                      <Pencil className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onDelete(doc.id || doc._id); }}
                      className="flex-1 md:flex-none flex justify-center items-center py-1.5 md:p-2 rounded-lg bg-rose-50 border border-rose-100 shadow-sm text-rose-600 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls Footer */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-zinc-200 bg-white px-6 py-4 rounded-xl shadow-xs border border-zinc-200/80">
              <div className="text-xs text-zinc-500 font-bold">
                Showing Page <span className="font-extrabold text-zinc-900">{page}</span> of{' '}
                <span className="font-extrabold text-zinc-900">{totalPages}</span>
                <span className="ml-2 font-bold text-zinc-400 normal-case tracking-normal">({totalDocs} items total)</span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onPageChange(page - 1)}
                  disabled={page <= 1}
                  className="px-3.5 py-2 rounded-xl border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 text-xs font-bold disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => onPageChange(page + 1)}
                  disabled={page >= totalPages}
                  className="px-3.5 py-2 rounded-xl border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 text-xs font-bold disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
