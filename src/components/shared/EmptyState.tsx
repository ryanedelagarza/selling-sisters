import { Link } from 'react-router-dom';
import Button from '../ui/Button';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionPath?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon = '🎨',
  title,
  description,
  actionLabel,
  actionPath,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {/* Icon */}
      <div className="text-5xl mb-4">{icon}</div>

      {/* Title */}
      <h2 className="text-xl font-display text-gray-800 mb-2">{title}</h2>

      {/* Description */}
      <p className="text-gray-600 max-w-sm mb-6">{description}</p>

      {/* Action button */}
      {actionLabel && (actionPath || onAction) && (
        actionPath ? (
          <Link to={actionPath}>
            <Button>{actionLabel}</Button>
          </Link>
        ) : (
          <Button onClick={onAction}>{actionLabel}</Button>
        )
      )}
    </div>
  );
}
