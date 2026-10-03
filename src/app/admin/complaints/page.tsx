'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Filter } from 'lucide-react';
import { Button } from '@/components/brutal/Button';
import { Card, CardContent } from '@/components/brutal/Card';
import { Badge } from '@/components/brutal/Badge';
import { Select } from '@/components/brutal/Select';
import { AdminAccessGuard } from '@/components/admin/AdminAccessGuard';
import { CATEGORY_LABELS, STATUS_LABELS, ComplaintCategory, ComplaintStatus } from '@/types';
import { formatDate } from '@/lib/utils';

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    priority: '',
  });

  useEffect(() => {
    fetchComplaints();
  }, [filters]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);
      params.append('limit', '100');
      params.append('sortBy', 'createdAt');
      params.append('sortOrder', 'desc');

      const response = await fetch(`/api/complaints?${params}`);
      const data = await response.json();
      const safeComplaints = (data.complaints || []).filter(
        (complaint: any) => complaint?.complaintId && complaint?.status && complaint?.title
      );
      setComplaints(safeComplaints);
    } catch (error) {
      console.error('Failed to fetch complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminAccessGuard>
      <div className="min-h-screen bg-civic-black text-civic-white">
        <div className="border-b-2 border-civic-white/20">
          <div className="container mx-auto px-4 py-6">
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="mb-4 text-white! border-white!">
                <ArrowLeft size={16} />
                BACK TO ADMIN
              </Button>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold label-editorial">
              COMPLAINT MANAGEMENT
            </h1>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Filters */}
          <Card className="mb-6">
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <Filter size={20} />
                <h2 className="font-bold">FILTERS</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Select
                  options={[
                    { value: '', label: 'All Categories' },
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
                    { value: '', label: 'All Statuses' },
                    ...(Object.keys(STATUS_LABELS) as ComplaintStatus[]).map((status) => ({
                      value: status,
                      label: STATUS_LABELS[status],
                    })),
                  ]}
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                />
                <Select
                  options={[
                    { value: '', label: 'All Priorities' },
                    { value: 'LOW', label: 'Low' },
                    { value: 'MEDIUM', label: 'Medium' },
                    { value: 'HIGH', label: 'High' },
                    { value: 'URGENT', label: 'Urgent' },
                  ]}
                  value={filters.priority}
                  onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Complaints Table */}
          {loading ? (
            <div className="text-center py-12">
              <div className="text-xl font-bold text-civic-white/60">LOADING...</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full bg-civic-white text-civic-black border-2 border-civic-black">
                <thead className="bg-civic-black text-civic-white">
                  <tr>
                    <th className="px-4 py-3 text-left font-bold text-xs tracking-wider border-b-2 border-civic-white/20">
                      ID
                    </th>
                    <th className="px-4 py-3 text-left font-bold text-xs tracking-wider border-b-2 border-civic-white/20">
                      CATEGORY
                    </th>
                    <th className="px-4 py-3 text-left font-bold text-xs tracking-wider border-b-2 border-civic-white/20">
                      TITLE
                    </th>
                    <th className="px-4 py-3 text-left font-bold text-xs tracking-wider border-b-2 border-civic-white/20">
                      AREA
                    </th>
                    <th className="px-4 py-3 text-left font-bold text-xs tracking-wider border-b-2 border-civic-white/20">
                      STATUS
                    </th>
                    <th className="px-4 py-3 text-left font-bold text-xs tracking-wider border-b-2 border-civic-white/20">
                      PRIORITY
                    </th>
                    <th className="px-4 py-3 text-left font-bold text-xs tracking-wider border-b-2 border-civic-white/20">
                      CREATED
                    </th>
                    <th className="px-4 py-3 text-left font-bold text-xs tracking-wider border-b-2 border-civic-white/20">
                      ACTION
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((complaint, index) => {
                    const complaintStatus = complaint.status || 'SUBMITTED';

                    return (
                      <tr
                        key={complaint.complaintId}
                        className={`border-b-2 border-civic-black hover:bg-civic-bg transition-colors ${
                          index % 2 === 0 ? 'bg-civic-white' : 'bg-civic-bg'
                        }`}
                      >
                        <td className="px-4 py-3 font-mono font-bold text-sm">
                          {complaint.complaintId}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {CATEGORY_LABELS[complaint.category as ComplaintCategory] || complaint.category || 'Unknown'}
                        </td>
                        <td className="px-4 py-3 text-sm max-w-xs truncate">
                          {complaint.title || 'Untitled complaint'}
                        </td>
                        <td className="px-4 py-3 text-sm">{complaint.area || 'Unknown area'}</td>
                        <td className="px-4 py-3">
                          <Badge status={complaintStatus as ComplaintStatus}>
                            {complaintStatus.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm font-bold">
                          {complaint.priority || 'MEDIUM'}
                        </td>
                        <td className="px-4 py-3 text-xs font-mono">
                          {formatDate(complaint.createdAt || new Date()).toUpperCase()}
                        </td>
                        <td className="px-4 py-3">
                          <Link href={`/admin/complaints/${complaint.complaintId}`}>
                            <Button variant="ghost" size="sm">
                              MANAGE
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {complaints.length === 0 && (
                <div className="text-center py-12 bg-civic-white border-2 border-civic-black border-t-0">
                  <div className="text-xl font-bold text-civic-muted">
                    NO COMPLAINTS FOUND
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminAccessGuard>
  );
}
