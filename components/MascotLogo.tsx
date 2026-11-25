import React from 'react';

interface MascotLogoProps {
  size?: number;
  className?: string;
}

/**
 * Brand mascot SVG matching the sleeping pot illustration from the design system.
 */
export const MascotLogo: React.FC<MascotLogoProps> = ({
  size = 36,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      <path
        d="M40 12H48L41 20H49"
        stroke="#2B1B14"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M31 6H36L31.5 11H36.5"
        stroke="#2B1B14"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 30C16 23.3726 23.1634 18 32 18C40.8366 18 48 23.3726 48 30H16Z"
        fill="#FFF6E5"
        stroke="#2B1B14"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <circle
        cx="32"
        cy="15"
        r="2.5"
        fill="#FFF6E5"
        stroke="#2B1B14"
        strokeWidth="3"
      />
      <path
        d="M10 30H54"
        stroke="#2B1B14"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M14 30H50V44C50 48.4183 46.4183 52 42 52H22C17.5817 52 14 48.4183 14 44V30Z"
        fill="#F28C4A"
        stroke="#2B1B14"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <path
        d="M22 39C23.5 40.5 25.5 40.5 27 39"
        stroke="#2B1B14"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M37 39C38.5 40.5 40.5 40.5 42 39"
        stroke="#2B1B14"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M29.5 44C31 45.5 33 45.5 34.5 44"
        stroke="#2B1B14"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
};
