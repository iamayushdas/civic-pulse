'use client';

import { UserRound, Phone, Mail, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader } from './Card';
import { Representative } from '@/types';

interface RepresentativesCardProps {
  representatives: Representative[];
}

export default function RepresentativesCard({ representatives }: RepresentativesCardProps) {
  if (representatives.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <h3 className="font-bold">RELEVANT AUTHORITIES</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        {representatives.map((representative) => (
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