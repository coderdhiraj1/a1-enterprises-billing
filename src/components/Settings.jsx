'use client';

import React, { useState, useEffect } from 'react';
import { Save, Building, CreditCard, Mail, Phone, MapPin, User, CheckCircle2, Lock } from 'lucide-react';
import Image from 'next/image';

const DEFAULT_SELLER = {
  name: 'A-1 Enterprises Fabrication Works',
  phone: '+91-7759971969',
  email: 'enterprises.a1@gmail.com',
  address: 'Shani Mandir Road, Shivar Basti, Marunji, Pune, Maharashtra 411057',
  bankName: 'ICICI BANK',
  accountName: 'Rakesh Sharma',
  accountNumber: '329701501647',
  ifscCode: 'ICICI0003297'
};

export default function Settings({ onSaveSettings }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  
  const [bankName, setBankName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('a1_seller_details');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setName(data.name || DEFAULT_SELLER.name);
        setPhone(data.phone || DEFAULT_SELLER.phone);
        setEmail(data.email || DEFAULT_SELLER.email);
        setAddress(data.address || DEFAULT_SELLER.address);
        setBankName(data.bankName || DEFAULT_SELLER.bankName);
        setAccountName(data.accountName || DEFAULT_SELLER.accountName);
        setAccountNumber(data.accountNumber || DEFAULT_SELLER.accountNumber);
        setIfscCode(data.ifscCode || DEFAULT_SELLER.ifscCode);
      } catch (e) {
        loadDefaults();
      }
    } else {
      loadDefaults();
    }
  }, []);

  const loadDefaults = () => {
    setName(DEFAULT_SELLER.name);
    setPhone(DEFAULT_SELLER.phone);
    setEmail(DEFAULT_SELLER.email);
    setAddress(DEFAULT_SELLER.address);
    setBankName(DEFAULT_SELLER.bankName);
    setAccountName(DEFAULT_SELLER.accountName);
    setAccountNumber(DEFAULT_SELLER.accountNumber);
    setIfscCode(DEFAULT_SELLER.ifscCode);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const data = {
      name,
      phone,
      email,
      address,
      bankName,
      accountName,
      accountNumber,
      ifscCode
    };
    localStorage.setItem('a1_seller_details', JSON.stringify(data));
    onSaveSettings(data);
    
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="bg-white rounded-xl border border-zinc-250/90 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-zinc-150 px-6 py-5 flex justify-between items-center">
        <div>
          <h2 className="text-base font-extrabold text-zinc-800 tracking-tight">Business Configuration</h2>
          <p className="text-xs text-zinc-400 mt-1">Configure company details, branding and default payment mode info</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Business Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-zinc-100 pb-2">
              <Building className="w-4 h-4 text-zinc-450" />
              Company Details
            </h3>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-zinc-550 dark:text-zinc-400 mb-1.5">
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
                  <label className="block text-xs font-semibold text-zinc-550 dark:text-zinc-400 mb-1.5">
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
                  <label className="block text-xs font-semibold text-zinc-550 dark:text-zinc-400 mb-1.5">
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
                <label className="block text-xs font-semibold text-zinc-550 dark:text-zinc-400 mb-1.5">
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
              <CreditCard className="w-4 h-4 text-zinc-450" />
              Payment Bank Mode Details
              <span className="ml-auto flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 border border-amber-200/50 px-2 py-0.5 rounded-md font-semibold font-sans normal-case tracking-normal">
                <Lock className="w-3 h-3 text-amber-500" />
                Locked
              </span>
            </h3>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-zinc-550 dark:text-zinc-400 mb-1.5">
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
                <label className="block text-xs font-semibold text-zinc-550 dark:text-zinc-400 mb-1.5">
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
                  <label className="block text-xs font-semibold text-zinc-550 dark:text-zinc-400 mb-1.5">
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
                  <label className="block text-xs font-semibold text-zinc-550 dark:text-zinc-400 mb-1.5">
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
                <div className="border border-zinc-150 p-2.5 rounded-xl bg-zinc-50 text-center max-w-xs mx-auto">
                  <span className="text-[10px] text-zinc-400 block mb-1">Company Logo Sourced</span>
                  <div className="relative h-12 w-full mx-auto">
                    <Image src="/logo.png" alt="A-1 logo" fill style={{ objectFit: 'contain' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-zinc-150 flex flex-col sm:flex-row justify-between items-center gap-3">
          <button
            type="button"
            onClick={loadDefaults}
            className="text-xs text-zinc-400 hover:text-zinc-600 font-semibold cursor-pointer"
          >
            Reset to default branding details
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
