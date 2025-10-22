/**
 * Web Vitals Reporting Module
 *
 * This module provides functions to report Core Web Vitals metrics:
 * - LCP (Largest Contentful Paint): measures loading performance
 * - FID (First Input Delay): measures interactivity
 * - CLS (Cumulative Layout Shift): measures visual stability
 * - FCP (First Contentful Paint): measures perceived loading speed
 * - TTFB (Time to First Byte): measures server response time
 * - INP (Interaction to Next Paint): measures responsiveness
 */

import { onCLS, onFCP, onLCP, onTTFB, onINP, Metric } from 'web-vitals';

export interface WebVitalsMetric extends Metric {
  label: string;
}

/**
 * Report Web Vitals to analytics endpoint
 */
interface WindowWithGtag extends Window {
  gtag?: (...args: unknown[]) => void;
}

function sendToAnalytics(metric: WebVitalsMetric) {
  // In production, send to your analytics endpoint
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to Google Analytics
    if (typeof window !== 'undefined' && (window as WindowWithGtag).gtag) {
      (window as WindowWithGtag).gtag?.('event', metric.name, {
        event_category: 'Web Vitals',
        event_label: metric.id,
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        non_interaction: true,
      });
    }

    // Example: Send to custom analytics endpoint
    const url = `/api/analytics/web-vitals`;
    const body = JSON.stringify(metric);

    // Use navigator.sendBeacon if available
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, body);
    } else {
      fetch(url, {
        method: 'POST',
        body,
        headers: {
          'Content-Type': 'application/json',
        },
        keepalive: true,
      }).catch(console.error);
    }
  }
}

/**
 * Log metrics to console in development
 */
function logToConsole(metric: WebVitalsMetric) {
  if (process.env.NODE_ENV === 'development') {
    const rating = getRating(metric);
    const color = rating === 'good' ? 'green' : rating === 'needs-improvement' ? 'orange' : 'red';

    // eslint-disable-next-line no-console
    console.log(
      `%c${metric.name}%c ${metric.value.toFixed(2)}${getUnit(metric.name)} %c${rating}`,
      'font-weight: bold; font-size: 12px;',
      `color: ${color}; font-weight: bold;`,
      `color: ${color}; font-style: italic;`
    );
  }
}

/**
 * Get the rating (good, needs-improvement, poor) for a metric
 */
function getRating(metric: WebVitalsMetric): 'good' | 'needs-improvement' | 'poor' {
  const { name, value } = metric;

  // Thresholds from web.dev/vitals
  const thresholds: Record<string, [number, number]> = {
    LCP: [2500, 4000],
    FID: [100, 300],
    CLS: [0.1, 0.25],
    FCP: [1800, 3000],
    TTFB: [800, 1800],
    INP: [200, 500],
  };

  const [goodThreshold, poorThreshold] = thresholds[name] || [0, 0];

  if (value <= goodThreshold) return 'good';
  if (value <= poorThreshold) return 'needs-improvement';
  return 'poor';
}

/**
 * Get the unit for a metric
 */
function getUnit(metricName: string): string {
  return metricName === 'CLS' ? '' : 'ms';
}

/**
 * Handle Web Vitals metric reporting
 */
function handleMetric(metric: Metric) {
  const webVitalsMetric: WebVitalsMetric = {
    ...metric,
    label: process.env.NEXT_PUBLIC_VERCEL_ENV || 'development',
  };

  logToConsole(webVitalsMetric);
  sendToAnalytics(webVitalsMetric);
}

/**
 * Initialize Web Vitals tracking
 */
export function reportWebVitals() {
  try {
    onLCP(handleMetric);
    onFCP(handleMetric);
    onCLS(handleMetric);
    onTTFB(handleMetric);
    onINP(handleMetric);
  } catch (error) {
    console.error('Error initializing Web Vitals:', error);
  }
}

/**
 * Get current Web Vitals metrics (for display in UI)
 */
export function getCurrentMetrics(): Promise<Record<string, number>> {
  return new Promise((resolve) => {
    const metrics: Record<string, number> = {};

    const collector = (metric: Metric) => {
      metrics[metric.name] = metric.value;
    };

    onLCP(collector);
    onFCP(collector);
    onCLS(collector);
    onTTFB(collector);
    onINP(collector);

    // Wait a bit for metrics to be collected
    setTimeout(() => resolve(metrics), 1000);
  });
}
