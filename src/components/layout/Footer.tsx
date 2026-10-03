'use client';

import Link from 'next/link';
import { useAuth } from '@/components/brutal/AuthProvider';
import { useTranslation } from '@/lib/i18n';

export function Footer() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const isAdmin = user?.role === 'OFFICER' || user?.role === 'SUPERADMIN';

  return (
    <footer className="border-t-2 border-civic-black bg-civic-black text-civic-white mt-auto">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4 label-editorial">DELHI CIVIC</h3>
            <p className="text-sm text-civic-white/80 leading-relaxed">
              {t('publicPlatformDescription')}
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-sm mb-4 label-editorial">{t('report')}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/report" className="hover:text-civic-accent transition-colors">{t('newComplaint')}</Link></li>
              <li><Link href="/complaints" className="hover:text-civic-accent transition-colors">{t('trackComplaint')}</Link></li>
              <li><Link href="/map" className="hover:text-civic-accent transition-colors">{t('mapView')}</Link></li>
              <li><Link href="/transparency" className="hover:text-civic-accent transition-colors">{t('transparency')}</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-sm mb-4 label-editorial">{t('areas')}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/area" className="hover:text-civic-accent transition-colors">{t('yourArea')}</Link></li>
              <li><Link href="/complaints?status=RESOLVED" className="hover:text-civic-accent transition-colors">{t('resolvedIssues')}</Link></li>
              <li><Link href="/complaints?status=IN_PROGRESS" className="hover:text-civic-accent transition-colors">{t('activeCases')}</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-sm mb-4 label-editorial">OFFICE</h4>
            <p className="text-xs text-civic-white/60 leading-relaxed mb-3">
              {t('civicOfficeDescription')}
            </p>
            {isAdmin && (
              <Link href="/admin" className="text-xs font-bold text-civic-accent hover:underline">
                ADMIN LOGIN →
              </Link>
            )}
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-civic-white/20">
          <p className="text-xs text-civic-white/60 text-center font-mono">
            DELHI CIVIC © 2026 // BUILT BY AYUSH DAS
          </p>
        </div>
      </div>
    </footer>
  );
}
