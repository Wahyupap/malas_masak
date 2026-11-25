'use client';

import React from 'react';

interface DefaultAvatarProps {
  alt: string;
  src?: string | null;
  sizeClass?: string;
}

/**
 * Default Profile Picture Component (White & Grey)
 *
 * Renders a classic white-and-grey default profile picture when `src` is null/empty.
 * BACKEND INTEGRATION NOTE:
 * Pass `user.avatarUrl` into `src`. If a user uploads a real profile photo later,
 * it automatically renders the image with a clean fallback to this default avatar.
 */
export const DefaultAvatar: React.FC<DefaultAvatarProps> = ({
  alt,
  src,
  sizeClass = 'w-12 h-12',
}) => {
  const [imgError, setImgError] = React.useState(false);

  if (src && !imgError) {
    return (
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
        className={`${sizeClass} rounded-full object-cover border-2 border-outline shrink-0 bg-white`}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={alt}
      className={`${sizeClass} rounded-full border-2 border-outline shrink-0 bg-white flex items-center justify-center overflow-hidden`}
    >
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        aria-hidden="true"
      >
        <rect width="64" height="64" fill="#F3F4F6" />
        <circle cx="32" cy="24" r="11" fill="#9CA3AF" />
        <path
          d="M12 58C12 46.9543 20.9543 38 32 38C43.0457 38 52 46.9543 52 58V64H12V58Z"
          fill="#9CA3AF"
        />
        <circle cx="32" cy="32" r="30.5" stroke="#FFFFFF" strokeWidth="3" />
      </svg>
    </div>
  );
};
