import React from 'react';
import { getLocalWebpSrcSet } from '@/lib/imageUtils';

export default function OptimizedImage({ src, alt = '', className = '', sizes = '(max-width: 640px) 100vw, 33vw' }) {
  if (!src) return null;

  const webpSrcSet = getLocalWebpSrcSet(src, [480, 800, 1200, 1600]);

  return (
    <picture>
      {webpSrcSet && <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} />}
      <img src={src} alt={alt} className={className} loading="lazy" decoding="async" />
    </picture>
  );
}
