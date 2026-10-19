'use client';

import React, { useState, useEffect } from 'react';
import { Save, Building, CreditCard, Mail, Phone, MapPin, User, CheckCircle2, Lock } from 'lucide-react';
import Image from 'next/image';
import { FormShimmer } from './Shimmer';

import { COMPANY_DEFAULTS } from '@/lib/companies';

export default function Settings({ onSaveSettings }) {
  const [activeCompany, setActiveCompany] = useState('a1'); // 'a1' or 'shiv_mahima'
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  
  const [bankName, setBankName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchSellerData = (companyKey) => {
    setLoading(true);
    fetch(`/api/seller?company=${companyKey}`)
      .then(res => res.json())
      .then(data => {
        const defaults = COMPANY_DEFAULTS[companyKey] || COMPANY_DEFAULTS.a1;
        if (data && !data.error) {
          setName(data.name || defaults.name);
          setPhone(data.phone || defaults.phone);
          setEmail(data.email || defaults.email);
          setAddress(data.address || defaults.address);
          setBankName(data.bankName || defaults.bankName);
          setAccountName(data.accountName || defaults.accountName);
          setAccountNumber(data.accountNumber || defaults.accountNumber);
          setIfscCode(data.ifscCode || defaults.ifscCode);
        } else {
          loadDefaultsFor(companyKey);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load seller settings:', err);
        loadDefaultsFor(companyKey);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSellerData(activeCompany);
  }, [activeCompany]);

  const loadDefaultsFor = (companyKey) => {
    const defaults = COMPANY_DEFAULTS[companyKey] || COMPANY_DEFAULTS.a1;
    setName(defaults.name);
    setPhone(defaults.phone);
    setEmail(defaults.email);
    setAddress(defaults.address);
    setBankName(defaults.bankName);
    setAccountName(defaults.accountName);
    setAccountNumber(defaults.accountNumber);
    setIfscCode(defaults.ifscCode);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const data = {
      companyId: activeCompany,
      name,
      phone,
      email,
      address,
      bankName,
      accountName,
      accountNumber,
      ifscCode
    };

    try {
      const res = await fetch('/api/seller', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const savedData = await res.json();
      
      if (onSaveSettings) {
        onSaveSettings(savedData);
      }
      
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save settings:', err);
      alert('Error saving settings to database');
    }
  };

  if (loading) {
    return <FormShimmer />;
  }

  const isA1 = activeCompany === 'a1';

  return (
    <div className="bg-white rounded-xl border border-zinc-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-zinc-200 px-6 py-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-base font-extrabold text-zinc-800 tracking-tight">Business Configuration</h2>
          <p className="text-xs text-zinc-400 mt-1">Configure company profiles, bank account modes, and official details</p>
        </div>

        {/* Company Tabs */}
        <div className="flex bg-zinc-100 p-1 rounded-xl border border-zinc-200/60 self-stretch sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveCompany('a1')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              isA1
                ? 'bg-white text-[#0b2240] shadow-xs'
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            A-1 Enterprises
          </button>
          <button
            type="button"
            onClick={() => setActiveCompany('shiv_mahima')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              !isA1
                ? 'bg-white text-[#0b2240] shadow-xs'
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Shiv Mahima
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Business Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-zinc-100 pb-2">
              <Building className="w-4 h-4 text-zinc-400" />
              Company Details
            </h3>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
                  Business / Company Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 text-sm focus:ring-2 focus:ring-teal-500 text-zinc-800 dark:text-zinc-200"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400">
                      <Phone className="w-4 h-4" />
                    </span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 text-sm focus:ring-2 focus:ring-teal-500 text-zinc-800 dark:text-zinc-200"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 text-sm focus:ring-2 focus:ring-teal-500 text-zinc-800 dark:text-zinc-200"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
                  Office Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 pt-3 items-start text-zinc-400">
                    <MapPin className="w-4 h-4" />
                  </span>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows="3"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 text-sm focus:ring-2 focus:ring-teal-500 text-zinc-800 dark:text-zinc-200 resize-none"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-zinc-100 pb-2 w-full">
              <CreditCard className="w-4 h-4 text-zinc-400" />
              Payment Bank Mode Details
              <span className="ml-auto flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 border border-amber-200/50 px-2 py-0.5 rounded-md font-semibold font-sans normal-case tracking-normal">
                <Lock className="w-3 h-3 text-amber-500" />
                Locked
              </span>
            </h3>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
                  Bank Name
                </label>
                <input
                  type="text"
                  value={bankName}
                  disabled
                  className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 bg-zinc-100/80 text-zinc-500 cursor-not-allowed select-none text-sm font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
                  Account Name / Holder
                </label>
                <input
                  type="text"
                  value={accountName}
                  disabled
                  className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 bg-zinc-100/80 text-zinc-500 cursor-not-allowed select-none text-sm font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={accountNumber}
                    disabled
                    className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 bg-zinc-100/80 text-zinc-500 cursor-not-allowed select-none text-sm font-semibold font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    value={ifscCode}
                    disabled
                    className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 bg-zinc-100/80 text-zinc-500 cursor-not-allowed select-none text-sm font-semibold font-mono"
                    required
                  />
                </div>
              </div>

              {/* Graphic/Visual preview of logos */}
              <div className="pt-2">
                <div className="border border-zinc-200 p-2.5 rounded-xl bg-zinc-50 text-center max-w-xs mx-auto">
                  <span className="text-[10px] text-zinc-400 block mb-1">Company Logo ({isA1 ? 'A-1 Enterprises' : 'Shiv Mahima'})</span>
                  <div className="relative h-14 w-full mx-auto">
                    <img 
                      src={isA1 ? '/logo.png' : '/logo-shiv-mahima.png'} 
                      alt={isA1 ? 'A-1 Logo' : 'Shiv Mahima Logo'} 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-zinc-200 flex flex-col sm:flex-row justify-between items-center gap-3">
          <button
            type="button"
            onClick={() => loadDefaultsFor(activeCompany)}
            className="text-xs text-zinc-400 hover:text-zinc-600 font-semibold cursor-pointer"
          >
            Reset to default {isA1 ? 'A-1' : 'Shiv Mahima'} details
          </button>
          
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {savedSuccess && (
              <span className="flex items-center gap-1 text-xs text-emerald-600 font-semibold animate-pulse">
                <CheckCircle2 className="w-4 h-4" />
                Settings saved!
              </span>
            )}
            <button
              type="submit"
              className="flex items-center gap-1.5 px-6 py-3 bg-[#0b2240] hover:bg-[#081930] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Save Configuration
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
