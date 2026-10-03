import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Calendar, Eye } from 'lucide-react';
import { Button } from '@/components/brutal/Button';
import { Card, CardContent, CardHeader } from '@/components/brutal/Card';
import { Badge } from '@/components/brutal/Badge';
import { CATEGORY_LABELS, STATUS_LABELS, Complaint, ComplaintCategory } from '@/types';
import { formatDate, formatRelativeTime } from '@/lib/utils';
import ComplaintLocationMap from '@/components/map/ComplaintLocationMapClient';

async function getComplaint(id: string): Promise<Complaint | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/complaints/${id}`,
      { cache: 'no-store' }
    );
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('Failed to fetch complaint:', error);
    return null;
  }
}

export default async function ComplaintDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const complaint = await getComplaint(id);

  if (!complaint) {
    notFound();
  }

  const statusIndex = ['SUBMITTED', 'VERIFIED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'].indexOf(
    complaint.status
  );

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <Link href="/complaints">
        <Button variant="ghost" size="sm" className="mb-6">
          <ArrowLeft size={16} />
          BACK TO ALL COMPLAINTS
        </Button>
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
          <h1 className="text-3xl sm:text-5xl font-bold font-mono">
            {complaint.complaintId}
          </h1>
          <Badge status={complaint.status}>
            {complaint.status.replace('_', ' ')}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-4 label-mono">
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            FILED {formatDate(complaint.createdAt).toUpperCase()}
          </div>
          <div className="flex items-center gap-2">
            <Eye size={16} />
            {complaint.viewCount} VIEWS
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Details */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold">{complaint.title}</h2>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="label-mono mb-2">CATEGORY</div>
                <div className="font-bold text-lg">
                  {CATEGORY_LABELS[complaint.category as ComplaintCategory]}
                </div>
              </div>

              <div className="border-t-2 border-civic-black pt-6">
                <div className="label-mono mb-2">DESCRIPTION</div>
                <div className="leading-relaxed whitespace-pre-wrap">
                  {complaint.description}
                </div>
              </div>

              {complaint.images && complaint.images.length > 0 && (
                <div className="border-t-2 border-civic-black pt-6">
                  <div className="label-mono mb-4">PHOTOS</div>
                  <div className="grid grid-cols-2 gap-4">
                    {complaint.images.map((img, idx) => (
                      <div
                        key={idx}
                        className="aspect-video bg-civic-bg border-2 border-civic-black"
                      >
                        {/* Image placeholder */}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold">STATUS TIMELINE</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {['SUBMITTED', 'VERIFIED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'].map(
                  (status, index) => {
                    const historyEntry = complaint.statusHistory.find(
                      (h) => h.status === status
                    );
                    const isActive = status === complaint.status;
                    const isPast = index <= statusIndex;
                    const isFuture = index > statusIndex;

                    return (
                      <div key={status} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              isPast
                                ? 'bg-civic-accent border-civic-accent'
                                : 'bg-civic-white border-civic-black'
                            }`}
                          >
                            {isPast && (
                              <div className="w-3 h-3 bg-civic-white rounded-full" />
                            )}
                          </div>
                          {index < 4 && (
                            <div
                              className={`w-0.5 h-12 ${
                                isPast ? 'bg-civic-accent' : 'bg-civic-black/20'
                              }`}
                            />
                          )}
                        </div>
                        <div className="flex-1 pb-6">
                          <div
                            className={`font-bold mb-1 ${
                              isActive ? 'text-civic-accent text-lg' : ''
                            }`}
                          >
                            {status.replace('_', ' ')}
                          </div>
                          {historyEntry && (
                            <>
                              <div className="label-mono mb-2">
                                {formatRelativeTime(historyEntry.timestamp)}
                              </div>
                              {historyEntry.note && (
                                <div className="text-sm text-civic-muted">
                                  {historyEntry.note}
                                </div>
                              )}
                            </>
                          )}
                          {isFuture && (
                            <div className="text-sm text-civic-muted">Pending</div>
                          )}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>

              {complaint.status === 'RESOLVED' && complaint.resolutionNote && (
                <div className="mt-6 pt-6 border-t-2 border-civic-black">
                  <div className="label-mono mb-2">RESOLUTION</div>
                  <div className="leading-relaxed">{complaint.resolutionNote}</div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Location */}
          <Card>
            <CardHeader>
              <h3 className="font-bold flex items-center gap-2">
                <MapPin size={20} />
                LOCATION
              </h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="label-mono mb-1">AREA</div>
                <div className="font-bold">{complaint.area}</div>
              </div>
              {complaint.ward && (
                <div>
                  <div className="label-mono mb-1">WARD</div>
                  <div className="font-bold">{complaint.ward}</div>
                </div>
              )}
              {complaint.pincode && (
                <div>
                  <div className="label-mono mb-1">PINCODE</div>
                  <div className="font-bold">{complaint.pincode}</div>
                </div>
              )}
              {complaint.location && (
                <div className="mt-4" style={{ height: '200px' }}>
                  <ComplaintLocationMap
                    location={complaint.location}
                    complaintId={complaint.complaintId}
                    title={complaint.title}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Department */}
          {complaint.department && (
            <Card>
              <CardContent>
                <div className="label-mono mb-1">DEPARTMENT</div>
                <div className="font-bold">{complaint.department}</div>
              </CardContent>
            </Card>
          )}

          {/* Priority */}
          <Card>
            <CardContent>
              <div className="label-mono mb-1">PRIORITY</div>
              <div className="font-bold">{complaint.priority}</div>
            </CardContent>
          </Card>

          {/* Reopen */}
          {complaint.status === 'RESOLVED' && (
            <Button variant="ghost" block>
              REOPEN COMPLAINT
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
