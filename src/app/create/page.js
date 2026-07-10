'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DocumentForm from '@/components/DocumentForm';
import { FormShimmer } from '@/components/Shimmer';

function CreateInvoiceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  const defaultType = searchParams.get('type') || 'bill';

  const [initialData, setInitialData] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch all documents to compute sequential number index
        const docsRes = await fetch('/api/documents');
        const docsData = await docsRes.json();
        if (Array.isArray(docsData)) {
          setDocuments(docsData);
        }

        // If in edit mode, fetch document details
        if (editId) {
          const docRes = await fetch(`/api/documents/${editId}`);
          const docData = await docRes.json();
          if (docData && !docData.error) {
            setInitialData(docData);
          }
        }
      } catch (err) {
        console.error('Failed to load invoice editor configuration:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [editId]);

  const handleSave = async (docData) => {
    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(docData)
      });
      const saved = await res.json();
      if (saved && !saved.error) {
        router.push(`/document/${saved.id}`);
      } else {
        alert('Failed to save document to database');
      }
    } catch (err) {
      console.error('Error saving invoice:', err);
      alert('Error connecting to backend database');
    }
  };

  const getNextNumber = (type) => {
    const relevantDocs = documents.filter(d => d.type === type);
    return relevantDocs.length + 1;
  };

  if (loading) {
    return <FormShimmer />;
  }

  return (
    <DocumentForm
      onSave={handleSave}
      initialData={initialData}
      nextNumber={getNextNumber(initialData?.type || defaultType)}
      defaultType={initialData?.type || defaultType}
    />
  );
}

export default function CreateInvoicePage() {
  return (
    <Suspense fallback={<FormShimmer />}>
      <CreateInvoiceContent />
    </Suspense>
  );
}
