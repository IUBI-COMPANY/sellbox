'use client';

import { useState } from 'react';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: AvatarSize;
  fallback?: string;
  className?: string;
}

const sizeMap: Record<AvatarSize, string> = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base',
  xl: 'w-20 h-20 text-lg',
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function Avatar({
  src,
  alt = '',
  size = 'md',
  fallback,
  className = '',
}: AvatarProps) {
  const [imgError, setImgError] = useState(false);
  const showFallback = !src || imgError;

  return (
    <div
      className={`
        relative rounded-full overflow-hidden border border-border
        flex items-center justify-center shrink-0
        ${sizeMap[size]}
        ${className}
      `.trim()}
    >
      {showFallback ? (
        <div
          className="w-full h-full flex items-center justify-center font-semibold text-white"
          style={{ background: 'var(--gradient-brand)' }}
        >
          {fallback ? getInitials(fallback) : '?'}
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
}
