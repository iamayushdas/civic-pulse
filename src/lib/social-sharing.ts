import { Complaint, Representative, CATEGORY_LABELS } from '@/types';

const BASE_URL = 'https://delhi-civic-alpha.vercel.app';

export interface SocialShareData {
  text: string;
  xUrl: string;
  instagramUrl: string;
  handles: {
    x: string[];
    instagram: string[];
  };
  imageText: string;
  shortText: string;
}

function getCategoryEmoji(category: string): string {
  const emojis: Record<string, string> = {
    ROADS: '🛣️',
    GARBAGE: '🗑️',
    DRAINAGE: '🚰',
    SEWERAGE: '🚽',
    WATER_SUPPLY: '💧',
    STREETLIGHTS: '💡',
    PARKS: '🌳',
    POLLUTION: '🌫️',
    ILLEGAL_DUMPING: '🚮',
    PUBLIC_TOILETS: '🚻',
    STRAY_ANIMALS: '🐕',
    OTHER: '📋',
  };
  return emojis[category] || '📋';
}

function getSlaDays(status: string): number {
  const slaMap: Record<string, number> = {
    SUBMITTED: 7,
    VERIFIED: 7,
    ASSIGNED: 5,
    IN_PROGRESS: 3,
  };
  return slaMap[status] || 7;
}

function formatDateForDisplay(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function buildTrackingUrl(complaintId: string): string {
  return `${BASE_URL}/complaints/${complaintId}`;
}

export function generateFormalRequestText(
  complaint: Complaint,
  representatives: Representative[]
): SocialShareData {
  const categoryLabel = CATEGORY_LABELS[complaint.category as keyof typeof CATEGORY_LABELS] || complaint.category;
  const categoryEmoji = getCategoryEmoji(complaint.category);
  const slaDays = getSlaDays(complaint.status);
  const dueDate = new Date(complaint.createdAt);
  dueDate.setDate(dueDate.getDate() + slaDays);

  const xHandles: string[] = [];
  const instagramHandles: string[] = [];

  representatives.forEach((rep) => {
    if (rep.x?.handle) xHandles.push(`@${rep.x.handle}`);
    if (rep.instagram?.handle) instagramHandles.push(`@${rep.instagram.handle}`);
  });

  const uniqueXHandles = [...new Set(xHandles)];
  const uniqueIgHandles = [...new Set(instagramHandles)];

  const handleString = [...uniqueXHandles, ...uniqueIgHandles].join(' ');
  const trackUrl = buildTrackingUrl(complaint.complaintId);

  // Short text for X (under 280 chars)
  const shortText = `${categoryEmoji} ${categoryLabel} in ${complaint.area}: ${complaint.title} (${complaint.complaintId}). ${uniqueXHandles.join(' ')} ${trackUrl} #FixMyStreet #DelhiCivicPulse`;

  // Long text for Instagram/clipboard
  const formalText = `🚨 FORMAL CIVIC NOTICE — ${complaint.complaintId}

${categoryEmoji} CATEGORY: ${categoryLabel.toUpperCase()}
📍 LOCATION: ${complaint.area}${complaint.ward ? `, Ward ${complaint.ward}` : ''}${complaint.pincode ? `, ${complaint.pincode}` : ''}
📅 REPORTED: ${formatDateForDisplay(complaint.createdAt)}
⏰ SLA DEADLINE: ${formatDateForDisplay(dueDate)} (${slaDays} days)

📝 ISSUE: ${complaint.title}
${complaint.description.substring(0, 200)}${complaint.description.length > 200 ? '...' : ''}

🔗 TRACK: ${trackUrl}

${handleString}

#FixMyStreet #DelhiCivicPulse #Accountability #${complaint.category.replace(/_/g, '')}`;

  const xText = encodeURIComponent(shortText);
  const xUrl = `https://twitter.com/intent/tweet?text=${xText}`;
  
  const instagramText = encodeURIComponent(
    `🚨 CIVIC PULSE ALERT — ${complaint.complaintId}\n\n` +
    `${categoryEmoji} ${categoryLabel.toUpperCase()}\n` +
    `📍 ${complaint.area}${complaint.ward ? `, Ward ${complaint.ward}` : ''}\n` +
    `⏰ SLA: ${slaDays} days (due ${formatDateForDisplay(dueDate)})\n\n` +
    `${complaint.title}\n\n` +
    `Track: ${trackUrl}\n\n` +
    `${handleString}\n\n` +
    `#FixMyStreet #DelhiCivicPulse #Accountability`
  );
  const instagramUrl = `https://www.instagram.com/stories/share?text=${instagramText}`;

  const imageText = `🚨 CIVIC PULSE — CASE ${complaint.complaintId}
${categoryEmoji} ${categoryLabel.toUpperCase()}
📍 ${complaint.area}${complaint.ward ? `, Ward ${complaint.ward}` : ''}
📅 ${formatDateForDisplay(complaint.createdAt)} | ⏰ ${slaDays} DAYS SLA
🔗 ${trackUrl}
${handleString}
#FixMyStreet #DelhiCivicPulse`;

  return {
    text: formalText,
    xUrl,
    instagramUrl,
    handles: {
      x: uniqueXHandles,
      instagram: uniqueIgHandles,
    },
    imageText,
    shortText,
  };
}

export function generateShortTweetText(
  complaint: Complaint,
  representatives: Representative[]
): string {
  const categoryEmoji = getCategoryEmoji(complaint.category);
  
  const xHandles: string[] = [];
  representatives.forEach((rep) => {
    if (rep.x?.handle) xHandles.push(`@${rep.x.handle}`);
  });
  
  const handleString = [...new Set(xHandles)].join(' ');
  const trackUrl = buildTrackingUrl(complaint.complaintId);
  
  return `${categoryEmoji} ${CATEGORY_LABELS[complaint.category as keyof typeof CATEGORY_LABELS] || complaint.category} in ${complaint.area}: ${complaint.title} (${complaint.complaintId}). ${handleString} ${trackUrl} #FixMyStreet #DelhiCivicPulse`;
}