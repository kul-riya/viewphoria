const Logo: React.FC = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 300 300"
        className="w-24 md:w-32 lg:w-40"
      >
        <defs>
          {/* Gradient for a sleek, premium feel */}
          <linearGradient id="vGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#3B0764", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "#8B5CF6", stopOpacity: 1 }} />
          </linearGradient>
  
          {/* Soft Glow Effect */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
  
        {/* Main V Shape - Sharp and Elegant */}
        <g fill="none" stroke="url(#vGradient)" strokeWidth="12" filter="url(#glow)">
          <path
            d="M70 60 L150 230 L230 60"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
  
        {/* Inner Parallel Lines - Minimalist Futuristic Detail */}
        <g stroke="url(#vGradient)" strokeWidth="4.5" opacity="0.85">
          <path d="M95 85 L140 200" />
          <path d="M205 85 L160 200" />
        </g>
  
  
        {/* Connection Nodes for a High-Tech Feel */}
        <g fill="url(#vGradient)">
          <circle cx="70" cy="60" r="7" />
          <circle cx="150" cy="230" r="7" />
          <circle cx="230" cy="60" r="7" />
        </g>
  
        {/* Floating Pixel-Like Circuit Elements */}
        <g fill="url(#vGradient)" fillOpacity="0.65">
          <rect x="260" y="30" width="18" height="18" rx="3" ry="3" />
          <rect x="270" y="60" width="12" height="12" rx="2" ry="2" />
        </g>
      </svg>
    );
  };
  
  export default Logo;
  