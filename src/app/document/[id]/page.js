'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DocumentPreview from '@/components/DocumentPreview';
import { PreviewShimmer } from '@/components/Shimmer';

export default function DocumentPreviewPage({ params: paramsProp }) {
  const router = useRouter();
  const routeParams = useParams();
  
  // Resolve id safely from paramsProp (Promise in Next.js 15+) or useParams hook
  const [resolvedId, setResolvedId] = useState(routeParams?.id || null);

  useEffect(() => {
    if (paramsProp) {
      Promise.resolve(paramsProp).then(p => {
        if (p?.id) setResolvedId(p.id);
      });
    } else if (routeParams?.id) {
      setResolvedId(routeParams.id);
    }
  }, [paramsProp, routeParams]);

  const id = resolvedId || routeParams?.id;

  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    let isMounted = true;
    async function loadData() {
      try {
        const docRes = await fetch(`/api/documents/${id}`);
        const docData = await docRes.json();
        
        if (isMounted) {
          if (docData && !docData.error) {
            setDoc(docData);
          }
        }
      } catch (err) {
        console.error('Failed to load document preview:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    
    loadData();
    return () => { isMounted = false; };
  }, [id]);

  if (loading) {
    return <PreviewShimmer />;
  }

  if (!doc) {
    return (
      <div className="text-center py-10 space-y-3">
        <h3 className="text-sm font-bold text-red-500">Document Not Found</h3>
        <p className="text-xs text-zinc-500">The document with ID "{id}" could not be retrieved from the database.</p>
        <button
          onClick={() => router.push('/history')}
          className="px-4 py-2 bg-[#0b2240] text-white rounded-lg text-xs font-bold cursor-pointer"
        >
          Go Back to History
        </button>
      </div>
    );
  }

  return (
    <DocumentPreview
      doc={doc}
      onBack={() => router.push('/history')}
      onEdit={() => router.push(`/create?edit=${doc.id || doc._id || id}`)}
    />
  );
}

