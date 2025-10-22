/**
 * MSW Browser Setup
 * Configure Mock Service Worker for browser-based tests
 *
 * Installation:
 * npm install -D msw@latest
 *
 * Setup:
 * npx msw init public/ --save
 */

import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

/**
 * Setup MSW worker for browser environment
 */
export const worker = setupWorker(...handlers);

/**
 * Start MSW worker
 * Call this in your test setup or before running tests
 */
export function startMockWorker() {
  if (typeof window !== 'undefined') {
    return worker.start({
      onUnhandledRequest: 'bypass',
      quiet: false,
    });
  }
}

/**
 * Stop MSW worker
 */
export function stopMockWorker() {
  if (typeof window !== 'undefined') {
    worker.stop();
  }
}

/**
 * Reset MSW handlers
 */
export function resetMockHandlers() {
  worker.resetHandlers();
}
