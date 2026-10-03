import Link from 'next/link';
import { LayoutDashboard, FileText, Map, Building2, Users, Settings } from 'lucide-react';
import { Card, CardContent } from '@/components/brutal/Card';
import { AdminAccessGuard } from '@/components/admin/AdminAccessGuard';
import { getDb } from '@/lib/mongodb';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getAdminStats() {
  try {
    const db = await getDb();
    const complaintsCollection = db.collection('complaints');
    const validComplaintFilter = {
      complaintId: { $exists: true, $ne: null },
      status: { $exists: true, $ne: null },
      title: { $exists: true, $ne: null },
      category: { $exists: true, $ne: null },
    };

    const [total, byStatus, byCategory, thisWeek, resolved] = await Promise.all([
      complaintsCollection.countDocuments(validComplaintFilter),
      complaintsCollection.aggregate([
        { $match: validComplaintFilter },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]).toArray(),
      complaintsCollection.aggregate([
        { $match: validComplaintFilter },
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ]).toArray(),
      complaintsCollection.countDocuments({
        ...validComplaintFilter,
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      }),
      complaintsCollection.countDocuments({ ...validComplaintFilter, status: 'RESOLVED' })
    ]);

    const statusMap = byStatus.reduce((acc: any, item: any) => {
      acc[item._id] = item.count;
      return acc;
    }, {
      SUBMITTED: 0,
      VERIFIED: 0,
      ASSIGNED: 0,
      IN_PROGRESS: 0,
      RESOLVED: 0
    });

    const categoryMap = byCategory.reduce((acc: any, item: any) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    return {
      total,
      open: total - resolved,
      resolved,
      thisWeek,
      byStatus: statusMap,
      byCategory: categoryMap
    };
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    return null;
  }
}

export default async function AdminPage() {
  const stats = await getAdminStats();

  const pendingVerification = stats?.byStatus?.SUBMITTED || 0;
  const unassigned = stats?.byStatus?.VERIFIED || 0;
  const inProgress = stats?.byStatus?.IN_PROGRESS || 0;

  return (
    <AdminAccessGuard>
      <div className="min-h-screen bg-civic-black text-civic-white">
        <div className="border-b-2 border-civic-white/20">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl sm:text-3xl font-bold label-editorial">
              CIVIC CONTROL // DELHI
            </h1>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 sm:py-12">
          {/* Quick Stats */}
          {stats && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              <Card>
                <CardContent className="text-center py-6">
                  <div className="text-4xl sm:text-5xl font-bold text-civic-black mb-2">
                    {stats.total}
                  </div>
                  <div className="label-mono">TOTAL</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="text-center py-6">
                  <div className="text-4xl sm:text-5xl font-bold text-orange-500 mb-2">
                    {pendingVerification}
                  </div>
                  <div className="label-mono">PENDING</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="text-center py-6">
                  <div className="text-4xl sm:text-5xl font-bold text-purple-500 mb-2">
                    {unassigned}
                  </div>
                  <div className="label-mono">UNASSIGNED</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="text-center py-6">
                  <div className="text-4xl sm:text-5xl font-bold text-blue-500 mb-2">
                    {inProgress}
                  </div>
                  <div className="label-mono">IN PROGRESS</div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Admin Navigation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/admin/complaints">
              <Card className="h-full hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-sm transition-all cursor-pointer">
                <CardContent className="py-8">
                  <FileText size={48} className="mb-4" />
                  <h2 className="text-2xl font-bold mb-2">COMPLAINTS</h2>
                  <p className="text-civic-muted">
                    View and manage all civic complaints
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/map">
              <Card className="h-full hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-sm transition-all cursor-pointer">
                <CardContent className="py-8">
                  <Map size={48} className="mb-4" />
                  <h2 className="text-2xl font-bold mb-2">MAP VIEW</h2>
                  <p className="text-civic-muted">
                    Visualize complaints geographically
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Card className="h-full opacity-60">
              <CardContent className="py-8">
                <Building2 size={48} className="mb-4" />
                <h2 className="text-2xl font-bold mb-2">DEPARTMENTS</h2>
                <p className="text-civic-muted">
                  Manage department assignments
                </p>
                <div className="mt-4 text-xs label-mono">COMING SOON</div>
              </CardContent>
            </Card>

            <Card className="h-full opacity-60">
              <CardContent className="py-8">
                <Users size={48} className="mb-4" />
                <h2 className="text-2xl font-bold mb-2">USERS</h2>
                <p className="text-civic-muted">
                  Manage user accounts and roles
                </p>
                <div className="mt-4 text-xs label-mono">COMING SOON</div>
              </CardContent>
            </Card>

            <Card className="h-full opacity-60">
              <CardContent className="py-8">
                <LayoutDashboard size={48} className="mb-4" />
                <h2 className="text-2xl font-bold mb-2">ANALYTICS</h2>
                <p className="text-civic-muted">
                  View trends and insights
                </p>
                <div className="mt-4 text-xs label-mono">COMING SOON</div>
              </CardContent>
            </Card>

            <Card className="h-full opacity-60">
              <CardContent className="py-8">
                <Settings size={48} className="mb-4" />
                <h2 className="text-2xl font-bold mb-2">SETTINGS</h2>
                <p className="text-civic-muted">
                  Configure system preferences
                </p>
                <div className="mt-4 text-xs label-mono">COMING SOON</div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </AdminAccessGuard>
  );
}
