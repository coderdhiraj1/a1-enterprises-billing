'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DocumentHistory from '@/components/DocumentHistory';
import { HistoryShimmer } from '@/components/Shimmer';

export default function HistoryPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  
  // Pagination & Search States
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [companyFilter, setCompanyFilter] = useState('all');

  const fetchDocs = (currentPage, currentSearch, currentType, currentCompany) => {
    setIsSearching(true);
    const params = new URLSearchParams({
      paginate: 'true',
      page: String(currentPage),
      limit: '10',
      search: currentSearch,
      type: currentType,
      company: currentCompany || 'all'
    });

    fetch(`/api/documents?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.documents) {
          setDocuments(data.documents);
          setPage(data.pagination.page);
          setTotalPages(data.pagination.totalPages);
          setTotalDocs(data.pagination.totalDocs);
        }
        setLoading(false);
        setIsSearching(false);
      })
      .catch(err => {
        console.error('Failed to load documents:', err);
        setLoading(false);
        setIsSearching(false);
      });
  };

  // Debounced effect for API search queries
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchDocs(page, searchTerm, typeFilter, companyFilter);
    }, 250);

    return () => clearTimeout(delayDebounceFn);
  }, [page, searchTerm, typeFilter, companyFilter]);

  const handleTogglePaidStatus = async (id) => {
    const docToUpdate = documents.find(d => d.id === id);
    if (!docToUpdate || docToUpdate.type !== 'bill') return;
    
    const newStatus = docToUpdate.paymentStatus === 'paid' ? 'unpaid' : 'paid';
    const updatedDocData = { ...docToUpdate, paymentStatus: newStatus };

    try {
      const res = await fetch(`/api/documents/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedDocData)
      });
      const savedDoc = await res.json();
      
      const updated = documents.map(d => d.id === id ? savedDoc : d);
      setDocuments(updated);
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  const handleDeleteDoc = async (id) => {
    if (window.confirm('Are you sure you want to delete this document from history?')) {
      try {
        await fetch(`/api/documents/${id}`, {
          method: 'DELETE'
        });
        // Reload current page to pull fresh records
        fetchDocs(page, searchTerm, typeFilter);
      } catch (err) {
        console.error('Failed to delete document:', err);
        alert('Error deleting document from database');
      }
    }
  };

  if (loading) {
    return <HistoryShimmer />;
  }

  return (
    <DocumentHistory
      documents={documents}
      onView={(doc) => router.push(`/document/${doc.id || doc._id}`)}
      onEdit={(doc) => router.push(`/create?edit=${doc.id || doc._id}`)}
      onDelete={handleDeleteDoc}
      onTogglePaid={handleTogglePaidStatus}
      // Pagination props
      page={page}
      totalPages={totalPages}
      totalDocs={totalDocs}
      onPageChange={setPage}
      // Search / Filter props
      searchTerm={searchTerm}
      onSearchChange={(term) => {
        setSearchTerm(term);
        setPage(1); // Reset page to 1
      }}
      typeFilter={typeFilter}
      onTypeFilterChange={(type) => {
        setTypeFilter(type);
        setPage(1); // Reset page to 1
      }}
      companyFilter={companyFilter}
      onCompanyFilterChange={(comp) => {
        setCompanyFilter(comp);
        setPage(1);
      }}
      isSearching={isSearching}
    />
  );
}
