import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full bg-[#0b0e18]/80 backdrop-blur-lg border-b border-white/5 px-8 py-4 flex justify-between items-center shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-[#7EFFF5] text-3xl" data-icon="lock">lock</span>
        <span className="font-headline text-2xl font-black bg-gradient-to-br from-[#6ff1e7] to-[#17b3aa] bg-clip-text text-transparent tracking-tight">
          SecureVault
        </span>
      </div>
      <div className="hidden md:flex gap-8">
        <Link className="text-slate-400 font-medium hover:text-[#7EFFF5] transition-all duration-300" to="/">Features</Link>
        <Link className="text-slate-400 font-medium hover:text-[#7EFFF5] transition-all duration-300" to="/">Security</Link>
        <Link className="text-[#7EFFF5] border-b-2 border-[#7EFFF5] pb-1" to="/register">Sign Up</Link>
      </div>
      <div className="flex items-center gap-4">
        <span className="material-symbols-outlined text-slate-400 cursor-pointer" data-icon="settings">settings</span>
      </div>
    </nav>
  );
}