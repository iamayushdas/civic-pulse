'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { ComplaintStatus } from '@/types';

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  status?: ComplaintStatus;
  color?: string;
}

const STATUS_COLORS: Record<ComplaintStatus, string> = {
  SUBMITTED: '#777777',
  VERIFIED: '#3B82F6',
  ASSIGNED: '#8B5CF6',
  IN_PROGRESS: '#F59E0B',
  RESOLVED: '#10B981',
  REOPENED: '#E03A3E',
  REJECTED: '#EF4444',
  DUPLICATE: '#6B7280',
};

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, status, color, children, style, ...props }, ref) => {
    const badgeColor = color || (status && STATUS_COLORS[status]) || '#111111';
    
    return (
      <div
        ref={ref}
        className={cn('badge-status', className)}
        style={{ 
          ...style, 
          color: badgeColor,
          borderColor: badgeColor,
          '--badge-color': badgeColor 
        } as React.CSSProperties}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Badge.displayName = 'Badge';
