'use client';

import { useEffect, useState } from 'react';
import { CopyCheck } from 'lucide-react';
import { Button } from '@/components/brutal/Button';
import { Card, CardContent, CardHeader } from '@/components/brutal/Card';

interface DuplicateMatch {
  complaintId: string;
  title: string;
  status: string;
  score: number;
  nearby: boolean;
}

export default function DuplicateSuggestions({
  complaintId,
  onSelect,
}: {
  complaintId: string;
  onSelect: (complaintId: string) => void;
}) {
  const [matches, setMatches] = useState<DuplicateMatch[]>([]);

  useEffect(() => {
    fetch(`/api/complaints/${complaintId}/duplicates`)
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => setMatches(data?.matches || []))
      .catch((error) => console.error('Failed to find duplicate complaints:', error));
  }, [complaintId]);

  if (matches.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <h3 className="flex items-center gap-2 font-bold"><CopyCheck size={18} /> POSSIBLE DUPLICATES</h3>
      </CardHeader>
      <CardContent className="space-y-3">
        {matches.map((match) => (
          <div key={match.complaintId} className="border-b-2 border-civic-black/15 pb-3 last:border-0 last:pb-0">
            <div className="font-mono text-xs font-bold">{match.complaintId} · {match.score}% MATCH</div>
            <div className="font-bold">{match.title}</div>
            <div className="mb-2 text-xs text-civic-muted">{match.status.replace('_', ' ')}{match.nearby ? ' · NEARBY' : ''}</div>
            <Button variant="ghost" size="sm" onClick={() => onSelect(match.complaintId)}>
              LINK AS DUPLICATE
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
