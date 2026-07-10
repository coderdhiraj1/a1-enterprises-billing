'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  Settings as SettingsIcon, 
  Hammer, 
  Menu, 
  X,
  LogOut
} from 'lucide-react';

export default function AppLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Authentication validation hook
  useEffect(() => {
    const auth = localStorage.getItem('a1_auth') === 'true';
    setIsAuthenticated(auth);
    setCheckingAuth(false);
    
    if (!auth && pathname !== '/login') {
      router.push('/login');
    } else if (auth && pathname === '/login') {
      router.push('/');
    }
  }, [pathname, router]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out from Admin Panel?')) {
      localStorage.removeItem('a1_auth');
      setIsAuthenticated(false);
      router.push('/login');
    }
  };

  const navLinks = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/create', label: 'Create New', icon: PlusCircle },
    { href: '/history', label: 'Billing History', icon: History },
    { href: '/configuration', label: 'Configuration', icon: SettingsIcon }
  ];

  const getPageTitle = () => {
    if (pathname === '/') return 'Overview Dashboard';
    if (pathname.startsWith('/create')) return 'Document Editor';
    if (pathname.startsWith('/history')) return 'Billing History';
    if (pathname.startsWith('/configuration')) return 'Business Configuration';
    if (pathname.startsWith('/document/')) return 'Document Preview';
    return 'A-1 Enterprises';
  };

  // Full screen login page override
  if (pathname === '/login') {
    return <div className="min-h-screen bg-[#f4f6f8]">{children}</div>;
  }

  // Prevent flash of secure dashboard components
  if (checkingAuth || (!isAuthenticated && pathname !== '/login')) {
    return (
      <div className="min-h-screen bg-[#f4f6f8] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0b2240]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f6f8] font-sans flex flex-col md:flex-row">
      {/* Sidebar Navigation (Desktop) */}
      <aside className={`fixed md:sticky top-0 left-0 z-35 h-screen w-64 bg-white border-r border-zinc-200/80 p-5 flex flex-col justify-between transition-transform duration-300 md:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="space-y-6">
          {/* Logo Brand Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#0b2240] flex items-center justify-center text-white shadow-sm">
                <Hammer className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-sm text-zinc-800 block leading-tight">
                  A-1 Enterprises
                </span>
                <span className="text-[9px] text-[#2d5e3b] font-bold uppercase tracking-wider block mt-0.5">
                  Fabrication Works
                </span>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1.5 hover:bg-zinc-50 rounded-lg text-zinc-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-[#e2ede7] text-[#2d5e3b] font-bold shadow-xs'
                      : 'text-zinc-650 hover:bg-zinc-50 hover:text-zinc-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer info */}
        <div className="space-y-4 pt-4 border-t border-zinc-150">
          <div className="text-[11px] text-zinc-400 font-medium leading-relaxed">
            <p className="text-zinc-550 font-bold">Admin Panel</p>
            <p className="font-medium text-zinc-450">enterprises.a1@gmail.com</p>
          </div>
          
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-red-650 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout Admin
          </button>
        </div>
      </aside>

      {/* Backdrop overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-xs md:hidden"
        ></div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-6">
        {/* Top Header bar */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-5 py-4 border-b border-zinc-200 flex justify-between items-center print:hidden">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 hover:bg-zinc-50 rounded-xl text-zinc-600"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-base font-extrabold text-zinc-800 capitalize">
              {getPageTitle()}
            </h1>
          </div>
        </header>

        {/* Tab/Content Container */}
        <main className="p-5 flex-1 max-w-5xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Hidden on Print & Desktop) */}
      <nav className="fixed bottom-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-md border-t border-zinc-200 py-2 px-3 flex justify-around md:hidden print:hidden shadow-lg">
        {navLinks.map(link => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                isActive
                  ? 'text-[#dda137] font-bold scale-105'
                  : 'text-zinc-400 hover:text-zinc-650'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] tracking-wide font-semibold">
                {link.label === 'Dashboard' ? 'Home' : link.label === 'Create Invoice' ? 'Create' : link.label === 'Billing History' ? 'History' : 'Settings'}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
