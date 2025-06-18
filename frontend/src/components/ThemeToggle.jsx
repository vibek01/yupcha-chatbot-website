// src/components/ThemeToggle.jsx
import { useTheme } from '../ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = () => theme() === 'dark';

  return (
    <button 
      onClick={toggleTheme}
      class="theme-toggle"
      aria-label={`Switch to ${isDark() ? 'light' : 'dark'} mode`}
    >
      <svg width="24" height="24" viewBox="0 0 24 24">
        <defs>
          <clipPath id="moon-mask">
            <path d="M12,3A9,9,0,1,1,3,12,9,9,0,0,1,12,3Z" />
          </clipPath>
        </defs>
        
        {/* Sun rays */}
        <g transform="rotate(0 12 12)" class="sun-rays">
          <circle cx="12" cy="12" r="3.5" class="sun-core" />
          {Array.from({ length: 8 }).map((_, i) => (
            <rect 
              x="11" y="1" width="2" height="4" 
              rx="1" ry="1" 
              transform={`rotate(${i * 45} 12 12)`}
              class="sun-ray"
            />
          ))}
        </g>
        
        {/* Moon shape */}
        <circle 
          cx="12" cy="12" r="9" 
          class="moon-body" 
          clip-path="url(#moon-mask)"
        />
        <circle 
          cx="17" cy="7" r="5" 
          class="moon-crater" 
          clip-path="url(#moon-mask)"
        />
      </svg>
    </button>
  );
}