import React from 'react';

const FotyLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 350 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMid meet">
    {/* Icon */}
    <g transform="translate(50,50)">
        {/* Figures - now with softer, more organic bodies */}
        <g transform="scale(0.9)">
            {/* Orange */}
            <g transform="rotate(18)">
                <circle cx="0" cy="-30" r="6" fill="#f97316"/>
                <ellipse cx="0" cy="-14" rx="8" ry="12" fill="#f97316"/>
            </g>
            {/* Pink */}
            <g transform="rotate(90)">
                <circle cx="0" cy="-30" r="6" fill="#ec4899"/>
                <ellipse cx="0" cy="-14" rx="8" ry="12" fill="#ec4899"/>
            </g>
            {/* Purple */}
            <g transform="rotate(162)">
                <circle cx="0" cy="-30" r="6" fill="#8b5cf6"/>
                <ellipse cx="0" cy="-14" rx="8" ry="12" fill="#8b5cf6"/>
            </g>
            {/* Light Blue */}
            <g transform="rotate(234)">
                <circle cx="0" cy="-30" r="6" fill="#38bdf8"/>
                <ellipse cx="0" cy="-14" rx="8" ry="12" fill="#38bdf8"/>
            </g>
            {/* Green */}
            <g transform="rotate(306)">
                <circle cx="0" cy="-30" r="6" fill="#84cc16"/>
                <ellipse cx="0" cy="-14" rx="8" ry="12" fill="#84cc16"/>
            </g>
        </g>
    </g>
    
    {/* Text */}
    <g transform="translate(110, 0)">
      <text x="10" y="50" fontFamily='"DM Serif Display", serif' fontSize="28" fontWeight="bold" fill="currentColor" letterSpacing="2">F.O.T.Y</text>
      <text x="10" y="75" fontFamily="sans-serif" fontSize="15" fontWeight="bold" fill="#8b5cf6" letterSpacing="0.5">FRIENDS OF THE YOUTH</text>
    </g>
  </svg>
);

export default FotyLogo;