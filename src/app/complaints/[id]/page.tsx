import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Calendar, Eye } from 'lucide-react';
import { Button } from '@/components/brutal/Button';
import { Card, CardContent, CardHeader } from '@/components/brutal/Card';
import { Badge } from '@/components/brutal/Badge';
import { CATEGORY_LABELS, Complaint, ComplaintCategory, Representative } from '@/types';
import { formatDate, formatRelativeTime } from '@/lib/utils';
import ComplaintLocationMap from '@/components/map/ComplaintLocationMapClient';
import RepresentativesCard from '@/components/brutal/RepresentativesCard';
import ComplaintEngagement from '@/components/brutal/ComplaintEngagement';
import SlaCountdown from '@/components/brutal/SlaCountdown';
import { getDb } from '@/lib/mongodb';
import { MLACollection, MLAModel } from '@/models/MLA';
import { DepartmentHeadCollection, DepartmentHeadModel } from '@/models/DepartmentHead';
import CollapsibleShareCard from '@/components/brutal/CollapsibleShareCard';

const DEPARTMENT_CATEGORY_BY_COMPLAINT: Partial<Record<ComplaintCategory, ComplaintCategory>> = {
  WATER_SUPPLY: 'WATER_SUPPLY_SEWAGE',
  DRAINAGE: 'WATER_SUPPLY_SEWAGE',
  SEWERAGE: 'WATER_SUPPLY_SEWAGE',
  ROADS: 'MUNICIPAL_CIVIC',
  GARBAGE: 'MUNICIPAL_CIVIC',
  STREETLIGHTS: 'MUNICIPAL_CIVIC',
  PARKS: 'MUNICIPAL_CIVIC',
  PUBLIC_TOILETS: 'MUNICIPAL_CIVIC',
  STRAY_ANIMALS: 'MUNICIPAL_CIVIC',
  POLLUTION: 'POLLUTION_CONTROL',
  ILLEGAL_DUMPING: 'POLLUTION_CONTROL',
};

async function getComplaint(id: string): Promise<Complaint | null> {
  try {
    const db = await getDb();
    const complaintsCollection = db.collection<Complaint>('complaints');
    const normalizedId = id.trim().toUpperCase();

    const complaint = await complaintsCollection.findOne({ complaintId: normalizedId });
    if (!complaint) return null;

    return Object.fromEntries(
      Object.entries(complaint).filter(([key]) => key !== '_id')
    ) as unknown as Complaint;
  } catch (error) {
    console.error('Failed to fetch complaint from database:', error);
    return null;
  }
}

async function getRepresentatives(pincode: string, category: ComplaintCategory): Promise<Representative[]> {
  try {
    const db = await getDb();
    const mlaCollection = db.collection<MLAModel>(MLACollection);
    const deptHeadCollection = db.collection<DepartmentHeadModel>(DepartmentHeadCollection);

    const mla = await mlaCollection.findOne({
      pincodes: pincode,
      isActive: true,
    });

    const departmentCategory = DEPARTMENT_CATEGORY_BY_COMPLAINT[category];
    const departmentHeads = await deptHeadCollection.find({
      state: 'Delhi',
      isActive: true,
      ...(departmentCategory ? { departmentCategory } : {}),
    }).toArray();

    const representatives: Representative[] = [];

    if (mla) {
      representatives.push({
        type: 'MLA',
        name: mla.name,
        designation: `MLA - ${mla.constituency}`,
        party: mla.party,
        phone: mla.phone,
        email: mla.email,
        address: mla.address,
        photoUrl: mla.photoUrl,
        jurisdiction: mla.constituency,
        pincode: pincode,
        area: mla.constituency,
        x: mla.x,
        instagram: mla.instagram,
      });
    }

    for (const dept of departmentHeads) {
      representatives.push({
        type: 'DEPARTMENT_HEAD',
        name: dept.name,
        designation: dept.designation,
        department: dept.department,
        phone: dept.phone,
        email: dept.email,
        address: dept.officeAddress,
        photoUrl: dept.photoUrl,
        jurisdiction: dept.jurisdiction || dept.department,
        pincode: dept.pincode,
        area: dept.city || dept.district,
        ward: dept.ward,
        x: dept.x,
        instagram: dept.instagram,
      });
    }

    return representatives;
  } catch (error) {
    console.error('Failed to fetch representatives:', error);
    return [];
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

  const representatives = complaint.pincode && complaint.category
    ? await getRepresentatives(complaint.pincode, complaint.category)
    : [];

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

      <SlaCountdown dueAt={complaint.slaDueAt} status={complaint.status} />

      {/* Amplify Section - Collapsible */}
      <CollapsibleShareCard complaint={complaint} representatives={representatives} />

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
                        <img src={img} alt={`Complaint evidence ${idx + 1}`} className="h-full w-full object-cover" />
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
                      (h) => h.status === status && h.isPublic !== false
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
              {complaint.status === 'RESOLVED' && complaint.resolutionImages && complaint.resolutionImages.length > 0 && (
                <div className="mt-6 border-t-2 border-civic-black pt-6">
                  <div className="label-mono mb-4">RESOLUTION PROOF</div>
                  <div className="grid grid-cols-2 gap-4">
                    {complaint.resolutionImages.map((image, index) => (
                      <img key={index} src={image} alt={`Resolution proof ${index + 1}`} className="aspect-video w-full border-2 border-civic-black object-cover" />
                    ))}
                  </div>
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

          <RepresentativesCard representatives={representatives} />

          {/* Priority */}
          <Card>
            <CardContent>
              <div className="label-mono mb-1">PRIORITY</div>
              <div className="font-bold">{complaint.priority}</div>
            </CardContent>
          </Card>

        </div>
      </div>

      <div className="mt-6">
        <ComplaintEngagement
          complaintId={complaint.complaintId}
          status={complaint.status}
          confirmationCount={complaint.confirmationCount}
        />
      </div>
    </div>
  );
}
