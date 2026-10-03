'use client';

import dynamic from 'next/dynamic';

const ComplaintLocationMap = dynamic(() => import('@/components/map/ComplaintLocationMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-civic-bg border-2 border-civic-black">
      <div className="inline-block w-8 h-8 border-4 border-civic-black border-t-civic-accent rounded-full animate-spin"></div>
    </div>
  ),
});

export default ComplaintLocationMap;
