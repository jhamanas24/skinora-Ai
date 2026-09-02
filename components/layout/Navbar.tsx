'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Sparkles, Menu, X, LogOut, LayoutDashboard, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isLoading, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/');
    router.refresh();
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Products', href: '/products' },
    { label: 'Analyze Skin', href: user ? '/analyze' : '/login?redirect=/analyze' },
    ...(user ? [{ label: 'Dashboard', href: '/dashboard' }] : []),
    ...(user?.role === 'ADMIN' ? [{ label: 'Admin', href: '/admin' }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-stone-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-skinora-900 via-skinora-800 to-skinora-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-amber-200" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-skinora-900 leading-none">
              SKINORA <span className="text-skinora-500 font-light">AI</span>
            </span>
            <span className="text-[10px] uppercase tracking-widest text-stone-500 font-medium mt-1">
              Know Before You Buy
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-skinora-900 font-semibold'
                    : 'text-stone-600 hover:text-skinora-900'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isLoading ? (
            <div className="w-24 h-9 bg-stone-100 rounded-full animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="secondary" size="sm" leftIcon={<LayoutDashboard className="w-4 h-4" />}>
                  {user.name.split(' ')[0]}
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-stone-500 hover:text-rose-600"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log In
                </Button>
              </Link>
              <Link href="/login?redirect=/analyze">
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Sparkles className="w-4 h-4 text-amber-200" />}
                >
                  Analyze My Skin
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-stone-700 hover:text-black focus:outline-none"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white/95 backdrop-blur-xl px-6 py-6 space-y-4 shadow-xl">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-stone-800 py-2 border-b border-stone-100"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-4 flex flex-col gap-3">
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="secondary" className="w-full justify-center">
                    Dashboard ({user.name})
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full justify-center text-rose-600 border-rose-200"
                >
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-center">
                    Log In / Sign Up
                  </Button>
                </Link>
                <Link href="/login?redirect=/analyze" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full justify-center">
                    Start Skin Analysis
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
