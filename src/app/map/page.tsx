'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/brutal/Card';
import { Select } from '@/components/brutal/Select';
import { Input } from '@/components/brutal/Input';
import { CATEGORY_LABELS, STATUS_LABELS, ComplaintCategory, ComplaintStatus } from '@/types';
import { useTranslation } from '@/lib/i18n';

const MapView = dynamic(() => import('@/components/map/MapView'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-civic-bg">
      <div className="text-center">
        <div className="inline-block w-12 h-12 border-4 border-civic-black border-t-civic-accent rounded-full animate-spin mb-4"></div>
        <p className="font-bold uppercase">Loading Map...</p>
      </div>
    </div>
  ),
});

export default function MapPage() {
  const [complaints, setComplaints] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    pincode: '',
  });
  const { t } = useTranslation();

  useEffect(() => {
    fetchComplaints();
  }, [filters]);

  const fetchComplaints = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.status) params.append('status', filters.status);
      if (filters.pincode) params.append('pincode', filters.pincode);
      params.append('limit', '500');

      const response = await fetch(`/api/complaints?${params}`);
      const data = await response.json();
      setComplaints(data.complaints || []);
    } catch (error) {
      console.error('Failed to fetch complaints:', error);
    }
  };

  return (
    <div className="h-[calc(100vh-5rem)]">
      <div className="container mx-auto px-4 py-6 h-full flex flex-col">
        <div className="mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">{t('civicIssuesMap')}</h1>
          
          <Card>
            <CardContent className="!py-4">
              <div className="flex items-center gap-3 mb-3">
                <Filter size={20} />
                <h2 className="font-bold">{t('filters')}</h2>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Select
                  options={[
                    { value: '', label: t('allCategories') },
                    ...(Object.keys(CATEGORY_LABELS) as ComplaintCategory[]).map((cat) => ({
                      value: cat,
                      label: CATEGORY_LABELS[cat],
                    })),
                  ]}
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                />
                <Select
                  options={[
                    { value: '', label: t('allStatuses') },
                    ...(Object.keys(STATUS_LABELS) as ComplaintStatus[]).map((status) => ({
                      value: status,
                      label: STATUS_LABELS[status],
                    })),
                  ]}
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                />
                <Input
                  placeholder={t('wardPincode')}
                  value={filters.pincode}
                  onChange={(e) => setFilters({ ...filters, pincode: e.target.value })}
                  maxLength={6}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1 border-2 border-civic-black shadow-brutal">
          <MapView complaints={complaints} />
        </div>
      </div>
    </div>
  );
}
