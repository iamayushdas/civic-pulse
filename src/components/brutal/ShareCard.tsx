'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { Download } from 'lucide-react';
import { Complaint, Representative } from '@/types';
import { generateFormalRequestText } from '@/lib/social-sharing';

const BASE_URL = 'https://delhi-civic-alpha.vercel.app';

function buildTrackingUrl(complaintId: string): string {
  return `${BASE_URL}/complaints/${complaintId}`;
}

type LayoutMode = 'default' | 'x-card' | 'instagram-post';

interface ShareCardProps {
  complaint: Complaint;
  representatives: Representative[];
  className?: string;
  mode?: LayoutMode;
  onImageGenerated?: (url: string, mode: LayoutMode) => void;
  hideActions?: boolean;
}

// X Card Layout (16:9 - 1200x675)
function XCardLayout({
  complaint,
  shareData,
  categoryLabel,
}: {
  complaint: Complaint;
  shareData: ReturnType<typeof generateFormalRequestText>;
  categoryLabel: string;
}) {
  return (
    <div
      className="w-[1200px] h-[675px] border-4 border-black bg-white p-8 font-mono relative"
      style={{ fontFamily: 'monospace', fontSize: '24px' }}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div>
            <div className="text-black font-black tracking-widest text-sm">DELHI CIVIC PULSE</div>
            <div className="text-red-600 font-black tracking-widest text-xs">FORMAL NOTICE</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-black font-black text-3xl">CASE {complaint.complaintId}</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-2 gap-6 h-[calc(100%-120px)]">
        {/* Left Column */}
        <div className="flex flex-col justify-between">
          <div className="space-y-4">
            <div className="bg-black text-yellow-300 p-4 border-2 border-black">
              <div className="text-xs tracking-wider mb-1">CATEGORY</div>
              <div className="font-black text-lg">{categoryLabel.toUpperCase()}</div>
            </div>
            <div className="bg-red-500 text-white p-4 border-2 border-black">
              <div className="text-xs tracking-wider mb-1">PRIORITY</div>
              <div className="font-black text-lg">{complaint.priority}</div>
            </div>
          </div>
          <div className="bg-civic-bg border-2 border-black p-4">
            <div className="text-xs tracking-wider mb-1 text-black/60">LOCATION</div>
            <div className="font-bold leading-snug">
              {complaint.area}
              {complaint.ward && <div>Ward: {complaint.ward}</div>}
              {complaint.pincode && <div>{complaint.pincode}</div>}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col justify-between">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-yellow-300 border-2 border-black p-3">
                <div className="text-xs tracking-wider mb-1">REPORTED</div>
                <div className="font-bold text-sm">{new Date(complaint.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
              </div>
              <div className="bg-lime-400 border-2 border-black p-3">
                <div className="text-xs tracking-wider mb-1">SLA DUE</div>
                <div className="font-bold text-sm">
                  {(() => {
                    const due = new Date(complaint.createdAt);
                    due.setDate(due.getDate() + 7);
                    return due.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
                  })()}
                </div>
              </div>
            </div>
            <div className="border-t-2 border-black pt-3">
              <div className="text-xs tracking-wider mb-1 text-black/60">ISSUE</div>
              <div className="font-bold text-lg leading-snug">{complaint.title}</div>
            </div>
          </div>
          <div className="bg-black text-white p-4 border-2 border-black text-center">
            <div className="text-xs tracking-wider mb-1">TRACK THIS CASE</div>
            <div className="font-bold text-sm break-all">{buildTrackingUrl(complaint.complaintId)}</div>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Handles */}
      <div className="absolute bottom-6 left-8 right-8 flex flex-wrap gap-2">
        {shareData.handles.x.slice(0, 3).map((handle, i) => (
          <span key={`x-${i}`} className="bg-blue-500 text-white px-3 py-1 border-2 border-black text-sm">
            {handle}
          </span>
        ))}
        {shareData.handles.instagram.slice(0, 2).map((handle, i) => (
          <span key={`ig-${i}`} className="bg-pink-500 text-white px-3 py-1 border-2 border-black text-sm">
            {handle}
          </span>
        ))}
      </div>
    </div>
  );
}

// Instagram Post Layout (1:1 - 1080x1080)
function InstagramPostLayout({
  complaint,
  shareData,
  categoryLabel,
}: {
  complaint: Complaint;
  shareData: ReturnType<typeof generateFormalRequestText>;
  categoryLabel: string;
}) {
  return (
    <div
      className="w-[1080px] h-[1080px] border-4 border-black bg-white p-10 font-mono relative flex flex-col"
      style={{ fontFamily: 'monospace', fontSize: '28px' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div>
            <div className="text-black font-black tracking-widest text-2xl">DELHI CIVIC PULSE</div>
            <div className="text-red-600 font-black tracking-widest text-lg">FORMAL NOTICE</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-black font-black text-5xl">CASE {complaint.complaintId}</div>
        </div>
      </div>

      {/* Category Badge */}
      <div className="flex gap-6 mb-8">
        <div className="bg-black text-yellow-300 p-6 border-2 border-black flex-1 text-center">
          <div className="text-lg tracking-wider mb-2">CATEGORY</div>
          <div className="font-black text-3xl">{categoryLabel.toUpperCase()}</div>
        </div>
        <div className="bg-red-500 text-white p-6 border-2 border-black flex-1 text-center">
          <div className="text-lg tracking-wider mb-2">PRIORITY</div>
          <div className="font-black text-3xl">{complaint.priority}</div>
        </div>
      </div>

      {/* Location & Timeline */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-civic-bg border-2 border-black p-6 col-span-2">
          <div className="text-lg tracking-wider mb-2 text-black/60">LOCATION</div>
          <div className="font-bold text-2xl leading-snug">
            {complaint.area}
            {complaint.ward && <div>Ward: {complaint.ward}</div>}
            {complaint.pincode && <div>{complaint.pincode}</div>}
          </div>
        </div>
        <div className="bg-yellow-300 border-2 border-black p-5 text-center">
          <div className="text-lg tracking-wider mb-2">REPORTED</div>
          <div className="font-bold text-2xl">{new Date(complaint.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
        </div>
        <div className="bg-lime-400 border-2 border-black p-5 text-center">
          <div className="text-lg tracking-wider mb-2">SLA DUE</div>
          <div className="font-bold text-2xl">
            {(() => {
              const due = new Date(complaint.createdAt);
              due.setDate(due.getDate() + 7);
              return due.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
            })()}
          </div>
        </div>
      </div>

      {/* Issue */}
      <div className="border-t-2 border-black pt-6 mb-6 flex-1 overflow-hidden">
        <div className="text-lg tracking-wider mb-3 text-black/60">ISSUE</div>
        <div className="font-bold text-3xl leading-snug">{complaint.title}</div>
        <div className="mt-4 text-xl leading-relaxed text-black/80">
          {complaint.description.substring(0, 200)}
          {complaint.description.length > 200 ? '…' : ''}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t-2 border-black pt-6">
        <div className="bg-black text-white p-5 border-2 border-black text-center mb-4">
          <div className="text-lg tracking-wider mb-2">TRACK THIS CASE</div>
          <div className="font-bold text-lg break-all">{buildTrackingUrl(complaint.complaintId)}</div>
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
          {shareData.handles.x.slice(0, 4).map((handle, i) => (
            <span key={`x-${i}`} className="bg-blue-500 text-white px-4 py-2 border-2 border-black text-lg">
              {handle}
            </span>
          ))}
          {shareData.handles.instagram.slice(0, 3).map((handle, i) => (
            <span key={`ig-${i}`} className="bg-pink-500 text-white px-4 py-2 border-2 border-black text-lg">
              {handle}
            </span>
          ))}
        </div>
        <div className="mt-4 text-center text-lg text-black/60 tracking-wider">
          #FixMyStreet #DelhiCivicPulse #Accountability
        </div>
      </div>
    </div>
  );
}

// Default Layout (existing responsive card)
function DefaultLayout({
  complaint,
  shareData,
  categoryLabel,
}: {
  complaint: Complaint;
  shareData: ReturnType<typeof generateFormalRequestText>;
  categoryLabel: string;
}) {
  return (
    <div
      className="w-full max-w-sm sm:max-w-md mx-auto border-4 border-black shadow-[8px_8px_0_0_#000] sm:shadow-[10px_10px_0_0_#000] bg-white p-4 sm:p-6 font-mono"
      style={{ fontFamily: 'monospace' }}
    >
      {/* Header */}
      <div className="border-b-4 border-black pb-4 mb-4">
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <span className="text-[10px] sm:text-xs tracking-widest text-black/60">DELHI CIVIC PULSE</span>
          <span className="text-[10px] sm:text-xs tracking-widest text-red-600">FORMAL NOTICE</span>
        </div>
        <div className="text-xl sm:text-2xl font-black tracking-tight text-black break-all">
          CASE {complaint.complaintId}
        </div>
      </div>

      {/* Category & Priority */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4">
        <div className="bg-black text-yellow-300 p-2 sm:p-3 border-2 border-black">
          <div className="text-[10px] sm:text-xs tracking-wider mb-1">CATEGORY</div>
          <div className="font-black text-xs sm:text-sm">{categoryLabel.toUpperCase()}</div>
        </div>
        <div className="bg-red-500 text-white p-2 sm:p-3 border-2 border-black">
          <div className="text-[10px] sm:text-xs tracking-wider mb-1">PRIORITY</div>
          <div className="font-black text-xs sm:text-sm">{complaint.priority}</div>
        </div>
      </div>

      {/* Location */}
      <div className="bg-civic-bg border-2 border-black p-2 sm:p-3 mb-4">
        <div className="text-[10px] sm:text-xs tracking-wider mb-1 text-black/60">LOCATION</div>
        <div className="font-bold text-xs sm:text-sm leading-snug break-words">
          {complaint.area}
          {complaint.ward && <span className="block">Ward: {complaint.ward}</span>}
          {complaint.pincode && <span className="block">{complaint.pincode}</span>}
        </div>
      </div>

      {/* Timeline */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 text-xs sm:text-sm">
        <div className="bg-yellow-300 border-2 border-black p-2 sm:p-3">
          <div className="text-[9px] sm:text-xs tracking-wider mb-1">REPORTED</div>
          <div className="font-bold">{new Date(complaint.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
        </div>
        <div className="bg-lime-400 border-2 border-black p-2 sm:p-3">
          <div className="text-[9px] sm:text-xs tracking-wider mb-1">SLA DUE</div>
          <div className="font-bold">
            {(() => {
              const due = new Date(complaint.createdAt);
              due.setDate(due.getDate() + 7);
              return due.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
            })()}
          </div>
        </div>
      </div>

      {/* Issue Title */}
      <div className="border-t-2 border-black pt-3 sm:pt-4 mb-4">
        <div className="text-[9px] sm:text-xs tracking-wider mb-1 text-black/60">ISSUE</div>
        <div className="font-bold text-sm sm:text-base leading-snug break-words">{complaint.title}</div>
      </div>

      {/* Description */}
      <div className="border-t-2 border-black pt-3 sm:pt-4 mb-4">
        <div className="text-[9px] sm:text-xs tracking-wider mb-1 text-black/60">DESCRIPTION</div>
        <div className="text-xs sm:text-sm leading-relaxed text-black/80 break-words">
          {complaint.description.substring(0, 150)}
          {complaint.description.length > 150 ? '…' : ''}
        </div>
      </div>

      {/* Tracking Link */}
      <div className="bg-black text-white p-2 sm:p-3 border-2 border-black mb-4 text-center">
        <div className="text-[9px] sm:text-xs tracking-wider mb-1">TRACK THIS CASE</div>
        <div className="font-bold text-xs sm:text-sm break-all">{buildTrackingUrl(complaint.complaintId)}</div>
      </div>

      {/* Tagged Authorities */}
      {shareData.handles.x.length > 0 || shareData.handles.instagram.length > 0 ? (
        <div className="border-t-2 border-black pt-3 sm:pt-4">
          <div className="text-[9px] sm:text-xs tracking-wider mb-2 text-black/60">TAGGED AUTHORITIES</div>
          <div className="flex flex-wrap gap-1.5 text-[9px] sm:text-xs">
            {shareData.handles.x.map((handle, i) => (
              <span key={`x-${i}`} className="bg-blue-500 text-white px-2 py-1 border-2 border-black whitespace-nowrap">
                {handle}
              </span>
            ))}
            {shareData.handles.instagram.map((handle, i) => (
              <span key={`ig-${i}`} className="bg-pink-500 text-white px-2 py-1 border-2 border-black whitespace-nowrap">
                {handle}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="border-t-2 border-black pt-3 sm:pt-4 text-center">
          <div className="text-[10px] sm:text-xs text-black/60">NO SOCIAL HANDLES AVAILABLE</div>
        </div>
      )}

      {/* Hashtags */}
      <div className="mt-3 sm:mt-4 text-center text-[9px] sm:text-xs text-black/60 tracking-wider">
        #FixMyStreet #DelhiCivicPulse #Accountability
      </div>
    </div>
  );
}

// Responsive wrapper that scales fixed-size cards (X 1200x675, IG 1080x1080) to fit the viewport
function ResponsiveScaleCard({
  children,
  captureRef,
}: {
  children: React.ReactNode;
  captureRef: React.RefObject<HTMLDivElement | null>;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [scaledHeight, setScaledHeight] = useState<number | null>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const card = el.firstElementChild?.firstElementChild as HTMLElement | null;
    if (!card) return;

    const update = () => {
      const maxW = el.clientWidth - 32;
      const maxH = window.innerHeight * 0.7;
      const next = Math.min(1, maxW / card.scrollWidth, maxH / card.scrollHeight);
      setScale(next);
      setScaledHeight(card.scrollHeight * next);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(card);
    window.addEventListener('resize', update);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="w-full flex items-start justify-center overflow-hidden"
      style={{ height: scaledHeight ? `${scaledHeight}px` : undefined }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center top',
          width: 'fit-content',
        }}
      >
        <div ref={captureRef}>{children}</div>
      </div>
    </div>
  );
}

export default function ShareCard({
  complaint,
  representatives,
  className = '',
  mode = 'default',
  onImageGenerated,
  hideActions = false,
}: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const shareData = generateFormalRequestText(complaint, representatives);
  const categoryLabel = complaint.category.replace(/_/g, ' ');

  const generateImage = useCallback(async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    
    try {
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        width: cardRef.current.scrollWidth,
        height: cardRef.current.scrollHeight,
      });
      setImageUrl(dataUrl);
      onImageGenerated?.(dataUrl, mode);
    } catch (error) {
      console.error('Failed to generate image:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [mode, onImageGenerated]);

  useEffect(() => {
    generateImage();
  }, [complaint, generateImage]);

  const downloadImage = async () => {
    if (!imageUrl) return;
    const filename = `civic-pulse-${complaint.complaintId}-${mode}.png`;
    const blob = await fetch(imageUrl).then(response => response.blob());
    const file = new File([blob], filename, { type: 'image/png' });

    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], title: filename });
      return;
    }

    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  };

  const shareToX = () => {
    window.open(shareData.xUrl, '_blank', 'width=600,height=400');
  };

  const shareToInstagram = () => {
    if (navigator.share && navigator.canShare({ text: shareData.text })) {
      navigator.share({ text: shareData.text });
    } else {
      window.open(shareData.instagramUrl, '_blank', 'width=600,height=400');
    }
  };

  const copyText = async () => {
    await navigator.clipboard.writeText(shareData.shortText);
    alert('Copied short text for X!');
  };

  // Render appropriate layout based on mode
  const renderLayout = () => {
    const content = (
      <>
        {mode === 'x-card' && (
          <XCardLayout complaint={complaint} shareData={shareData} categoryLabel={categoryLabel} />
        )}
        {mode === 'instagram-post' && (
          <InstagramPostLayout complaint={complaint} shareData={shareData} categoryLabel={categoryLabel} />
        )}
        {mode === 'default' && (
          <DefaultLayout complaint={complaint} shareData={shareData} categoryLabel={categoryLabel} />
        )}
      </>
    );
    if (mode === 'default') return content;
    return <ResponsiveScaleCard captureRef={cardRef}>{content}</ResponsiveScaleCard>;
  };

  return (
    <div className={`relative ${className}`}>
      {onImageGenerated && imageUrl && (
        <button
          type="button"
          onClick={downloadImage}
          disabled={isGenerating}
          title="Download image"
          className="absolute top-3 right-3 z-10 flex items-center justify-center w-10 h-10 bg-civic-black text-civic-white border-2 border-civic-black shadow-[3px_3px_0_0_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0_0_#000] transition-all disabled:opacity-50"
        >
          {isGenerating ? (
            <div className="w-4 h-4 border-2 border-civic-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Download size={18} />
          )}
        </button>
      )}
      <div
        ref={cardRef}
        className={mode === 'default' ? 'w-full max-w-sm sm:max-w-md mx-auto' : 'mx-auto'}
      >
        {renderLayout()}
      </div>

      {mode === 'default' && !hideActions && (
        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center w-full">
          <button
            onClick={shareToX}
            className="bg-black text-white px-4 sm:px-6 py-3 border-3 sm:border-4 border-black shadow-[3px_3px_0_0_#000] sm:shadow-[4px_4px_0_0_#000] font-bold text-xs sm:text-sm hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0_0_#000] sm:hover:shadow-[6px_6px_0_0_#000] transition-all w-full sm:w-auto"
          >
            POST TO X
          </button>
          <button
            onClick={shareToInstagram}
            className="bg-pink-500 text-white px-4 sm:px-6 py-3 border-3 sm:border-4 border-black shadow-[3px_3px_0_0_#000] sm:shadow-[4px_4px_0_0_#000] font-bold text-xs sm:text-sm hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0_0_#000] sm:hover:shadow-[6px_6px_0_0_#000] transition-all w-full sm:w-auto"
          >
            SHARE TO IG STORY
          </button>
          <button
            type="button"
            onClick={downloadImage}
            disabled={isGenerating || !imageUrl}
            className="bg-yellow-300 text-black px-4 sm:px-6 py-3 border-3 sm:border-4 border-black shadow-[3px_3px_0_0_#000] sm:shadow-[4px_4px_0_0_#000] font-bold text-xs sm:text-sm hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0_0_#000] sm:hover:shadow-[6px_6px_0_0_#000] transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
          >
            {isGenerating ? 'GENERATING…' : 'DOWNLOAD IMAGE'}
          </button>
          <button
            onClick={copyText}
            className="bg-white text-black px-4 sm:px-6 py-3 border-3 sm:border-4 border-black shadow-[3px_3px_0_0_#000] sm:shadow-[4px_4px_0_0_#000] font-bold text-xs sm:text-sm hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0_0_#000] sm:hover:shadow-[6px_6px_0_0_#000] transition-all w-full sm:w-auto"
          >
            COPY TEXT
          </button>
        </div>
      )}
    </div>
  );
}