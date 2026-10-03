'use client';

import { useEffect, useState } from 'react';
import { Clock3 } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

export default function SlaCountdown({ dueAt, status }: { dueAt?: string | Date; status: string }) {
  const [remaining, setRemaining] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    if (!dueAt || ['RESOLVED', 'REJECTED', 'DUPLICATE'].includes(status)) return;
    const update = () => {
      const difference = new Date(dueAt).getTime() - Date.now();
      const overdue = difference < 0;
      const totalMinutes = Math.floor(Math.abs(difference) / 60000);
      const days = Math.floor(totalMinutes / 1440);
      const hours = Math.floor((totalMinutes % 1440) / 60);
      const minutes = totalMinutes % 60;
      setRemaining(`${overdue ? 'OVERDUE BY' : 'DUE IN'} ${days}D ${hours}H ${minutes}M`);
    };
    update();
    const timer = window.setInterval(update, 60000);
    return () => window.clearInterval(timer);
  }, [dueAt, status]);

  if (!remaining) return null;
  const overdue = remaining.startsWith('OVERDUE');
  const parts = remaining.replace('OVERDUE BY ', '').replace('DUE IN ', '');

  return (
    <div className={`mb-6 flex items-center gap-2 border-2 border-civic-black px-4 py-3 font-mono text-sm font-bold ${overdue ? 'bg-civic-accent text-civic-white' : 'bg-civic-yellow'}`} role="status" aria-live="polite">
      <Clock3 size={18} /> {t('serviceLevel')}: {overdue ? t('overdueBy') : t('dueIn')} {parts}
    </div>
  );
}
