import React from 'react'

export default function ZenScoreIcon({ size = 36, className = '', style = {}, showGlow = true }) {
  const idSuffix = React.useId().replace(/:/g, '')

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      <defs>
        {/* Background Radiant Gradient */}
        <linearGradient id={`zsGradient-${idSuffix}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E68F6" />
          <stop offset="45%" stopColor="#3B82F6" />
          <stop offset="80%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#4C1D95" />
        </linearGradient>

        {/* Node Glow Effect */}
        <filter id={`nodeGlow-${idSuffix}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* 3D Drop Shadow */}
        <filter id={`dropShadow-${idSuffix}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="12" stdDeviation="14" floodColor="#0F172A" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Rounded Rect Background (Squircle) */}
      <rect
        x="16"
        y="16"
        width="480"
        height="480"
        rx="108"
        fill={`url(#zsGradient-${idSuffix})`}
      />

      {/* Group with 3D drop shadow */}
      <g filter={`url(#dropShadow-${idSuffix})`}>
        {/* GRADUATION CAP / MORTARBOARD */}
        {/* Diamond Top Cap */}
        <path
          d="M256 75 L430 135 L256 195 L82 135 Z"
          fill="#FFFFFF"
        />
        {/* Skull Cap Skull Base Band under diamond */}
        <path
          d="M182 165 Q256 194 330 165 V188 Q256 218 182 188 Z"
          fill="#FFFFFF"
        />
        {/* Tassel Cord hanging to left */}
        <path
          d="M256 135 C205 135 152 142 152 160 V225"
          stroke="#FFFFFF"
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
        />
        {/* Tassel Ring / Ornament */}
        <circle cx="152" cy="202" r="11" fill="#FFFFFF" />
        {/* Tassel Fringe / Brush */}
        <path
          d="M136 212 L138 258 M144 212 L147 262 M152 212 L152 264 M160 212 L157 262 M168 212 L165 258"
          stroke="#FFFFFF"
          strokeWidth="4.5"
          strokeLinecap="round"
        />

        {/* MAIN 'Z' LETTERFORM */}
        <path
          d="M 172 205
             H 342
             C 365 205, 378 220, 368 240
             L 218 375
             H 338
             C 360 375, 372 390, 364 408
             C 355 425, 335 428, 308 428
             H 168
             C 142 428, 128 412, 138 392
             L 282 258
             H 172
             C 150 258, 138 244, 146 224
             C 154 208, 162 205, 172 205 Z"
          fill="#FFFFFF"
        />

        {/* BAR CHART COLUMNS inside lower Z sweep */}
        <rect x="232" y="364" width="17" height="28" rx="4" fill="#2563EB" />
        <rect x="257" y="344" width="17" height="48" rx="4" fill="#2563EB" />
        <rect x="282" y="324" width="17" height="68" rx="4" fill="#2563EB" />

        {/* TECH CIRCUIT LINES & GLOWING NODES (right side of Z) */}
        {/* Top Circuit Branch */}
        <path
          d="M 292 288 L 324 260 H 388"
          stroke="#FFFFFF"
          strokeWidth="9"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Top Node */}
        <circle cx="408" cy="260" r="14" fill="#FFFFFF" />
        <circle cx="408" cy="260" r="7.5" fill="#38BDF8" filter={showGlow ? `url(#nodeGlow-${idSuffix})` : undefined} />

        {/* Middle Circuit Branch */}
        <path
          d="M 280 312 H 410"
          stroke="#FFFFFF"
          strokeWidth="9"
          strokeLinecap="round"
          fill="none"
        />
        {/* Middle Node */}
        <circle cx="430" cy="312" r="14" fill="#FFFFFF" />
        <circle cx="430" cy="312" r="7.5" fill="#38BDF8" filter={showGlow ? `url(#nodeGlow-${idSuffix})` : undefined} />

        {/* Bottom Circuit Branch */}
        <path
          d="M 310 336 L 332 352 H 378"
          stroke="#FFFFFF"
          strokeWidth="9"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Bottom Node */}
        <circle cx="398" cy="352" r="14" fill="#FFFFFF" />
        <circle cx="398" cy="352" r="7.5" fill="#38BDF8" filter={showGlow ? `url(#nodeGlow-${idSuffix})` : undefined} />
      </g>
    </svg>
  )
}
