import React from 'react';
import Link from 'next/link';
import { Sparkles, Shield, Heart, ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          {/* Col 1: Brand */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-skinora-500 to-amber-200 flex items-center justify-center text-stone-900 font-bold shadow-md">
                <Sparkles className="w-5 h-5 text-stone-900" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                SKINORA <span className="text-skinora-400 font-light">AI</span>
              </span>
            </div>
            <p className="text-sm text-stone-400 max-w-sm leading-relaxed">
              AI-driven cosmetic product compatibility engine. Understand ingredient synergy, visible skin alignment, and plausible before/after simulations before purchasing skincare products.
            </p>
            <div className="flex items-center gap-2 text-xs text-stone-400">
              <span className="font-semibold text-skinora-300">"Know Before You Buy"</span>
              <span>•</span>
              <span className="font-medium text-stone-400">"See. Analyze. Choose."</span>
            </div>
          </div>

          {/* Col 2: Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-wider text-stone-200">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>
                <Link href="/analyze" className="hover:text-white transition-colors">
                  Analyze Face Photo
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  Product Catalog
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-white transition-colors">
                  How Skinora Works
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  My Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Privacy & Safety */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-wider text-stone-200">
              Ethics & Trust
            </h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy & Biometric Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Cosmetic Disclaimer & Terms
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>© {new Date().getFullYear()} Skinora AI Technologies. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-skinora-400" /> Identity-Preserving Simulation
            </span>
            <span>•</span>
            <span className="text-stone-400">Educational & Cosmetic Purpose Only</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
