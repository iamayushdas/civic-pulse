'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BarChart3, Clock3, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/brutal/Card';
import { Button } from '@/components/brutal/Button';
import { useTranslation } from '@/lib/i18n';

interface DepartmentPerformance {
  department: string;
  total: number;
  resolved: number;
  resolutionRate: number;
  averageResolutionHours: number;
}

interface TransparencyStats {
  total: number;
  resolved: number;
  overdue: number;
  departmentPerformance: DepartmentPerformance[];
  byWard: Record<string, number>;
}

export default function TransparencyPage() {
  const [stats, setStats] = useState<TransparencyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    fetch('/api/stats')
      .then((response) => (response.ok ? response.json() : null))
      .then(setStats)
      .catch((error) => console.error('Failed to fetch transparency stats:', error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container mx-auto px-4 py-16 text-center font-bold">{t('loading')}</div>;
  if (!stats) return <div className="container mx-auto px-4 py-16 text-center font-bold">TRANSPARENCY DATA UNAVAILABLE</div>;

  const topWard = Object.entries(stats.byWard).sort((left, right) => right[1] - left[1])[0];
  const maxResolution = Math.max(...stats.departmentPerformance.map((item) => item.averageResolutionHours), 1);

  return (
    <main className="container mx-auto px-4 py-8 sm:py-12">
      <Link href="/">
        <Button variant="ghost" size="sm" className="mb-6"><ArrowLeft size={16} /> BACK HOME</Button>
      </Link>
      <div className="mb-10 max-w-3xl">
        <div className="label-mono mb-3">{t('publicAccountability')}</div>
        <h1 className="text-4xl font-bold sm:text-6xl">{t('transparencyReport')}</h1>
        <p className="mt-4 text-lg text-civic-muted">A plain-language view of complaint volume, department performance, and service delays.</p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card><CardContent><div className="label-mono">{t('totalReports')}</div><div className="mt-2 text-4xl font-bold">{stats.total}</div></CardContent></Card>
        <Card><CardContent><div className="label-mono">{t('resolved')}</div><div className="mt-2 text-4xl font-bold text-civic-accent">{stats.resolved}</div></CardContent></Card>
        <Card><CardContent><div className="label-mono">{t('overSla')}</div><div className="mt-2 text-4xl font-bold">{stats.overdue}</div></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><h2 className="flex items-center gap-2 text-2xl font-bold"><BarChart3 size={22} /> {t('departmentPerformance')}</h2></CardHeader>
          <CardContent className="space-y-5">
            {stats.departmentPerformance.map((item) => (
              <div key={item.department}>
                <div className="mb-1 flex justify-between gap-4 text-sm font-bold"><span>{item.department}</span><span>{item.resolutionRate}% resolved</span></div>
                <div className="h-4 border-2 border-civic-black bg-civic-bg" role="progressbar" aria-label={`${item.department} resolution rate`} aria-valuenow={item.resolutionRate} aria-valuemin={0} aria-valuemax={100}>
                  <div className="h-full bg-civic-accent" style={{ width: `${item.resolutionRate}%` }} />
                </div>
                <div className="mt-1 text-xs text-civic-muted">{item.resolved} of {item.total} complaints resolved</div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><h2 className="flex items-center gap-2 text-2xl font-bold"><Clock3 size={22} /> {t('averageResolutionTime')}</h2></CardHeader>
          <CardContent className="space-y-5">
            {stats.departmentPerformance.map((item) => (
              <div key={item.department}>
                <div className="mb-1 flex justify-between gap-4 text-sm font-bold"><span>{item.department}</span><span>{item.averageResolutionHours || '—'} hours</span></div>
                <div className="h-4 border-2 border-civic-black bg-civic-bg" role="progressbar" aria-label={`${item.department} average resolution time`} aria-valuenow={item.averageResolutionHours} aria-valuemin={0} aria-valuemax={maxResolution}>
                  <div className="h-full bg-civic-black" style={{ width: `${item.averageResolutionHours ? (item.averageResolutionHours / maxResolution) * 100 : 0}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader><h2 className="flex items-center gap-2 text-2xl font-bold"><ShieldCheck size={22} /> {t('wardSnapshot')}</h2></CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-civic-muted">{t('highestReportedVolume')}: <strong>{topWard?.[0] || '—'}</strong> ({topWard?.[1] || 0})</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {Object.entries(stats.byWard).sort((left, right) => right[1] - left[1]).map(([ward, count]) => (
              <div key={ward} className="border-2 border-civic-black p-3"><div className="label-mono">{ward}</div><div className="text-2xl font-bold">{count}</div></div>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
