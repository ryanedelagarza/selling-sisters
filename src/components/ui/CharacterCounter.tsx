import { clsx } from 'clsx';

interface CharacterCounterProps {
  current: number;
  max: number;
  className?: string;
}

export default function CharacterCounter({ current, max, className }: CharacterCounterProps) {
  const percentage = (current / max) * 100;
  const isNearLimit = percentage >= 80;
  const isAtLimit = percentage >= 100;

  return (
    <span
      className={clsx(
        'text-sm tabular-nums',
        isAtLimit ? 'text-error font-medium' : isNearLimit ? 'text-warning' : 'text-gray-400',
        className
      )}
      aria-live="polite"
    >
      {current}/{max}
    </span>
  );
}
