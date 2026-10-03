'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/brutal/Button';
import { Card, CardContent, CardHeader } from '@/components/brutal/Card';
import { Badge } from '@/components/brutal/Badge';
import { Select } from '@/components/brutal/Select';
import { Textarea } from '@/components/brutal/Input';
import { AdminAccessGuard } from '@/components/admin/AdminAccessGuard';
import { CATEGORY_LABELS, STATUS_LABELS, ComplaintCategory, ComplaintStatus } from '@/types';
import { formatDateTime } from '@/lib/utils';

export default function AdminComplaintDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [complaint, setComplaint] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  const [updateData, setUpdateData] = useState({
    status: '' as ComplaintStatus | '',
    priority: '',
    department: '',
    note: '',
    assignedTo: '',
    resolutionNote: '',
  });

  useEffect(() => {
    fetchComplaint();
  }, [params.id]);

  const fetchComplaint = async () => {
    try {
      const response = await fetch(`/api/complaints/${params.id}`);
      if (!response.ok) throw new Error('Complaint not found');
      const data = await response.json();
      setComplaint(data);
      setUpdateData({
        status: data.status,
        priority: data.priority,
        department: data.department || '',
        note: '',
        assignedTo: data.assignedTo || '',
        resolutionNote: data.resolutionNote || '',
      });
    } catch (error) {
      console.error('Failed to fetch complaint:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setUpdating(true);
    
    try {
      const response = await fetch(`/api/complaints/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) throw new Error('Failed to update complaint');

      alert('Complaint updated successfully');
      fetchComplaint();
    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update complaint');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-civic-black text-civic-white flex items-center justify-center">
        <div className="text-xl font-bold">LOADING...</div>
      </div>
    );
  }

  const complaintStatus = complaint?.status || 'SUBMITTED';
  const complaintHistory = Array.isArray(complaint?.statusHistory) ? complaint.statusHistory : [];

  if (!complaint) {
    return (
      <div className="min-h-screen bg-civic-black text-civic-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-bold mb-4">COMPLAINT NOT FOUND</div>
          <Link href="/admin/complaints">
            <Button variant="white">BACK TO COMPLAINTS</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <AdminAccessGuard>
      <div className="min-h-screen bg-civic-black text-civic-white">
        <div className="border-b-2 border-civic-white/20">
          <div className="container mx-auto px-4 py-6">
            <Link href="/admin/complaints">
              <Button variant="ghost" size="sm" className="mb-4 text-white! border-white!">
                <ArrowLeft size={16} />
                BACK TO COMPLAINTS
              </Button>
            </Link>
            <div className="flex items-center gap-4">
              <h1 className="text-2xl sm:text-3xl font-bold font-mono">
                {complaint.complaintId}
              </h1>
              <Badge status={complaintStatus as ComplaintStatus}>
                {complaintStatus.replace('_', ' ')}
              </Badge>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-bold">{complaint.title}</h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="label-mono mb-2">CATEGORY</div>
                    <div className="font-bold">
                      {CATEGORY_LABELS[complaint.category as ComplaintCategory]}
                    </div>
                  </div>

                  <div className="border-t-2 border-civic-black pt-4">
                    <div className="label-mono mb-2">DESCRIPTION</div>
                    <div className="leading-relaxed whitespace-pre-wrap">
                      {complaint.description}
                    </div>
                  </div>

                  <div className="border-t-2 border-civic-black pt-4">
                    <div className="label-mono mb-2">LOCATION</div>
                    <div className="font-bold">{complaint.area}</div>
                    {complaint.ward && <div className="text-sm">Ward: {complaint.ward}</div>}
                    {complaint.pincode && <div className="text-sm">Pincode: {complaint.pincode}</div>}
                  </div>

                  {!complaint.anonymous && complaint.citizenName && (
                    <div className="border-t-2 border-civic-black pt-4">
                      <div className="label-mono mb-2">CITIZEN INFO</div>
                      <div className="font-bold">{complaint.citizenName}</div>
                      {complaint.citizenPhone && <div className="text-sm">{complaint.citizenPhone}</div>}
                      {complaint.citizenEmail && <div className="text-sm">{complaint.citizenEmail}</div>}
                    </div>
                  )}

                  <div className="border-t-2 border-civic-black pt-4">
                    <div className="label-mono mb-2">FILED</div>
                    <div className="font-mono text-sm">
                      {formatDateTime(complaint.createdAt).toUpperCase()}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Status History */}
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-bold">AUDIT HISTORY</h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {complaintHistory.length > 0 ? complaintHistory.map((entry: any, index: number) => {
                      const entryStatus = entry?.status || 'SUBMITTED';

                      return (
                        <div key={index} className="pb-4 border-b-2 border-civic-black last:border-0 last:pb-0">
                          <div className="flex items-center justify-between mb-2">
                            <Badge status={entryStatus as ComplaintStatus}>
                              {entryStatus.replace('_', ' ')}
                            </Badge>
                            <div className="font-mono text-xs">
                              {formatDateTime(entry?.timestamp || new Date()).toUpperCase()}
                            </div>
                          </div>
                          {entry?.note && (
                            <div className="text-sm text-civic-muted mt-2">
                              {entry.note}
                            </div>
                          )}
                        </div>
                      );
                    }) : (
                      <div className="text-sm text-civic-muted">No status history available.</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Admin Actions */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <h3 className="font-bold">UPDATE STATUS</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select
                    label="STATUS"
                    options={[
                      ...(Object.keys(STATUS_LABELS) as ComplaintStatus[]).map((status) => ({
                        value: status,
                        label: STATUS_LABELS[status],
                      })),
                    ]}
                    value={updateData.status}
                    onChange={(e) => setUpdateData({ ...updateData, status: e.target.value as ComplaintStatus })}
                  />

                  <Select
                    label="PRIORITY"
                    options={[
                      { value: 'LOW', label: 'Low' },
                      { value: 'MEDIUM', label: 'Medium' },
                      { value: 'HIGH', label: 'High' },
                      { value: 'URGENT', label: 'Urgent' },
                    ]}
                    value={updateData.priority}
                    onChange={(e) => setUpdateData({ ...updateData, priority: e.target.value })}
                  />

                  <Textarea
                    label="UPDATE NOTE"
                    value={updateData.note}
                    onChange={(e) => setUpdateData({ ...updateData, note: e.target.value })}
                    placeholder="Add a note about this update..."
                    rows={3}
                  />

                  {updateData.status === 'RESOLVED' && (
                    <Textarea
                      label="RESOLUTION NOTE"
                      value={updateData.resolutionNote}
                      onChange={(e) => setUpdateData({ ...updateData, resolutionNote: e.target.value })}
                      placeholder="Describe how the issue was resolved..."
                      rows={3}
                    />
                  )}

                  <Button
                    variant="primary"
                    block
                    onClick={handleUpdate}
                    disabled={updating}
                  >
                    <Save size={20} />
                    {updating ? 'UPDATING...' : 'SAVE CHANGES'}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="label-mono mb-1">VIEWS</div>
                      <div className="font-bold">{complaint.viewCount}</div>
                    </div>
                    <div>
                      <div className="label-mono mb-1">LAST UPDATED</div>
                      <div className="font-mono text-xs">
                        {formatDateTime(complaint.updatedAt).toUpperCase()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AdminAccessGuard>
  );
}
