'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, Filter, RefreshCw, Search } from 'lucide-react';
import { Button } from '@/components/brutal/Button';
import { Card, CardContent } from '@/components/brutal/Card';
import { Badge } from '@/components/brutal/Badge';
import { Select } from '@/components/brutal/Select';
import { Input } from '@/components/brutal/Input';
import { AdminAccessGuard } from '@/components/admin/AdminAccessGuard';
import { CATEGORY_LABELS, STATUS_LABELS, ComplaintCategory, ComplaintStatus } from '@/types';
import { formatDate } from '@/lib/utils';
import { DEPARTMENT_OPTIONS } from '@/lib/departments';

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    priority: '',
    department: '',
    assignedTo: '',
    overdue: false,
  });

  useEffect(() => {
    fetchComplaints();
  }, [filters, page, search]);

  const fetchComplaints = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.department) params.append('department', filters.department);
      if (filters.assignedTo) params.append('assignedTo', filters.assignedTo);
      if (filters.overdue) params.append('overdue', 'true');
      if (search.trim()) params.append('q', search.trim());
      params.append('page', String(page));
      params.append('limit', '25');
      params.append('sortBy', 'createdAt');
      params.append('sortOrder', 'desc');

      const response = await fetch(`/api/complaints?${params}`);
      const data = await response.json();
      const safeComplaints = (data.complaints || []).filter(
        (complaint: any) => complaint?.complaintId && complaint?.status && complaint?.title
      );
      setComplaints(safeComplaints);
      setPagination(data.pagination || { page, pages: 1, total: safeComplaints.length });
    } catch (error) {
      console.error('Failed to fetch complaints:', error);
      setError('Could not load complaints. Check the connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const exportComplaints = async () => {
    const params = new URLSearchParams({ limit: '500', sortBy: 'createdAt', sortOrder: 'desc' });
    if (search.trim()) params.set('q', search.trim());
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, String(value));
    });
    const response = await fetch(`/api/complaints?${params}`);
    const data = await response.json();
    const rows = (data.complaints || []).map((complaint: any) => [
      complaint.complaintId,
      complaint.title,
      complaint.status,
      complaint.priority,
      complaint.department || '',
      complaint.assignedTo || '',
      complaint.area || '',
      complaint.slaDueAt || '',
    ]);
    const csv = [['ID', 'TITLE', 'STATUS', 'PRIORITY', 'DEPARTMENT', 'ASSIGNED TO', 'AREA', 'SLA DUE'], ...rows]
      .map((row) => row.map((value: string) => `"${String(value).replaceAll('"', '""')}"`).join(','))
      .join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'civic-pulse-management-queue.csv';
    link.click();
    URL.revokeObjectURL(url);
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
            <p className="mt-2 text-sm text-civic-white/60">{pagination.total} complaints in the operational queue</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row">
            <div className="flex flex-1 gap-3">
              <Input
                value={search}
                onChange={(event) => { setPage(1); setSearch(event.target.value); }}
                placeholder="Search ID, title, area, or description"
                aria-label="Search complaints"
              />
              <Button variant="primary" aria-label="Search complaints">
                <Search size={18} /> SEARCH
              </Button>
            </div>
            <Button variant="ghost" onClick={fetchComplaints} disabled={loading}>
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} /> REFRESH
            </Button>
            <Button variant="ghost" onClick={exportComplaints}>
              <Download size={18} /> EXPORT CSV
            </Button>
          </div>

          {error && <div className="mb-6 border-2 border-civic-accent bg-civic-accent/10 p-4 font-bold">{error}</div>}

          {/* Filters */}
          <Card className="mb-6">
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <Filter size={20} />
                <h2 className="font-bold">FILTERS</h2>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
                <Select
                  label="DEPARTMENT"
                  options={[
                    { value: '', label: 'All Departments' },
                    ...DEPARTMENT_OPTIONS.map((department) => ({ value: department, label: department })),
                  ]}
                  value={filters.department}
                  onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                />
                <Input
                  label="ASSIGNED TO"
                  value={filters.assignedTo}
                  onChange={(e) => setFilters({ ...filters, assignedTo: e.target.value })}
                  placeholder="Officer name"
                />
                <label className="flex items-center gap-3 font-bold">
                  <input
                    type="checkbox"
                    checked={filters.overdue}
                    onChange={(e) => setFilters({ ...filters, overdue: e.target.checked })}
                    className="h-5 w-5"
                  />
                  OVERDUE ONLY
                </label>
              </div>
              {(filters.category || filters.status || filters.priority || filters.department || filters.assignedTo || filters.overdue || search) && (
                <Button variant="ghost" size="sm" className="mt-4" onClick={() => {
                  setFilters({ category: '', status: '', priority: '', department: '', assignedTo: '', overdue: false });
                  setSearch('');
                  setPage(1);
                }}>
                  CLEAR ALL FILTERS
                </Button>
              )}
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
                      ASSIGNMENT
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
                      SLA
                    </th>
                    <th className="px-4 py-3 text-left font-bold text-xs tracking-wider border-b-2 border-civic-white/20">
                      CONFIRMS
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
                        <td className="px-4 py-3 text-xs">
                          <div className="font-bold">{complaint.department || 'UNASSIGNED'}</div>
                          <div className="text-civic-muted">{complaint.assignedTo || 'No officer'}</div>
                        </td>
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
                        <td className={`px-4 py-3 text-xs font-mono font-bold ${
                          complaint.slaDueAt && new Date(complaint.slaDueAt) < new Date() && !['RESOLVED', 'REJECTED', 'DUPLICATE'].includes(complaint.status)
                            ? 'text-civic-accent'
                            : ''
                        }`}>
                          {complaint.slaDueAt ? formatDate(complaint.slaDueAt).toUpperCase() : 'NOT SET'}
                        </td>
                        <td className="px-4 py-3 text-sm font-bold">{complaint.confirmationCount || 0}</td>
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
              {pagination.pages > 1 && (
                <div className="flex items-center justify-between border-2 border-t-0 border-civic-black bg-civic-white p-4 text-civic-black">
                  <span className="text-sm font-bold">PAGE {pagination.page} OF {pagination.pages}</span>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>PREVIOUS</Button>
                    <Button variant="ghost" size="sm" disabled={page >= pagination.pages} onClick={() => setPage((current) => current + 1)}>NEXT</Button>
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
