'use client';

import React from 'react';

export function DashboardShimmer() {
  return (
    <div className="space-y-6">
      {/* Title block */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-2.5 w-24 bg-zinc-200 rounded-full shimmer-bg"></div>
          <div className="h-6 w-32 bg-zinc-300 rounded-lg shimmer-bg"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-20 bg-zinc-200 rounded-lg shimmer-bg"></div>
          <div className="h-9 w-24 bg-zinc-200 rounded-lg shimmer-bg"></div>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(idx => (
          <div key={idx} className="bg-white p-5 rounded-xl border border-zinc-200/80 space-y-4">
            <div className="flex justify-between items-start">
              <div className="h-7 w-20 bg-zinc-200 rounded-lg shimmer-bg"></div>
              <div className="h-8 w-8 bg-zinc-100 rounded-lg shimmer-bg"></div>
            </div>
            <div className="h-3 w-16 bg-zinc-200 rounded-full shimmer-bg"></div>
          </div>
        ))}
      </div>

      {/* Activity Card */}
      <div className="bg-white p-5 rounded-xl border border-zinc-200/80 space-y-4">
        <div className="h-4.5 w-32 bg-zinc-300 rounded-lg shimmer-bg pb-2"></div>
        <div className="space-y-3.5 pt-2">
          {[1, 2, 3, 4].map(idx => (
            <div key={idx} className="flex items-center justify-between pb-3.5 border-b border-zinc-100 last:border-b-0 last:pb-0">
              <div className="flex items-center gap-3">
                <div className="h-7 w-7 bg-zinc-200 rounded-full shimmer-bg"></div>
                <div className="space-y-2">
                  <div className="h-3.5 w-24 bg-zinc-300 rounded-lg shimmer-bg"></div>
                  <div className="h-2.5 w-16 bg-zinc-200 rounded-full shimmer-bg"></div>
                </div>
              </div>
              <div className="h-4.5 w-16 bg-zinc-200 rounded-lg shimmer-bg"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function FormShimmer() {
  return (
    <div className="bg-white rounded-xl border border-zinc-200 shadow-xs overflow-hidden">
      {/* Form Header */}
      <div className="border-b border-zinc-200 px-6 py-5 flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-5 w-28 bg-zinc-300 rounded-lg shimmer-bg"></div>
          <div className="h-3 w-40 bg-zinc-200 rounded-full shimmer-bg"></div>
        </div>
        <div className="h-7 w-32 bg-zinc-200 rounded-full shimmer-bg"></div>
      </div>

      <div className="p-6 space-y-6">
        {/* Info row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[1, 2, 3].map(idx => (
            <div key={idx} className="space-y-2">
              <div className="h-3 w-16 bg-zinc-200 rounded-full shimmer-bg"></div>
              <div className="h-9 w-full bg-zinc-100 rounded-lg shimmer-bg"></div>
            </div>
          ))}
        </div>

        {/* Big Info Block */}
        <div className="bg-zinc-50/50 p-5 rounded-xl border border-zinc-200 space-y-4">
          <div className="h-4 w-36 bg-zinc-300 rounded-lg shimmer-bg"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="h-3 w-16 bg-zinc-200 rounded-full shimmer-bg"></div>
              <div className="h-9 w-full bg-white border border-zinc-200 rounded-lg shimmer-bg"></div>
            </div>
            <div className="space-y-2">
              <div className="h-3 w-16 bg-zinc-200 rounded-full shimmer-bg"></div>
              <div className="h-9 w-full bg-white border border-zinc-200 rounded-lg shimmer-bg"></div>
            </div>
          </div>
        </div>

        {/* Items rows */}
        <div className="space-y-3.5">
          <div className="h-4 w-28 bg-zinc-300 rounded-lg shimmer-bg"></div>
          {[1, 2].map(idx => (
            <div key={idx} className="h-14 w-full bg-zinc-50 rounded-xl border border-zinc-200 shimmer-bg"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function HistoryShimmer() {
  return (
    <div className="bg-white rounded-xl border border-zinc-200 shadow-xs overflow-hidden">
      {/* Search Header */}
      <div className="p-6 border-b border-zinc-200 bg-zinc-50/20">
        <div className="flex flex-col md:flex-row gap-3.5 items-stretch md:items-center">
          <div className="flex-1 h-9 bg-zinc-100 rounded-lg shimmer-bg"></div>
          <div className="flex gap-2">
            <div className="h-9 w-20 bg-zinc-100 rounded-lg shimmer-bg"></div>
            <div className="h-9 w-20 bg-zinc-100 rounded-lg shimmer-bg"></div>
          </div>
        </div>
      </div>

      {/* Row List */}
      <div className="divide-y divide-zinc-200">
        {[1, 2, 3, 4, 5].map(idx => (
          <div key={idx} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-7 w-7 bg-zinc-200 rounded-full shimmer-bg"></div>
              <div className="space-y-2">
                <div className="h-4 w-24 bg-zinc-300 rounded-lg shimmer-bg"></div>
                <div className="h-3 w-16 bg-zinc-200 rounded-full shimmer-bg"></div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="h-4 w-12 bg-zinc-200 rounded-full shimmer-bg"></div>
              <div className="h-4.5 w-16 bg-zinc-200 rounded-lg shimmer-bg"></div>
              <div className="flex gap-2.5">
                <div className="h-6 w-6 bg-zinc-200 rounded-lg shimmer-bg"></div>
                <div className="h-6 w-6 bg-zinc-200 rounded-lg shimmer-bg"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PreviewShimmer() {
  return (
    <div className="space-y-6">
      {/* Header bar controls */}
      <div className="flex justify-between items-center print:hidden">
        <div className="h-8 w-20 bg-zinc-200 rounded-lg shimmer-bg"></div>
        <div className="h-8 w-24 bg-zinc-200 rounded-lg shimmer-bg"></div>
      </div>

      {/* A4 sheet skeleton */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 md:p-8 space-y-6 max-w-4xl mx-auto shadow-xs">
        {/* Invoice Top section */}
        <div className="flex justify-between pb-6 border-b border-zinc-200">
          <div className="space-y-2">
            <div className="h-6 w-36 bg-zinc-300 rounded-lg shimmer-bg"></div>
            <div className="h-3.5 w-20 bg-zinc-200 rounded-full shimmer-bg"></div>
          </div>
          <div className="space-y-2 text-right">
            <div className="h-5 w-24 bg-zinc-300 rounded-lg shimmer-bg ml-auto"></div>
            <div className="h-3.5 w-16 bg-zinc-200 rounded-full shimmer-bg ml-auto"></div>
          </div>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-4 pb-6 border-b border-zinc-200">
          <div className="space-y-2">
            <div className="h-3 w-16 bg-zinc-200 rounded-full shimmer-bg"></div>
            <div className="h-4 w-28 bg-zinc-200 rounded-lg shimmer-bg"></div>
            <div className="h-3 w-20 bg-zinc-200 rounded-full shimmer-bg"></div>
          </div>
          <div className="space-y-2">
            <div className="h-3 w-16 bg-zinc-200 rounded-full shimmer-bg"></div>
            <div className="h-4 w-32 bg-zinc-200 rounded-lg shimmer-bg"></div>
          </div>
        </div>

        {/* Table skeleton */}
        <div className="space-y-3">
          <div className="h-8 w-full bg-[#0b2240] rounded-lg shimmer-bg opacity-75"></div>
          {[1, 2, 3].map(idx => (
            <div key={idx} className="h-10 w-full bg-zinc-50 rounded-lg border border-zinc-200 shimmer-bg"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
