import Link from 'next/link';
import { ArrowRight, TrendingUp, Clock, CheckCircle2, AlertCircle, MapPin, Users, Zap, FileText, Eye, Activity, BarChart3, Sparkles, Shield, MessageSquare, Star, Target, Rocket } from 'lucide-react';
import { Button } from '@/components/brutal/Button';
import { Card, CardContent } from '@/components/brutal/Card';
import { Badge } from '@/components/brutal/Badge';
import { Ticker } from '@/components/layout/Ticker';
import { CATEGORY_LABELS, ComplaintCategory } from '@/types';
import { formatRelativeTime } from '@/lib/utils';
import { AnimatedMetro, AnimatedBus, AnimatedAutoRickshaw, AnimatedDTCBus, AnimatedCycleRickshaw, AnimatedWaterTanker } from '@/components/home/AnimatedVehicles';
import { HeroRotatingHeadline } from '@/components/home/HeroRotatingHeadline';
import { getDb } from '@/lib/mongodb';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getStats() {
  try {
    const db = await getDb();
    const complaintsCollection = db.collection('complaints');
    
    const [total, byStatus, byCategory, thisWeek, resolved] = await Promise.all([
      complaintsCollection.countDocuments(),
      complaintsCollection.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]).toArray(),
      complaintsCollection.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ]).toArray(),
      complaintsCollection.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      }),
      complaintsCollection.countDocuments({ status: 'RESOLVED' })
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

async function getRecentComplaints() {
  try {
    const db = await getDb();
    const complaintsCollection = db.collection('complaints');
    
    const complaints = await complaintsCollection
      .find()
      .sort({ createdAt: -1 })
      .limit(8)
      .toArray();
    
    return complaints.map((c: any) => ({
      ...c,
      _id: c._id.toString(),
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt?.toISOString() || c.createdAt.toISOString()
    }));
  } catch (error) {
    console.error('Failed to fetch recent complaints:', error);
    return [];
  }
}

