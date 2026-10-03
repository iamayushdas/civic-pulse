import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'white' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  block?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'secondary', size = 'md', block = false, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'btn-brutal',
          variant === 'primary' && 'btn-brutal-primary',
          variant === 'white' && 'btn-brutal-white',
          variant === 'ghost' && 'btn-brutal-ghost',
          size === 'sm' && 'text-xs px-3 py-2',
          size === 'lg' && 'text-base px-6 py-4',
          block && 'btn-brutal-block',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
