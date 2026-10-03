'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Bell, User, LogOut } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/brutal/AuthProvider';
import { LanguageToggle } from '@/components/layout/LanguageToggle';
import { useTranslation } from '@/lib/i18n';

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  const isActive = (path: string) => pathname === path;
  
  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    
    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [userMenuOpen]);
  
  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    router.push('/');
  };
  
  return (
    <header className="sticky top-0 z-50 bg-yellow-300 border-b-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Neobrutalism Style */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-14 h-14 bg-black border-4 border-black flex items-center justify-center transform transition-transform group-hover:translate-x-1 group-hover:translate-y-1">
                <span className="text-yellow-300 font-black text-2xl">DC</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-14 h-14 bg-red-500 border-4 border-black -z-10"></div>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-black text-xl tracking-tighter">DELHI</span>
              <span className="font-black text-xl tracking-tighter bg-black text-yellow-300 px-1">CIVIC</span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <Link
              href="/"
              className={cn(
                'px-5 py-2.5 font-black uppercase text-sm tracking-wide border-3 border-black transition-all',
                isActive('/') 
                  ? 'bg-red-500 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' 
                  : 'bg-white text-black hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
              )}
            >
              {t('home')}
            </Link>
            <Link
              href="/report"
              className={cn(
                'px-5 py-2.5 font-black uppercase text-sm tracking-wide border-3 border-black transition-all',
                isActive('/report') 
                  ? 'bg-red-500 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' 
                  : 'bg-cyan-400 text-black hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
              )}
            >
              {t('report')}
            </Link>
            <Link
              href="/complaints"
              className={cn(
                'px-5 py-2.5 font-black uppercase text-sm tracking-wide border-3 border-black transition-all',
                isActive('/complaints') 
                  ? 'bg-red-500 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' 
                  : 'bg-white text-black hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
              )}
            >
              {t('track')}
            </Link>
            <Link
              href="/map"
              className={cn(
                'px-5 py-2.5 font-black uppercase text-sm tracking-wide border-3 border-black transition-all',
                isActive('/map') 
                  ? 'bg-red-500 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' 
                  : 'bg-lime-400 text-black hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
              )}
            >
              {t('map')}
            </Link>
            <Link
              href="/area"
              className={cn(
                'px-5 py-2.5 font-black uppercase text-sm tracking-wide border-3 border-black transition-all',
                isActive('/area') 
                  ? 'bg-red-500 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' 
                  : 'bg-white text-black hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
              )}
            >
              {t('areas')}
            </Link>
            {/* Icon Buttons */}
            <button className="ml-2 w-11 h-11 bg-pink-400 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center">
              <Bell className="w-5 h-5" strokeWidth={3} />
            </button>
            
            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              {user ? (
                <>
                  <button 
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="w-11 h-11 bg-purple-400 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center"
                  >
                    <User className="w-5 h-5" strokeWidth={3} />
                  </button>
                  
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-50">
                      <div className="p-4 border-b-4 border-black bg-yellow-300">
                        <p className="font-black text-sm uppercase">{user.name}</p>
                        <p className="text-xs text-gray-700">{user.email}</p>
                        <p className="text-xs font-bold mt-1 uppercase">{user.role}</p>
                      </div>
                      <div className="p-2">
                        <div className="flex items-center justify-between border-b-2 border-black px-4 py-3">
                          <span className="text-xs font-black uppercase">Language</span>
                          <LanguageToggle />
                        </div>
                        {user.role === 'OFFICER' || user.role === 'SUPERADMIN' ? (
                          <Link
                            href="/admin"
                            onClick={() => setUserMenuOpen(false)}
                            className="block px-4 py-3 font-bold text-sm uppercase hover:bg-cyan-400 border-2 border-transparent hover:border-black transition-all"
                          >
                            {t('adminDashboard')}
                          </Link>
                        ) : null}
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-3 font-bold text-sm uppercase hover:bg-red-500 hover:text-white border-2 border-transparent hover:border-black transition-all text-left"
                        >
                          <LogOut className="w-4 h-4" strokeWidth={3} />
                          {t('logout')}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <Link 
                  href="/login"
                  className="w-11 h-11 bg-purple-400 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center"
                >
                  <User className="w-5 h-5" strokeWidth={3} />
                </Link>
              )}
            </div>
          </nav>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-3 bg-red-500 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} strokeWidth={3} /> : <Menu size={24} strokeWidth={3} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden border-t-4 border-black bg-white">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
            <Link
              href="/"
              className={cn(
                'px-5 py-4 font-black uppercase text-sm tracking-wide border-4 border-black transition-all',
                isActive('/') 
                  ? 'bg-red-500 text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]' 
                  : 'bg-yellow-300 text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none'
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('home')}
            </Link>
            <Link
              href="/report"
              className={cn(
                'px-5 py-4 font-black uppercase text-sm tracking-wide border-4 border-black transition-all',
                isActive('/report') 
                  ? 'bg-red-500 text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]' 
                  : 'bg-cyan-400 text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none'
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('report')}
            </Link>
            <Link
              href="/complaints"
              className={cn(
                'px-5 py-4 font-black uppercase text-sm tracking-wide border-4 border-black transition-all',
                isActive('/complaints') 
                  ? 'bg-red-500 text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]' 
                  : 'bg-lime-400 text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none'
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('track')}
            </Link>
            <Link
              href="/map"
              className={cn(
                'px-5 py-4 font-black uppercase text-sm tracking-wide border-4 border-black transition-all',
                isActive('/map') 
                  ? 'bg-red-500 text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]' 
                  : 'bg-pink-400 text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none'
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('map')}
            </Link>
            <Link
              href="/area"
              className={cn(
                'px-5 py-4 font-black uppercase text-sm tracking-wide border-4 border-black transition-all',
                isActive('/area') 
                  ? 'bg-red-500 text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]' 
                  : 'bg-purple-400 text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none'
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('areas')}
            </Link>
            {user ? (
              <>
                <div className="flex items-center justify-between border-4 border-black bg-yellow-300 px-5 py-3">
                  <span className="text-xs font-black uppercase">Language</span>
                  <LanguageToggle />
                </div>
                {user.role === 'OFFICER' || user.role === 'SUPERADMIN' ? (
                  <Link
                    href="/admin"
                    className="px-5 py-4 font-black uppercase text-sm tracking-wide border-4 border-black bg-cyan-400 text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('adminDashboard')}
                  </Link>
                ) : null}
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-5 py-4 font-black uppercase text-sm tracking-wide border-4 border-black bg-red-500 text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="px-5 py-4 font-black uppercase text-sm tracking-wide border-4 border-black bg-purple-400 text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
