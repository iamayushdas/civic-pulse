'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, ArrowRight, Download, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/brutal/Card';
import { Button } from '@/components/brutal/Button';
import { Badge } from '@/components/brutal/Badge';
import { Input } from '@/components/brutal/Input';
import { Select } from '@/components/brutal/Select';
import { CATEGORY_LABELS, STATUS_LABELS, ComplaintCategory, ComplaintStatus, Complaint } from '@/types';
import { formatRelativeTime } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n';

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchId, setSearchId] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    area: '',
    q: '',
  });
  const { t } = useTranslation();

  useEffect(() => {
    fetchComplaints();
  }, [filters]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.status) params.append('status', filters.status);
      if (filters.area) params.append('area', filters.area);
      if (filters.q) params.append('q', filters.q);
      params.append('limit', '20');

      const response = await fetch(`/api/complaints?${params}`);
      const data = await response.json();
      setComplaints(data.complaints || []);
    } catch (error) {
      console.error('Failed to fetch complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setFilters((current) => ({ ...current, q: searchId.trim() }));
  };

  const exportComplaints = async () => {
    const params = new URLSearchParams({ limit: '500' });
    Object.entries(filters).forEach(([key, value]) => value && params.set(key, value));
    const response = await fetch(`/api/complaints?${params}`);
    const data = await response.json();
    const rows: string[][] = (data.complaints || []).map((complaint: Complaint) => [
      complaint.complaintId,
      complaint.title,
      complaint.category,
      complaint.status,
      complaint.priority,
      complaint.area,
      complaint.pincode || '',
      complaint.department || '',
      String(complaint.createdAt),
    ]);
    const csv = [['Complaint ID', 'Title', 'Category', 'Status', 'Priority', 'Area', 'Pincode', 'Department', 'Created'], ...rows]
      .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(','))
      .join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'delhi-civic-complaints.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <div className="mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-5xl font-bold mb-4">
          {t('trackComplaint')}
        </h1>
        <p className="text-lg text-civic-muted">
          {t('searchPlaceholder')}
        </p>
      </div>

      {/* Search by ID */}
      <Card className="mb-8">
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder={t('searchPlaceholder')}
                value={searchId}
                onChange={(e) => setSearchId(e.target.value.toUpperCase())}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button variant="primary" onClick={handleSearch}>
              <Search size={20} />
              {t('search')}
            </Button>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button variant="ghost" size="sm" onClick={exportComplaints}>
              <Download size={16} /> {t('exportCsv')}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => window.print()}>
              <FileText size={16} /> {t('printPdf')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="mb-8">
        <CardContent>
          <div className="flex items-center gap-3 mb-4">
            <Filter size={20} />
            <h2 className="font-bold text-lg">FILTERS</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
              placeholder={t('areaLocality')}
              value={filters.area}
              onChange={(e) => setFilters({ ...filters, area: e.target.value })}
            />
          </div>
          {(filters.category || filters.status || filters.area) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchId('');
                setFilters({ category: '', status: '', area: '', q: '' });
              }}
              className="mt-4"
            >
              {t('clearFilters')}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {loading ? (
        <div className="text-center py-12">
          <div className="text-xl font-bold text-civic-muted">{t('loading')}</div>
        </div>
      ) : complaints.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-xl font-bold text-civic-muted mb-4">
              {t('noComplaintsFound')}
            </div>
            <p className="text-civic-muted mb-6">
              {t('searchPlaceholder')}
            </p>
            <Link href="/report">
              <Button variant="primary">
                {t('reportNewIssue')}
                <ArrowRight size={20} />
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {complaints.map((complaint, index) => (
            <Link key={`${complaint.complaintId}-${index}`} href={`/complaints/${complaint.complaintId}`}>
              <Card className="hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-sm transition-all cursor-pointer">
                <CardContent>
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <div className="font-mono font-bold text-lg">
                          {complaint.complaintId}
                        </div>
                        {complaint.status && (
                          <Badge status={complaint.status}>
                            {complaint.status.replace('_', ' ')}
                          </Badge>
                        )}
                        <div className="label-mono">
                          {formatRelativeTime(complaint.createdAt)}
                        </div>
                      </div>
                      
                      <div className="font-bold text-xl mb-2">
                        {complaint.title}
                      </div>
                      
                      <div className="text-sm text-civic-muted mb-3 line-clamp-2">
                        {complaint.description}
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div>
                          <span className="label-mono">CATEGORY:</span>{' '}
                          <span className="font-bold">
                            {CATEGORY_LABELS[complaint.category as ComplaintCategory]}
                          </span>
                        </div>
                        <div>
                          <span className="label-mono">AREA:</span>{' '}
                          <span className="font-bold">{complaint.area}</span>
                        </div>
                        {complaint.department && (
                          <div>
                            <span className="label-mono">DEPT:</span>{' '}
                            <span className="font-bold">{complaint.department}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <ArrowRight size={24} className="text-civic-muted" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
