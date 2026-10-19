'use client';

import React from 'react';
import { 
  DollarSign, 
  Receipt, 
  FileText, 
  Clock, 
  ArrowUpRight, 
  CheckCircle2, 
  Plus, 
  TrendingUp, 
  Briefcase 
} from 'lucide-react';

// Helper to render KPI amounts cleanly with smaller fractional decimals to prevent overflow
function formatKPIAmount(amount) {
  const parts = Number(amount || 0).toLocaleString('en-IN', {
    maximumFractionDigits: 2,
  }).split('.');

  const fullFormatted = Number(amount || 0).toLocaleString('en-IN', {
    minimumFractionDigits: parts[1] ? 2 : 0,
    maximumFractionDigits: 2,
  });

  return (
    <div 
      className="flex items-baseline tracking-tight truncate" 
      title={`₹${fullFormatted}`}
    >
      <span className="text-xl sm:text-2xl lg:text-[23px] xl:text-[25px] font-black text-zinc-950">
        ₹{parts[0]}
      </span>
      {parts[1] && (
        <span className="text-xs sm:text-sm font-bold text-zinc-400 ml-0.5">
          .{parts[1]}
        </span>
      )}
    </div>
  );
}

export default function Dashboard({ documents, onCreateBill, onCreateQuotation, onViewDoc, onViewHistory }) {
  // Calculations
  const bills = documents.filter(d => d.type === 'bill');
  const quotations = documents.filter(d => d.type === 'quotation');

  const totalInvoiced = bills.reduce((sum, d) => sum + d.total, 0);
  const totalCollected = bills.filter(d => d.paymentStatus === 'paid').reduce((sum, d) => sum + d.total, 0);
  const totalPending = bills.filter(d => d.paymentStatus === 'unpaid').reduce((sum, d) => sum + d.total, 0);

  const recentDocs = [...documents]
    .sort((a, b) => new Date(b.date) - new Date(a.date) || b.id.localeCompare(a.id))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header Title & Actions Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block mb-0.5">
            A-1 Enterprises Dashboard
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
            Overview
          </h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onCreateBill}
            className="flex items-center gap-1.5 px-4.5 py-2 bg-[#0b2240] hover:bg-[#1a3556] text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            New Bill
          </button>
          <button
            onClick={onCreateQuotation}
            className="flex items-center gap-1.5 px-4.5 py-2 bg-white hover:bg-zinc-50 text-zinc-700 border border-zinc-300 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            New Quote
          </button>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales */}
        <div className="bg-white p-5 rounded-xl border border-zinc-200/80 shadow-xs flex flex-col justify-between min-h-[115px] transition-all hover:border-zinc-300">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
              Total Sales
            </span>
            <span className="p-2 bg-amber-50 text-[#b2801e] rounded-xl shrink-0">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2.5">
            {formatKPIAmount(totalInvoiced)}
            <div className="text-[10px] text-zinc-400 font-medium mt-0.5">
              {bills.length} bills generated
            </div>
          </div>
        </div>

        {/* Collected */}
        <div className="bg-white p-5 rounded-xl border border-zinc-200/80 shadow-xs flex flex-col justify-between min-h-[115px] transition-all hover:border-zinc-300">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
              Collected
            </span>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2.5">
            {formatKPIAmount(totalCollected)}
            <div className="text-[10px] text-zinc-400 font-medium mt-0.5">
              Paid cash memos
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white p-5 rounded-xl border border-zinc-200/80 shadow-xs flex flex-col justify-between min-h-[115px] transition-all hover:border-zinc-300">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
              Pending
            </span>
            <span className="p-2 bg-rose-50 text-rose-600 rounded-xl shrink-0">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2.5">
            {formatKPIAmount(totalPending)}
            <div className="text-[10px] text-zinc-400 font-medium mt-0.5">
              Unpaid invoices
            </div>
          </div>
        </div>

        {/* Quotations */}
        <div className="bg-white p-5 rounded-xl border border-zinc-200/80 shadow-xs flex flex-col justify-between min-h-[115px] transition-all hover:border-zinc-300">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
              Quotations
            </span>
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
              <Briefcase className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2.5">
            <div className="flex items-baseline tracking-tight truncate">
              <span className="text-xl sm:text-2xl lg:text-[23px] xl:text-[25px] font-black text-zinc-950">
                {quotations.length}
              </span>
            </div>
            <div className="text-[10px] text-zinc-400 font-medium mt-0.5">
              Project quotes sent
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-xl border border-zinc-200/80 shadow-xs overflow-hidden">
        <div className="px-5 py-4.5 border-b border-zinc-200 flex justify-between items-center bg-zinc-50/20">
          <h3 className="text-sm font-bold text-zinc-800 uppercase tracking-wider">
            Recently Updated Invoices & Quotes
          </h3>
          <button
            onClick={onViewHistory}
            className="flex items-center gap-1 text-xs font-bold text-[#b2801e] hover:text-[#dda137] transition-colors cursor-pointer"
          >
            View All History
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentDocs.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm text-zinc-400">No documents created yet. Get started by clicking "New Bill" above.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {recentDocs.map(doc => {
              const isBill = doc.type === 'bill';
              return (
                <div
                  key={doc.id}
                  onClick={() => onViewDoc(doc)}
                  className="px-5 py-3.5 hover:bg-zinc-50/50 cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl border ${
                      isBill
                        ? 'bg-amber-50 border-amber-100 text-[#b2801e]'
                        : 'bg-indigo-50 border-indigo-100 text-indigo-600'
                    }`}>
                      {isBill ? <Receipt className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-zinc-700">{doc.number}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          doc.companyId === 'shiv_mahima'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                            : 'bg-amber-50 text-[#b2801e] border border-amber-200/60'
                        }`}>
                          {doc.companyId === 'shiv_mahima' ? 'Shiv Mahima' : 'A-1'}
                        </span>
                        <span>•</span>
                        <span>
                          {new Date(doc.date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="text-sm font-bold text-zinc-805 mt-0.5">
                        {doc.customerName}
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-3">
                    <div>
                      <div className="text-sm font-black text-zinc-900">
                        ₹{doc.total.toLocaleString('en-IN')}
                      </div>
                      <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded mt-0.5 uppercase tracking-wide ${
                        isBill
                          ? doc.paymentStatus === 'paid'
                            ? 'bg-[#e2f0e7] text-[#2e6f40]'
                            : 'bg-[#fdf3e2] text-[#c97d1e]'
                          : 'bg-[#e0e7ff] text-[#4f46e5]'
                      }`}>
                        {isBill ? doc.paymentStatus : 'Quotation'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
