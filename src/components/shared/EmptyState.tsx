import { Link } from 'react-router-dom';
import Button from '../ui/Button';

// Predefined illustration options for common states
export const EMPTY_STATE_ICONS = {
  empty: '🎨',
  notFound: '🔍',
  error: '😅',
  noProducts: '📦',
  comingSoon: '🚧',
  offline: '📡',
  success: '🎉',
  loading: '⏳',
} as const;

export type EmptyStateIconType = keyof typeof EMPTY_STATE_ICONS;

interface EmptyStateProps {
  /** Emoji icon or key from EMPTY_STATE_ICONS */
  icon?: string | EmptyStateIconType;
  title: string;
  description: string;
  actionLabel?: string;
  actionPath?: string;
  onAction?: () => void;
  /** Additional class names */
  className?: string;
}

export default function EmptyState({
  icon = 'empty',
  title,
  description,
  actionLabel,
  actionPath,
  onAction,
  className = '',
}: EmptyStateProps) {
  // Resolve icon from predefined list or use directly
  const resolvedIcon = icon in EMPTY_STATE_ICONS 
    ? EMPTY_STATE_ICONS[icon as EmptyStateIconType] 
    : icon;

  return (
    <div 
      className={`flex flex-col items-center justify-center py-12 px-4 text-center animate-fade-in ${className}`}
      role="status"
      aria-label={title}
    >
      {/* Icon */}
      <div className="text-5xl mb-4 animate-bounce-gentle" aria-hidden="true">
        {resolvedIcon}
      </div>

      {/* Title */}
      <h2 className="text-xl font-display text-gray-800 mb-2 text-balance">
        {title}
      </h2>

      {/* Description */}
      <p className="text-gray-600 max-w-sm mb-6">
        {description}
      </p>

      {/* Action button */}
      {actionLabel && (actionPath || onAction) && (
        actionPath ? (
          <Link to={actionPath} className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg">
            <Button>{actionLabel}</Button>
          </Link>
        ) : (
          <Button onClick={onAction}>{actionLabel}</Button>
        )
      )}
    </div>
  );
}