export default async function HomePage() {
  const stats = await getStats();
  const recentComplaints = await getRecentComplaints();

  const resolutionRate = stats ? Math.round((stats.resolved / stats.total) * 100) : 0;
  const avgResponseTime = stats && stats.total > 0 ? Math.round((stats.total / 30) * 24) : 12;
  
  const topCategories = stats ? 
    (Object.keys(stats.byCategory) as ComplaintCategory[])
      .sort((a, b) => stats.byCategory[b] - stats.byCategory[a])
      .slice(0, 3) : [];

  return (
    <>
      {/* Hero Section - Neobrutalism */}
      <section className="relative bg-cyan-400 border-b-8 border-black overflow-hidden">
        {/* Delhi Civic Elements Background */}
        <div className="absolute inset-0 opacity-5">
          {/* Animated Metro Train */}
          <AnimatedMetro />
          
          {/* Animated DTC Bus */}
          <AnimatedBus />
          
          {/* Animated Auto Rickshaw */}
          <AnimatedAutoRickshaw />
          
          {/* Traffic Light */}
          <div className="absolute top-1/3 right-1/4 w-8 h-32">
            <div className="w-full h-24 bg-black rounded-lg relative">
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-5 h-5 bg-white rounded-full"></div>
              <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-5 h-5 bg-white rounded-full"></div>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 bg-white rounded-full"></div>
            </div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-8 bg-black"></div>
          </div>
          
          {/* Street Lamp */}
          <div className="absolute bottom-32 right-1/3 w-12 h-40">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-32 bg-black"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10 bg-black rounded-full"></div>
            <div className="absolute top-8 left-1/2 -translate-x-1/2 w-8 h-3 bg-black"></div>
          </div>
          
          {/* Garbage Bin */}
          <div className="absolute top-40 left-1/2 w-12 h-16">
            <div className="w-full h-12 bg-black rounded-lg"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-3 bg-black rounded-t-lg"></div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Main Content */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-300 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <Star className="w-5 h-5 fill-black" strokeWidth={0} />
                <span className="text-sm font-black uppercase tracking-wider">Public Civic Platform</span>
              </div>
              
              {/* Main Heading */}
              <div className="space-y-4">
                <HeroRotatingHeadline />

                {/* Underline decoration */}
                <div className="flex gap-2">
                  <div className="h-3 w-24 bg-red-500 border-2 border-black"></div>
                  <div className="h-3 w-16 bg-lime-400 border-2 border-black"></div>
                  <div className="h-3 w-20 bg-pink-400 border-2 border-black"></div>
                </div>
              </div>
              
              <p className="text-xl sm:text-2xl font-bold leading-relaxed max-w-xl">
                Report civic issues. Track progress in real-time. Drive change.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/report">
                  <button className="group relative px-8 py-4 bg-red-500 text-white font-black text-lg uppercase border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all flex items-center gap-2">
                    <Rocket className="w-6 h-6" strokeWidth={3} />
                    Report Issue
                    <ArrowRight className="w-6 h-6" strokeWidth={3} />
                  </button>
                </Link>
                <Link href="/complaints">
                  <button className="px-8 py-4 bg-white text-black font-black text-lg uppercase border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all">
                    Track Status
                  </button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-lime-400 border-3 border-black">
                  <Shield className="w-5 h-5" strokeWidth={3} />
                  <span className="text-sm font-black">VERIFIED</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-pink-400 border-3 border-black">
                  <Users className="w-5 h-5" strokeWidth={3} />
                  <span className="text-sm font-black">10K+ USERS</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-purple-400 border-3 border-black">
                  <Target className="w-5 h-5" strokeWidth={3} />
                  <span className="text-sm font-black">24/7 ACTIVE</span>
                </div>
              </div>
            </div>

            {/* Right: Neobrutalism Stats Cards */}
            {stats && (
              <div className="grid grid-cols-2 gap-5">
                {/* Active Cases Card */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-black translate-x-2 translate-y-2"></div>
                  <div className="relative bg-orange-400 border-4 border-black p-6 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform">
                    <AlertCircle className="w-10 h-10 mb-3" strokeWidth={3} />
                    <div className="text-5xl font-black mb-1">{stats.open}</div>
                    <div className="text-xs font-black uppercase tracking-wider">Active Cases</div>
                  </div>
                </div>

                {/* Resolved Card */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-black translate-x-2 translate-y-2"></div>
                  <div className="relative bg-lime-400 border-4 border-black p-6 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform">
                    <CheckCircle2 className="w-10 h-10 mb-3" strokeWidth={3} />
                    <div className="text-5xl font-black mb-1">{stats.resolved}</div>
                    <div className="text-xs font-black uppercase tracking-wider">Resolved</div>
                  </div>
                </div>

                {/* This Week Card */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-black translate-x-2 translate-y-2"></div>
                  <div className="relative bg-cyan-300 border-4 border-black p-6 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform">
                    <Clock className="w-10 h-10 mb-3" strokeWidth={3} />
                    <div className="text-5xl font-black mb-1">{stats.thisWeek}</div>
                    <div className="text-xs font-black uppercase tracking-wider">This Week</div>
                  </div>
                </div>

                {/* Success Rate Card */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-black translate-x-2 translate-y-2"></div>
                  <div className="relative bg-pink-400 border-4 border-black p-6 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform">
                    <TrendingUp className="w-10 h-10 mb-3" strokeWidth={3} />
                    <div className="text-5xl font-black mb-1">{resolutionRate}%</div>
                    <div className="text-xs font-black uppercase tracking-wider">Success</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-r from-red-500 via-yellow-300 to-lime-400"></div>
      </section>

      {/* Ticker */}
      <div className="bg-black text-yellow-300 border-b-4 border-black">
        <Ticker
          items={[
            '⚡ REAL-TIME TRACKING',
            '🎯 TRANSPARENT PROGRESS',
            '🚀 COMMUNITY DRIVEN',
            '⭐ 24/7 MONITORING',
            '✨ INSTANT UPDATES',
            '🛡️ VERIFIED REPORTS',
          ]}
        />
      </div>

      {/* Quick Stats Overview */}
      {stats && (
        <section className="py-16 bg-yellow-300 border-b-8 border-black relative overflow-hidden">
          {/* Electric Pole with Wires */}
          <div className="absolute top-10 right-10 w-48 h-64 opacity-5">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-48 bg-black"></div>
            <div className="absolute top-8 left-0 w-full h-1 bg-black"></div>
            <div className="absolute top-12 left-0 w-full h-1 bg-black"></div>
            <div className="absolute top-16 left-0 w-full h-1 bg-black"></div>
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-black rounded-full"></div>
          </div>
          
          {/* Road Divider Cones */}
          <div className="absolute bottom-10 left-10 flex gap-4 opacity-5">
            <div className="w-6 h-12 bg-black" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
            <div className="w-6 h-12 bg-black" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
            <div className="w-6 h-12 bg-black" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
          </div>
          
          {/* Animated Cycle Rickshaw */}
          <AnimatedCycleRickshaw />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
            <div className="text-center mb-12">
              <div className="inline-block bg-red-500 text-white px-6 py-2 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-4 transform -rotate-1">
                <h2 className="text-4xl sm:text-5xl font-black uppercase">
                  Platform Stats
                </h2>
              </div>
              <p className="text-xl font-bold mt-4">Real-time civic engagement metrics</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Filed */}
              <div className="relative group">
                <div className="absolute inset-0 bg-black translate-x-3 translate-y-3"></div>
                <div className="relative bg-white border-4 border-black p-6 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform">
                  <FileText className="w-12 h-12 mb-4" strokeWidth={2.5} />
                  <div className="text-5xl font-black mb-2">{stats.total}</div>
                  <div className="text-sm font-black uppercase">Total Filed</div>
                </div>
              </div>

              {/* In Progress */}
              <div className="relative group">
                <div className="absolute inset-0 bg-black translate-x-3 translate-y-3"></div>
                <div className="relative bg-cyan-400 border-4 border-black p-6 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform">
                  <Activity className="w-12 h-12 mb-4" strokeWidth={2.5} />
                  <div className="text-5xl font-black mb-2">
                    {stats.byStatus.IN_PROGRESS + stats.byStatus.ASSIGNED}
                  </div>
                  <div className="text-sm font-black uppercase">In Progress</div>
                </div>
              </div>

              {/* Pending */}
              <div className="relative group">
                <div className="absolute inset-0 bg-black translate-x-3 translate-y-3"></div>
                <div className="relative bg-orange-400 border-4 border-black p-6 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform">
                  <Eye className="w-12 h-12 mb-4" strokeWidth={2.5} />
                  <div className="text-5xl font-black mb-2">
                    {stats.byStatus.SUBMITTED + stats.byStatus.VERIFIED}
                  </div>
                  <div className="text-sm font-black uppercase">Pending</div>
                </div>
              </div>

              {/* Avg Response */}
              <div className="relative group">
                <div className="absolute inset-0 bg-black translate-x-3 translate-y-3"></div>
                <div className="relative bg-lime-400 border-4 border-black p-6 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform">
                  <BarChart3 className="w-12 h-12 mb-4" strokeWidth={2.5} />
                  <div className="text-5xl font-black mb-2">{avgResponseTime}h</div>
                  <div className="text-sm font-black uppercase">Avg Response</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="py-16 bg-white border-b-8 border-black relative overflow-hidden">
        {/* Animated Water Tanker */}
        <AnimatedWaterTanker />
        
        {/* Sweeper Vehicle */}
        <div className="absolute bottom-10 left-20 w-52 h-28 opacity-5">
          <div className="absolute bottom-0 left-6 w-8 h-8 bg-black rounded-full"></div>
          <div className="absolute bottom-0 right-6 w-8 h-8 bg-black rounded-full"></div>
          <div className="absolute bottom-8 left-0 w-full h-18 bg-black rounded-t-lg"></div>
          <div className="absolute bottom-8 right-2 w-16 h-4 bg-black rounded-full"></div>
        </div>
        
        {/* Street Vendor Cart */}
        <div className="absolute top-1/2 left-10 w-32 h-24 -translate-y-1/2 opacity-5">
          <div className="absolute bottom-0 left-6 w-6 h-6 bg-black rounded-full"></div>
          <div className="absolute bottom-0 right-6 w-6 h-6 bg-black rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-4 bg-black"></div>
          <div className="absolute top-4 left-2 w-28 h-14 bg-black rounded"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-black uppercase mb-4 inline-block bg-black text-yellow-300 px-6 py-3 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              How It Works
            </h2>
            <p className="text-xl font-bold mt-6">Simple. Transparent. Effective.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-black translate-x-4 translate-y-4"></div>
              <div className="relative bg-red-500 border-4 border-black p-8 group-hover:translate-x-4 group-hover:translate-y-4 transition-transform">
                <div className="absolute -top-6 -left-6 w-16 h-16 bg-yellow-300 border-4 border-black flex items-center justify-center">
                  <span className="text-3xl font-black">01</span>
                </div>
                <div className="mt-6 space-y-4">
                  <div className="w-16 h-16 bg-black flex items-center justify-center">
                    <FileText className="w-8 h-8 text-yellow-300" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-2xl font-black uppercase text-white">Report Issue</h3>
                  <p className="text-white font-bold leading-relaxed">
                    Submit your complaint with photos and location. Quick, easy, secure.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-black translate-x-4 translate-y-4"></div>
              <div className="relative bg-cyan-400 border-4 border-black p-8 group-hover:translate-x-4 group-hover:translate-y-4 transition-transform">
                <div className="absolute -top-6 -left-6 w-16 h-16 bg-pink-400 border-4 border-black flex items-center justify-center">
                  <span className="text-3xl font-black">02</span>
                </div>
                <div className="mt-6 space-y-4">
                  <div className="w-16 h-16 bg-black flex items-center justify-center">
                    <Eye className="w-8 h-8 text-cyan-400" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-2xl font-black uppercase">Track Progress</h3>
                  <p className="font-bold leading-relaxed">
                    Real-time updates as your complaint moves through verification and assignment.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-black translate-x-4 translate-y-4"></div>
              <div className="relative bg-lime-400 border-4 border-black p-8 group-hover:translate-x-4 group-hover:translate-y-4 transition-transform">
                <div className="absolute -top-6 -left-6 w-16 h-16 bg-purple-400 border-4 border-black flex items-center justify-center">
                  <span className="text-3xl font-black">03</span>
                </div>
                <div className="mt-6 space-y-4">
                  <div className="w-16 h-16 bg-black flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-lime-400" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-2xl font-black uppercase">Get Results</h3>
                  <p className="font-bold leading-relaxed">
                    Watch issues get resolved with full transparency and accountability.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Status Dashboard */}
      {stats && (
        <section className="py-16 bg-pink-400 border-b-8 border-black relative overflow-hidden">
          {/* Rashtrapati Bhavan */}
          <div className="absolute top-10 left-10 w-80 h-48 opacity-5">
            <div className="absolute bottom-0 w-full h-20 bg-black"></div>
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-48 h-24 bg-black rounded-t-3xl"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-16 bg-black rounded-full"></div>
            <div className="absolute bottom-16 left-4 w-8 h-28 bg-black"></div>
            <div className="absolute bottom-16 right-4 w-8 h-28 bg-black"></div>
          </div>
          
          {/* DTC Bus */}
          <div className="absolute bottom-20 right-20 w-40 h-28 opacity-5">
            <div className="absolute bottom-0 left-4 w-8 h-8 bg-black rounded-full"></div>
            <div className="absolute bottom-0 right-4 w-8 h-8 bg-black rounded-full"></div>
            <div className="absolute bottom-8 left-0 w-full h-16 bg-black rounded-t-lg"></div>
            <div className="absolute top-8 left-2 w-10 h-8 bg-white"></div>
            <div className="absolute top-8 right-2 w-10 h-8 bg-white"></div>
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
            <div className="flex items-center justify-between mb-12 flex-wrap gap-4">
              <div>
                <h2 className="text-4xl sm:text-5xl font-black uppercase">
                  Live Status
                </h2>
                <p className="text-xl font-bold">Real-time dashboard</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-black text-lime-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                <div className="w-3 h-3 rounded-full bg-lime-400 animate-pulse"></div>
                <span className="text-sm font-black uppercase">Live Now</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="relative">
                <div className="absolute inset-0 bg-white translate-x-3 translate-y-3 border-4 border-black"></div>
                <div className="relative bg-black text-white border-4 border-black p-8">
                  <div className="text-6xl font-black mb-2">{stats.total}</div>
                  <div className="text-sm font-black uppercase tracking-wider">Total</div>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 bg-white translate-x-3 translate-y-3 border-4 border-black"></div>
                <div className="relative bg-orange-400 border-4 border-black p-8">
                  <div className="text-6xl font-black mb-2">{stats.byStatus.SUBMITTED + stats.byStatus.VERIFIED}</div>
                  <div className="text-sm font-black uppercase tracking-wider">Pending</div>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 bg-white translate-x-3 translate-y-3 border-4 border-black"></div>
                <div className="relative bg-cyan-400 border-4 border-black p-8">
                  <div className="text-6xl font-black mb-2">{stats.byStatus.IN_PROGRESS + stats.byStatus.ASSIGNED}</div>
                  <div className="text-sm font-black uppercase tracking-wider">Working</div>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 bg-white translate-x-3 translate-y-3 border-4 border-black"></div>
                <div className="relative bg-lime-400 border-4 border-black p-8">
                  <div className="text-6xl font-black mb-2">{stats.resolved}</div>
                  <div className="text-sm font-black uppercase tracking-wider">Solved</div>
                </div>
              </div>
            </div>

            {/* Top Issues */}
            {topCategories.length > 0 && (
              <div className="relative">
                <div className="absolute inset-0 bg-black translate-x-4 translate-y-4"></div>
                <div className="relative bg-white border-4 border-black p-8">
                  <h3 className="text-2xl font-black uppercase mb-6 flex items-center gap-3">
                    <Zap className="w-8 h-8" strokeWidth={3} />
                    Top Issues
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {topCategories.map((category, index) => (
                      <div key={category} className="relative group">
                        <div className="absolute inset-0 bg-black translate-x-2 translate-y-2"></div>
                        <div className="relative flex items-center gap-4 p-4 bg-yellow-300 border-3 border-black group-hover:translate-x-2 group-hover:translate-y-2 transition-transform">
                          <div className="w-12 h-12 bg-black text-yellow-300 flex items-center justify-center shrink-0">
                            <span className="text-2xl font-black">{index + 1}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-black text-sm mb-1 uppercase">
                              {CATEGORY_LABELS[category]}
                            </div>
                            <div className="text-3xl font-black">
                              {stats.byCategory[category]}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Categories Grid */}
      {stats && (
        <section className="py-16 bg-lime-400 border-b-8 border-black relative overflow-hidden">
          {/* Humayun's Tomb */}
          <div className="absolute top-20 right-20 w-56 h-48 opacity-5">
            <div className="absolute bottom-0 w-full h-24 bg-black"></div>
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-40 h-20 bg-black"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 bg-black rounded-full"></div>
            <div className="absolute bottom-20 left-2 w-6 h-24 bg-black"></div>
            <div className="absolute bottom-20 right-2 w-6 h-24 bg-black"></div>
          </div>
          
          {/* Street Food Cart */}
          <div className="absolute bottom-10 left-20 w-32 h-28 opacity-5">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-4 bg-black"></div>
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-16 bg-black rounded-t-lg"></div>
            <div className="absolute bottom-0 left-4 w-6 h-6 bg-black rounded-full"></div>
            <div className="absolute bottom-0 right-4 w-6 h-6 bg-black rounded-full"></div>
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-4xl sm:text-5xl font-black uppercase inline-block bg-purple-400 px-6 py-3 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-4">
                Report Categories
              </h2>
              <p className="text-xl font-bold mt-4">Choose your issue type</p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {(Object.keys(CATEGORY_LABELS) as ComplaintCategory[]).map((category, index) => {
                const colors = ['bg-red-500', 'bg-yellow-300', 'bg-cyan-400', 'bg-pink-400', 'bg-purple-400', 'bg-orange-400', 'bg-lime-400', 'bg-white'];
                const color = colors[index % colors.length];
                
                return (
                  <Link key={category} href={`/complaints?category=${category}`}>
                    <div className="relative group cursor-pointer">
                      <div className="absolute inset-0 bg-black translate-x-2 translate-y-2"></div>
                      <div className={`relative ${color} border-4 border-black p-5 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform`}>
                        <div className="font-black text-sm mb-3 uppercase">
                          {CATEGORY_LABELS[category]}
                        </div>
                        <div className="flex items-baseline gap-2">
                          <div className="text-4xl font-black">
                            {stats.byCategory[category]}
                          </div>
                          <div className="text-xs font-black uppercase">cases</div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Recent Activity Feed */}
      {recentComplaints.length > 0 && (
        <section className="py-16 bg-white border-b-8 border-black relative overflow-hidden">
          {/* Jama Masjid */}
          <div className="absolute top-10 left-1/4 w-64 h-56 opacity-5">
            <div className="absolute bottom-0 w-full h-28 bg-black"></div>
            <div className="absolute bottom-24 left-4 w-16 h-32 bg-black"></div>
            <div className="absolute bottom-24 right-4 w-16 h-32 bg-black"></div>
            <div className="absolute top-12 left-4 w-12 h-12 bg-black rounded-full"></div>
            <div className="absolute top-12 right-4 w-12 h-12 bg-black rounded-full"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-24 bg-black rounded-t-full"></div>
          </div>
          
          {/* Cycle Rickshaw */}
          <div className="absolute bottom-20 right-1/4 w-36 h-24 opacity-5">
            <div className="absolute bottom-0 left-2 w-8 h-8 bg-black rounded-full"></div>
            <div className="absolute bottom-0 right-2 w-8 h-8 bg-black rounded-full"></div>
            <div className="absolute bottom-8 left-0 w-full h-12 bg-black rounded-t-2xl"></div>
            <div className="absolute bottom-8 left-12 w-2 h-16 bg-black -rotate-45"></div>
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
            <div className="flex items-center justify-between mb-12 flex-wrap gap-4">
              <div>
                <h2 className="text-4xl sm:text-5xl font-black uppercase">
                  Live Activity
                </h2>
                <p className="text-xl font-bold">Recent complaints</p>
              </div>
              <Link href="/complaints">
                <button className="relative px-6 py-3 bg-red-500 text-white font-black uppercase border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all flex items-center gap-2">
                  View All
                  <ArrowRight className="w-5 h-5" strokeWidth={3} />
                </button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {recentComplaints.map((complaint: any, index: any) => {
                const colors = ['bg-yellow-300', 'bg-cyan-400', 'bg-pink-400', 'bg-lime-400'];
                const color = colors[index % colors.length];
                
                return (
                  <Link key={`${complaint.complaintId}-${index}`} href={`/complaints/${complaint.complaintId}`}>
                    <div className="relative group cursor-pointer">
                      <div className="absolute inset-0 bg-black translate-x-3 translate-y-3"></div>
                      <div className={`relative ${color} border-4 border-black p-6 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform`}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="font-mono font-black text-sm bg-black text-white px-2 py-1">
                            {complaint.complaintId}
                          </div>
                          {complaint.status && (
                            <Badge status={complaint.status}>
                              <span className="text-xs font-bold">{complaint.status.replace('_', ' ')}</span>
                            </Badge>
                          )}
                        </div>
                        
                        <div className="font-black text-lg mb-2 line-clamp-1 uppercase">
                          {complaint.title}
                        </div>
                        
                        <p className="text-sm font-bold mb-4 line-clamp-2 leading-relaxed">
                          {complaint.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs flex-wrap gap-2">
                          <div className="flex items-center gap-3">
                            <span className="font-black uppercase bg-black text-white px-2 py-1">
                              {CATEGORY_LABELS[complaint.category as ComplaintCategory]}
                            </span>
                            <div className="flex items-center gap-1 font-bold">
                              <MapPin className="w-3 h-3" strokeWidth={3} />
                              <span className="truncate max-w-[100px]">{complaint.area}</span>
                            </div>
                          </div>
                          <span className="font-black uppercase">
                            {formatRelativeTime(complaint.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Call to Action - Area Explorer */}
      <section className="py-16 bg-purple-400 border-b-8 border-black relative overflow-hidden">
        {/* Decorative Shapes */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-yellow-300 rotate-45 opacity-30"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-pink-400 rounded-full opacity-30"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-5xl sm:text-6xl font-black leading-tight uppercase">
                Explore<br />Your Area
              </h2>
              <p className="text-xl font-bold leading-relaxed">
                See what's happening in your neighborhood. Track local issues and stay informed.
              </p>
              <Link href="/area">
                <button className="relative px-8 py-4 bg-white text-black font-black text-lg uppercase border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all flex items-center gap-2">
                  Explore Areas
                  <ArrowRight className="w-6 h-6" strokeWidth={3} />
                </button>
              </Link>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-black translate-x-3 translate-y-3"></div>
                <div className="relative bg-cyan-400 border-4 border-black p-6 text-center">
                  <Users className="w-10 h-10 mx-auto mb-3" strokeWidth={3} />
                  <div className="text-4xl font-black mb-1">12+</div>
                  <div className="text-sm font-black uppercase">Areas</div>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 bg-black translate-x-3 translate-y-3"></div>
                <div className="relative bg-yellow-300 border-4 border-black p-6 text-center">
                  <MapPin className="w-10 h-10 mx-auto mb-3" strokeWidth={3} />
                  <div className="text-4xl font-black mb-1">270+</div>
                  <div className="text-sm font-black uppercase">Wards</div>
                </div>
              </div>
              
              <div className="col-span-2 relative">
                <div className="absolute inset-0 bg-black translate-x-3 translate-y-3"></div>
                <div className="relative bg-lime-400 border-4 border-black p-6 text-center">
                  <CheckCircle2 className="w-10 h-10 mx-auto mb-3" strokeWidth={3} />
                  <div className="text-4xl font-black mb-1">
                    {stats ? resolutionRate : 0}% Success
                  </div>
                  <div className="text-sm font-black uppercase">Resolution Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-black text-white border-b-8 border-red-500 relative overflow-hidden">
        {/* Geometric Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,0.1) 35px, rgba(255,255,255,0.1) 70px)',
          }}></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 max-w-4xl">
          <h2 className="text-4xl sm:text-5xl font-black mb-6 uppercase">
            Your Voice.<br />Your City.<br />Your Impact.
          </h2>
          <p className="text-xl font-bold mb-10 leading-relaxed text-yellow-300">
            Join thousands of Delhi residents driving real change!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/report">
              <button className="relative px-8 py-4 bg-red-500 text-white font-black text-lg uppercase border-4 border-white shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all flex items-center justify-center gap-2">
                <Rocket className="w-6 h-6" strokeWidth={3} />
                Report Now
                <ArrowRight className="w-6 h-6" strokeWidth={3} />
              </button>
            </Link>
            <Link href="/map">
              <button className="px-8 py-4 bg-yellow-300 text-black font-black text-lg uppercase border-4 border-white shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all">
                View Map
              </button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
