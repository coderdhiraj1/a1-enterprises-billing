'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Dashboard from '@/components/Dashboard';
import { DashboardShimmer } from '@/components/Shimmer';

export default function HomePage() {
  const router = useRouter();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/documents')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setDocuments(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load documents:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <DashboardShimmer />;
  }

  return (
    <Dashboard
      documents={documents}
      onCreateBill={() => router.push('/create?type=bill')}
      onCreateQuotation={() => router.push('/create?type=quotation')}
      onViewDoc={(doc) => router.push(`/document/${doc.id}`)}
      onViewHistory={() => router.push('/history')}
    />
  );
}
