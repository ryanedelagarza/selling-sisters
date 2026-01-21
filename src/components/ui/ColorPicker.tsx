import { clsx } from 'clsx';

// Color name to hex mapping for visual display
const COLOR_MAP: Record<string, string> = {
  red: '#EF4444',
  blue: '#3B82F6',
  green: '#22C55E',
  yellow: '#EAB308',
  orange: '#F97316',
  purple: '#A855F7',
  pink: '#EC4899',
  black: '#1F2937',
  white: '#FFFFFF',
  gold: '#D4AF37',
  silver: '#C0C0C0',
  turquoise: '#40E0D0',
  coral: '#FF7F50',
  navy: '#1E3A5A',
  teal: '#14B8A6',
  lime: '#84CC16',
  brown: '#92400E',
  gray: '#6B7280',
  grey: '#6B7280',
};

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

  const getColorHex = (colorName: string): string => {
    return COLOR_MAP[colorName.toLowerCase()] || '#9CA3AF';
  };

  const isLightColor = (hex: string): boolean => {
    // Convert hex to RGB and check luminance
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.7;
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-3" role="group" aria-label="Color selection">
        {colors.map((color) => {
          const isSelected = selected.includes(color);
          const hex = getColorHex(color);
          const isLight = isLightColor(hex);
          const isDisabled = !isSelected && maxColors !== undefined && selected.length >= maxColors;

          return (
            <button
              key={color}
              type="button"
              onClick={() => toggleColor(color)}
              disabled={isDisabled}
              className={clsx(
                'relative w-10 h-10 rounded-full border-2 transition-all duration-200',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                isSelected
                  ? 'border-primary ring-2 ring-primary ring-offset-2 scale-110'
                  : 'border-gray-200 hover:border-gray-400',
                isDisabled && 'opacity-40 cursor-not-allowed'
              )}
              style={{ backgroundColor: hex }}
              aria-pressed={isSelected}
              aria-label={`${color}${isSelected ? ' (selected)' : ''}`}
              title={color.charAt(0).toUpperCase() + color.slice(1)}
            >
              {isSelected && (
                <span
                  className={clsx(
                    'absolute inset-0 flex items-center justify-center',
                    isLight ? 'text-gray-800' : 'text-white'
                  )}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected colors summary */}
      {selected.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-500">Selected:</span>
          {selected.map((color) => (
            <span
              key={color}
              className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-sm"
            >
              <span
                className="w-3 h-3 rounded-full border border-gray-300"
                style={{ backgroundColor: getColorHex(color) }}
              />
              {color}
            </span>
          ))}
          {maxColors && (
            <span className="text-sm text-gray-400">
              ({selected.length}/{maxColors})
            </span>
          )}
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
