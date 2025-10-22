import React from 'react';

// A professional logo for Friends of the Youth (FOTY).
const FotyLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 260 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMid meet">
    {/* Icon */}
    <g transform="translate(30, 30)">
      <circle cx="0" cy="0" r="28" fill="none" stroke="currentColor" strokeWidth="3" />
      <g fill="currentColor">
        <g transform="rotate(45)">
          <circle cx="0" cy="-15" r="6" />
          <path d="M-10 12 C -10 2, 10 2, 10 12 Z" />
        </g>
        <g transform="rotate(135)">
          <circle cx="0" cy="-15" r="6" />
          <path d="M-10 12 C -10 2, 10 2, 10 12 Z" />
        </g>
        <g transform="rotate(225)">
          <circle cx="0" cy="-15" r="6" />
          <path d="M-10 12 C -10 2, 10 2, 10 12 Z" />
        </g>
        <g transform="rotate(315)">
          <circle cx="0" cy="-15" r="6" />
          <path d="M-10 12 C -10 2, 10 2, 10 12 Z" />
        </g>
      </g>
    </g>
    {/* Text */}
    <g transform="translate(75, 0)">
      <text x="0" y="30" fontFamily="sans-serif" fontSize="26" fontWeight="bold" fill="currentColor" letterSpacing="1">F.O.T.Y</text>
      <text x="0" y="48" fontFamily="sans-serif" fontSize="14" fill="currentColor" letterSpacing="0.5">FRIENDS OF THE YOUTH</text>
    </g>
  </svg>
);

export default FotyLogo;