import { clsx } from 'clsx';

/**
 * Color configuration with pastel backgrounds for selection
 * Following WCAG AA contrast requirements (4.5:1 for normal text)
 */
interface ColorConfig {
  /** Solid color for unselected swatch */
  solid: string;
  /** Pastel background for selected state */
  pastel: string;
  /** Text color for contrast: 'dark' = gray-800, 'light' = white */
  textOnPastel: 'dark' | 'light';
}

const COLOR_CONFIG: Record<string, ColorConfig> = {
  red: { solid: '#EF4444', pastel: '#FECACA', textOnPastel: 'dark' },
  blue: { solid: '#3B82F6', pastel: '#BFDBFE', textOnPastel: 'dark' },
  green: { solid: '#22C55E', pastel: '#BBF7D0', textOnPastel: 'dark' },
  yellow: { solid: '#EAB308', pastel: '#FEF08A', textOnPastel: 'dark' },
  orange: { solid: '#F97316', pastel: '#FED7AA', textOnPastel: 'dark' },
  purple: { solid: '#A855F7', pastel: '#DDD6FE', textOnPastel: 'dark' },
  pink: { solid: '#EC4899', pastel: '#FBCFE8', textOnPastel: 'dark' },
  black: { solid: '#1F2937', pastel: '#4B5563', textOnPastel: 'light' },
  white: { solid: '#FFFFFF', pastel: '#F9FAFB', textOnPastel: 'dark' },
  gold: { solid: '#D4AF37', pastel: '#FDE68A', textOnPastel: 'dark' },
  silver: { solid: '#C0C0C0', pastel: '#E5E7EB', textOnPastel: 'dark' },
  turquoise: { solid: '#40E0D0', pastel: '#99F6E4', textOnPastel: 'dark' },
  coral: { solid: '#FF7F50', pastel: '#FECDD3', textOnPastel: 'dark' },
  navy: { solid: '#1E3A5A', pastel: '#1E3A5A', textOnPastel: 'light' },
  teal: { solid: '#14B8A6', pastel: '#5EEAD4', textOnPastel: 'dark' },
  lime: { solid: '#84CC16', pastel: '#D9F99D', textOnPastel: 'dark' },
  brown: { solid: '#92400E', pastel: '#92400E', textOnPastel: 'light' },
  gray: { solid: '#6B7280', pastel: '#D1D5DB', textOnPastel: 'dark' },
  grey: { solid: '#6B7280', pastel: '#D1D5DB', textOnPastel: 'dark' },
};

// Default fallback
const DEFAULT_CONFIG: ColorConfig = { solid: '#9CA3AF', pastel: '#E5E7EB', textOnPastel: 'dark' };

interface ColorPickerProps {
  colors: string[];
  selected: string[];
  onChange: (colors: string[]) => void;
  maxColors?: number;
  error?: string;
}

export default function ColorPicker({
  colors,
  selected,
  onChange,
  maxColors,
  error,
}: ColorPickerProps) {
  const toggleColor = (color: string) => {
    if (selected.includes(color)) {
      // Remove color
      onChange(selected.filter((c) => c !== color));
    } else {
      // Add color if under limit
      if (!maxColors || selected.length < maxColors) {
        onChange([...selected, color]);
      }
    }
  };

  const getColorConfig = (colorName: string): ColorConfig => {
    return COLOR_CONFIG[colorName.toLowerCase()] || DEFAULT_CONFIG;
  };

  const atLimit = maxColors !== undefined && selected.length >= maxColors;

  return (
    <div className="w-full">
      {/* Selection count display */}
      {maxColors && (
        <div className="mb-3 text-sm text-gray-600">
          <span className="font-medium">{selected.length}</span> of{' '}
          <span className="font-medium">{maxColors}</span> colors selected
          {atLimit && (
            <span className="ml-2 text-amber-600 font-medium">
              (maximum reached)
            </span>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2" role="group" aria-label="Color selection">
        {colors.map((color) => {
          const isSelected = selected.includes(color);
          const config = getColorConfig(color);
          const isDisabled = !isSelected && atLimit;

          return (
            <button
              key={color}
              type="button"
              onClick={() => toggleColor(color)}
              disabled={isDisabled}
              className={clsx(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium capitalize',
                'transition-all duration-200 ease-out',
                'border-2',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                isSelected
                  ? 'border-primary shadow-sm scale-105'
                  : 'border-gray-200 hover:border-gray-400 hover:scale-102 active:scale-100',
                isDisabled && 'opacity-40 cursor-not-allowed hover:scale-100 hover:border-gray-200',
                isSelected
                  ? config.textOnPastel === 'light'
                    ? 'text-white'
                    : 'text-gray-800'
                  : 'text-gray-700 bg-white'
              )}
              style={{
                backgroundColor: isSelected ? config.pastel : undefined,
              }}
              aria-pressed={isSelected}
              aria-label={`${color}${isSelected ? ' (selected)' : ''}${isDisabled ? ' (limit reached)' : ''}`}
              title={isDisabled ? 'Maximum colors selected' : color.charAt(0).toUpperCase() + color.slice(1)}
            >
              {/* Color dot indicator */}
              <span
                className="w-4 h-4 rounded-full border border-gray-300/50 flex-shrink-0"
                style={{ backgroundColor: config.solid }}
                aria-hidden="true"
              />
              {color}
              {isSelected && (
                <svg 
                  className="w-4 h-4 flex-shrink-0" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected colors summary */}
      {selected.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-500">Your picks:</span>
          {selected.map((color) => {
            const config = getColorConfig(color);
            return (
              <span
                key={color}
                className={clsx(
                  'inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm capitalize',
                  config.textOnPastel === 'light' ? 'text-white' : 'text-gray-800'
                )}
                style={{ backgroundColor: config.pastel }}
              >
                <span
                  className="w-3 h-3 rounded-full border border-gray-300/50"
                  style={{ backgroundColor: config.solid }}
                  aria-hidden="true"
                />
                {color}
              </span>
            );
          })}
        </div>
      )}

      {error && (
        <p className="error-message mt-2" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
