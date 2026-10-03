import Link from 'next/link';
import { LayoutDashboard, FileText, Map, Building2, Users, Settings } from 'lucide-react';
import { Card, CardContent } from '@/components/brutal/Card';

async function getAdminStats() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/stats`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
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

        {/* Prototype Notice */}
        <Card variant="accent" className="mt-12">
          <CardContent className="text-center py-8">
            <h3 className="text-xl font-bold mb-3 text-civic-white">
              ⚠ PROTOTYPE NOTICE
            </h3>
            <p className="text-civic-white/90">
              This is a demonstration admin panel. In production, this would be secured with proper authentication, role-based access control, and audit logging.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
