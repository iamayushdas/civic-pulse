'use client';

import { useState, useCallback } from 'react';
import { ChevronDown, ChevronUp, Share2, Download, X, Camera, Image as ImageIcon } from 'lucide-react';
import ShareCard from './ShareCard';
import { Complaint, Representative } from '@/types';

type LayoutMode = 'default' | 'x-card' | 'instagram-post';

interface CollapsibleShareCardProps {
  complaint: Complaint;
  representatives: Representative[];
}

const MODE_CONFIG: Record<LayoutMode, { label: string; desc: string; icon: React.ReactNode; size: string }> = {
  default: {
    label: 'RESPONSIVE CARD',
    desc: 'Adaptive layout for web preview',
    icon: <ImageIcon size={18} />,
    size: 'Variable',
  },
  'x-card': {
    label: 'X/TWITTER CARD',
    desc: '16:9 (1200×675) for tweet attachment',
    icon: <X size={18} />,
    size: '1200×675',
  },
  'instagram-post': {
    label: 'INSTAGRAM POST',
    desc: '1:1 (1080×1080) for feed post',
    icon: <Camera size={18} />,
    size: '1080×1080',
  },
};

export default function CollapsibleShareCard({
  complaint,
  representatives,
}: CollapsibleShareCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMode, setActiveMode] = useState<LayoutMode>('default');
  const [generatedImages, setGeneratedImages] = useState<Record<LayoutMode, string>>({
    default: '',
    'x-card': '',
    'instagram-post': '',
  });
  const [generatingMode, setGeneratingMode] = useState<LayoutMode | null>(null);

  const handleImageGenerated = useCallback((url: string, mode: LayoutMode) => {
    setGeneratedImages(prev => ({ ...prev, [mode]: url }));
    if (generatingMode === mode) {
      setGeneratingMode(null);
    }
  }, [generatingMode]);

  const downloadImage = (mode: LayoutMode) => {
    const url = generatedImages[mode];
    if (!url) return;
    const link = document.createElement('a');
    link.href = url;
    link.download = `civic-pulse-${complaint.complaintId}-${mode}.png`;
    link.click();
  };

  const triggerGenerate = (mode: LayoutMode) => {
    setActiveMode(mode);
    setGeneratingMode(mode);
  };

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-4 p-4 bg-civic-bg border-2 border-civic-black hover:border-civic-accent hover:bg-civic-black/5 transition-all"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <Share2 size={20} className="text-civic-accent" />
          <div>
            <div className="font-bold label-mono">AMPLIFY THIS COMPLAINT</div>
            <div className="text-xs text-civic-muted">
              Generate platform-optimized images for X & Instagram
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs label-mono text-civic-muted">
            {isOpen ? 'COLLAPSE' : 'EXPAND'}
          </span>
          {isOpen ? (
            <ChevronUp size={18} className="text-civic-black" />
          ) : (
            <ChevronDown size={18} className="text-civic-black" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="mt-4 animate-slide-down">
          {/* Mode Selector Tabs */}
          <div className="mb-4 flex gap-2 border-b-2 border-civic-black/20">
            {(Object.keys(MODE_CONFIG) as LayoutMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => triggerGenerate(mode)}
                className={`flex items-center gap-2 px-4 py-2 border-2 border-civic-black text-sm font-bold transition-all ${
                  activeMode === mode
                    ? 'bg-civic-black text-civic-white shadow-[4px_4px_0_0_#000]'
                    : 'bg-civic-white text-civic-black hover:bg-civic-bg'
                }`}
              >
                {MODE_CONFIG[mode].icon}
                <span className="hidden sm:inline">{MODE_CONFIG[mode].label}</span>
              </button>
            ))}
          </div>

          {/* Mode Description */}
          <div className="mb-4 p-3 bg-civic-bg border-2 border-civic-black text-sm">
            <div className="font-bold label-mono mb-1">{MODE_CONFIG[activeMode].label} — {MODE_CONFIG[activeMode].size}</div>
            <div className="text-civic-muted">{MODE_CONFIG[activeMode].desc}</div>
          </div>

          {/* Active Layout Preview */}
          <div className="mb-4 overflow-x-auto">
            <ShareCard
              complaint={complaint}
              representatives={representatives}
              mode={activeMode}
              hideActions
              onImageGenerated={handleImageGenerated}
            />
          </div>

          {/* Action Buttons (only for default mode) */}
          {activeMode === 'default' && (
            <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center w-full">
              <button
                onClick={() => window.open(
                  `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    generateFormalRequestText(complaint, representatives).shortText
                  )}`,
                  '_blank',
                  'width=600,height=400'
                )}
                className="bg-black text-white px-4 sm:px-6 py-3 border-3 sm:border-4 border-black shadow-[3px_3px_0_0_#000] sm:shadow-[4px_4px_0_0_#000] font-bold text-xs sm:text-sm hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0_0_#000] sm:hover:shadow-[6px_6px_0_0_#000] transition-all w-full sm:w-auto"
              >
                <X size={16} className="inline-block mr-1" />
                POST TO X
              </button>
              <button
                onClick={() => {
                  if (navigator.share && navigator.canShare({ 
                    text: generateFormalRequestText(complaint, representatives).text 
                  })) {
                    navigator.share({ text: generateFormalRequestText(complaint, representatives).text });
                  } else {
                    window.open(
                      `https://www.instagram.com/stories/share?text=${encodeURIComponent(
                        generateFormalRequestText(complaint, representatives).text
                      )}`,
                      '_blank',
                      'width=600,height=400'
                    );
                  }
                }}
                className="bg-pink-500 text-white px-4 sm:px-6 py-3 border-3 sm:border-4 border-black shadow-[3px_3px_0_0_#000] sm:shadow-[4px_4px_0_0_#000] font-bold text-xs sm:text-sm hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0_0_#000] sm:hover:shadow-[6px_6px_0_0_#000] transition-all w-full sm:w-auto"
              >
                <Camera size={16} className="inline-block mr-1" />
                SHARE TO IG STORY
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Import here to avoid circular dependency
import { generateFormalRequestText } from '@/lib/social-sharing';