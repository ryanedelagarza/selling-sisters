import { clsx } from 'clsx';

/**
 * Color name to pastel background and text color mapping
 * Following WCAG AA contrast requirements (4.5:1 for normal text)
 */
const COLOR_STYLES: Record<string, { bg: string; text: 'dark' | 'light' }> = {
  red: { bg: '#FECACA', text: 'dark' },
  blue: { bg: '#BFDBFE', text: 'dark' },
  green: { bg: '#BBF7D0', text: 'dark' },
  white: { bg: '#F9FAFB', text: 'dark' },
  black: { bg: '#4B5563', text: 'light' },
  yellow: { bg: '#FEF08A', text: 'dark' },
  orange: { bg: '#FED7AA', text: 'dark' },
  purple: { bg: '#DDD6FE', text: 'dark' },
  pink: { bg: '#FBCFE8', text: 'dark' },
  gold: { bg: '#FDE68A', text: 'dark' },
  silver: { bg: '#E5E7EB', text: 'dark' },
  turquoise: { bg: '#99F6E4', text: 'dark' },
  coral: { bg: '#FECDD3', text: 'dark' },
  navy: { bg: '#1E3A5A', text: 'light' },
  teal: { bg: '#5EEAD4', text: 'dark' },
  lime: { bg: '#D9F99D', text: 'dark' },
  brown: { bg: '#92400E', text: 'light' },
  gray: { bg: '#D1D5DB', text: 'dark' },
  grey: { bg: '#D1D5DB', text: 'dark' },
};

// Default fallback for unknown colors
const DEFAULT_STYLE = { bg: '#E5E7EB', text: 'dark' as const };

interface ColorDisplayProps {
  /** Array of color names to display */
  colors: string[];
  /** Optional maximum number of colors to show (shows "+X more" for overflow) */
  maxDisplay?: number;
  /** Optional label for the color list */
  label?: string;
  /** Size variant */
  size?: 'sm' | 'md';
}

/**
 * Non-interactive color display component for product detail pages.
 * Shows color options as visually appealing pastel badges.
 * 
 * For interactive color selection, use ColorPicker instead.
 */
export default function ColorDisplay({
  colors,
  maxDisplay,
  label,
  size = 'md',
}: ColorDisplayProps) {
  const displayColors = maxDisplay ? colors.slice(0, maxDisplay) : colors;
  const remainingCount = maxDisplay ? Math.max(0, colors.length - maxDisplay) : 0;

  const getColorStyle = (colorName: string) => {
    return COLOR_STYLES[colorName.toLowerCase()] || DEFAULT_STYLE;
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <div className="w-full">
      {label && (
        <span className="text-sm font-medium text-gray-500 block mb-2">
          {label}
        </span>
      )}
      
      <div 
        className="flex flex-wrap gap-2" 
        role="list" 
        aria-label={label || 'Available colors'}
      >
        {displayColors.map((color) => {
          const style = getColorStyle(color);
          
          return (
            <span
              key={color}
              role="listitem"
              className={clsx(
                'inline-flex items-center rounded-full font-medium capitalize',
                'transition-transform duration-150 hover:scale-105',
                'border border-gray-200/50',
                sizeClasses[size],
                style.text === 'light' ? 'text-white' : 'text-gray-800'
              )}
              style={{ backgroundColor: style.bg }}
            >
              {color}
            </span>
          );
        })}
        
        {remainingCount > 0 && (
          <span
            className={clsx(
              'inline-flex items-center rounded-full font-medium',
              'bg-gray-100 text-gray-600',
              sizeClasses[size]
            )}
          >
            +{remainingCount} more
          </span>
        )}
      </div>
    </div>
  );
}
