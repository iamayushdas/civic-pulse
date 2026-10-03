'use client';

import { useEffect, useState } from 'react';
import { Mail, MapPin, Phone, UserRound } from 'lucide-react';
import { Card, CardContent, CardHeader } from './Card';
import { ComplaintCategory, Representative } from '@/types';

interface RepresentativesCardProps {
  pincode?: string;
  category?: ComplaintCategory;
}

export default function RepresentativesCard({ pincode, category }: RepresentativesCardProps) {
  const [representatives, setRepresentatives] = useState<Representative[]>([]);
  const [loading, setLoading] = useState(Boolean(pincode && category));

  useEffect(() => {
    if (!pincode || !category) return;

    let active = true;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 10000);

    fetch(`/api/representatives/${pincode}?category=${encodeURIComponent(category)}`, {
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (active) setRepresentatives(data?.representatives || []);
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          console.error('Failed to fetch representatives:', error);
        }
      })
      .finally(() => {
        window.clearTimeout(timeout);
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [pincode, category]);

  if (!pincode || (!loading && representatives.length === 0)) return null;

  return (
    <Card>
      <CardHeader>
        <h3 className="font-bold">RELEVANT AUTHORITIES</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="text-sm text-civic-muted">LOADING AUTHORITIES...</div>
        ) : representatives.map((representative) => (
          <div key={`${representative.type}-${representative.name}`} className="border-b-2 border-civic-black/15 pb-4 last:border-b-0 last:pb-0">
            <div className="flex gap-3">
              <div className="h-12 w-12 shrink-0 overflow-hidden border-2 border-civic-black bg-civic-bg flex items-center justify-center">
                {representative.photoUrl ? (
                  <img src={representative.photoUrl} alt={representative.name} className="h-full w-full object-cover" />
                ) : (
                  <UserRound size={22} />
                )}
              </div>
              <div className="min-w-0">
                <div className="font-bold leading-tight">{representative.name}</div>
                <div className="text-sm text-civic-muted">{representative.designation}</div>
                {representative.department && <div className="label-mono mt-1">{representative.department}</div>}
              </div>
            </div>
            <div className="mt-3 space-y-1 text-sm">
              {representative.phone && <a className="flex items-center gap-2 hover:underline" href={`tel:${representative.phone}`}><Phone size={14} />{representative.phone}</a>}
              {representative.email && <a className="flex items-center gap-2 break-all hover:underline" href={`mailto:${representative.email}`}><Mail size={14} />{representative.email}</a>}
              {representative.address && <div className="flex items-start gap-2"><MapPin size={14} className="mt-0.5 shrink-0" />{representative.address}</div>}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}