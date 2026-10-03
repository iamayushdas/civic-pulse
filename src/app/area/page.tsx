'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, MapPin, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/brutal/Card';
import { Button } from '@/components/brutal/Button';
import { Input } from '@/components/brutal/Input';
import { Badge } from '@/components/brutal/Badge';
import { CATEGORY_LABELS, ComplaintCategory } from '@/types';
import { formatRelativeTime } from '@/lib/utils';

export default function AreaPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [areaData, setAreaData] = useState<any>(null);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const popularAreas = [
    'Sangam Vihar',
    'Connaught Place',
    'Saket',
    'Dwarka',
    'Rohini',
    'Vasant Vihar',
    'Karol Bagh',
    'Lajpat Nagar',
    'Chandni Chowk',
  ];

  const searchArea = async (query: string) => {
    setSelectedArea(query);
    setLoading(true);

    const isPincode = /^\d{6}$/.test(query.trim());
    const searchParam = isPincode ? `pincode=${encodeURIComponent(query.trim())}` : `area=${encodeURIComponent(query.trim())}`;

    try {
      const response = await fetch(`/api/complaints?${searchParam}&limit=20`);
      const data = await response.json();
      setComplaints(data.complaints || []);

      // Calculate area stats
      const stats = {
        total: data.complaints?.length || 0,
        open: data.complaints?.filter((c: any) => c.status !== 'RESOLVED').length || 0,
        resolved: data.complaints?.filter((c: any) => c.status === 'RESOLVED').length || 0,
      };

      const categoryCount: Record<string, number> = {};
      data.complaints?.forEach((c: any) => {
        categoryCount[c.category] = (categoryCount[c.category] || 0) + 1;
      });

      const topCategory = Object.keys(categoryCount).reduce(
        (a, b) => (categoryCount[a] > categoryCount[b] ? a : b),
        'WATER_SUPPLY'
      );

      setAreaData({
        name: query,
        ...stats,
        topCategory,
        categoryCount,
      });
    } catch (error) {
      console.error('Failed to fetch area data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      searchArea(searchQuery.trim());
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <div className="mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-5xl font-bold mb-4">YOUR AREA</h1>
        <p className="text-lg text-civic-muted">
          Check civic issues reported in your locality
        </p>
      </div>

      {/* Search */}
      <Card className="mb-8">
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by area or pincode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button variant="primary" onClick={handleSearch}>
              <Search size={20} />
              SEARCH
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Popular Areas */}
      {!selectedArea && (
        <div className="mb-12">
          <h2 className="text-xl sm:text-2xl font-bold mb-6 label-editorial">
            POPULAR AREAS
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {popularAreas.map((area) => (
              <button
                key={area}
                onClick={() => searchArea(area)}
                className="card-brutal p-4 sm:p-6 text-left hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-sm transition-all"
              >
                <MapPin size={24} className="mb-2" />
                <div className="font-bold">{area}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Area Dashboard */}
      {loading && (
        <div className="text-center py-12">
          <div className="text-xl font-bold text-civic-muted">LOADING...</div>
        </div>
      )}

      {!loading && selectedArea && areaData && (
        <>
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-2">
                  {areaData.name.toUpperCase()}
                </h2>
                <div className="label-mono">DELHI</div>
              </div>
              <Button variant="ghost" onClick={() => setSelectedArea(null)}>
                CHANGE AREA
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="text-center py-6">
                  <div className="text-4xl sm:text-5xl font-bold text-civic-black mb-2">
                    {areaData.total}
                  </div>
                  <div className="label-mono">TOTAL CASES</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="text-center py-6">
                  <div className="text-4xl sm:text-5xl font-bold text-civic-accent mb-2">
                    {areaData.open}
                  </div>
                  <div className="label-mono">ACTIVE</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="text-center py-6">
                  <div className="text-4xl sm:text-5xl font-bold text-green-600 mb-2">
                    {areaData.resolved}
                  </div>
                  <div className="label-mono">RESOLVED</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="text-center py-6">
                  <TrendingUp size={32} className="mx-auto mb-2 text-civic-muted" />
                  <div className="label-mono">MOST REPORTED</div>
                  <div className="font-bold text-sm mt-1">
                    {CATEGORY_LABELS[areaData.topCategory as ComplaintCategory]}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recent Complaints */}
          {complaints.length > 0 && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-6 label-editorial">
                RECENT COMPLAINTS
              </h2>
              <div className="space-y-4">
                {complaints.map((complaint) => (
                  <Link key={complaint.complaintId} href={`/complaints/${complaint.complaintId}`}>
                    <Card className="hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-sm transition-all cursor-pointer">
                      <CardContent>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                          <div className="font-mono font-bold text-sm">
                            {complaint.complaintId}
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-sm mb-1">
                              {CATEGORY_LABELS[complaint.category as ComplaintCategory]}
                            </div>
                            <div className="text-sm text-civic-muted truncate">
                              {complaint.title}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge status={complaint.status}>
                              {complaint.status.replace('_', ' ')}
                            </Badge>
                            <div className="label-mono whitespace-nowrap">
                              {formatRelativeTime(complaint.createdAt)}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {complaints.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-xl font-bold text-civic-muted mb-4">
                  NO COMPLAINTS FOUND
                </div>
                <p className="text-civic-muted mb-6">
                  No civic issues have been reported in this area yet.
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
