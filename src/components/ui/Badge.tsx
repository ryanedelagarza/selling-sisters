import { clsx } from 'clsx';

export interface BadgeProps {
  variant?: 'default' | 'sold-out' | 'new' | 'success' | 'warning' | 'error';
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ variant = 'default', children, className }: BadgeProps) {
  const variantStyles = {
    default: 'bg-gray-100 text-gray-600',
    'sold-out': 'bg-gray-200 text-gray-700',
    new: 'bg-accent-light text-green-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    error: 'bg-red-100 text-red-700',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
