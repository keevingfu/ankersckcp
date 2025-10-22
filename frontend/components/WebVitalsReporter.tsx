'use client';

import { useEffect } from 'react';
import { reportWebVitals } from '@/lib/web-vitals';

/**
 * Web Vitals Reporter Component
 *
 * This component automatically tracks and reports Core Web Vitals metrics
 * when mounted in the application. It should be included in the root layout.
 *
 * Tracked metrics:
 * - LCP (Largest Contentful Paint)
 * - FID (First Input Delay)
 * - CLS (Cumulative Layout Shift)
 * - FCP (First Contentful Paint)
 * - TTFB (Time to First Byte)
 * - INP (Interaction to Next Paint)
 */
export default function WebVitalsReporter() {
  useEffect(() => {
    // Initialize Web Vitals tracking
    reportWebVitals();
  }, []);

  // This component doesn't render anything
  return null;
}
