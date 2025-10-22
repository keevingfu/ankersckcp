/**
 * SWR Provider Component
 * Provides SWR configuration context to the entire application
 */

'use client';

import { SWRConfig } from 'swr';
import { swrConfig } from './config';

interface SWRProviderProps {
  children: React.ReactNode;
}

/**
 * SWR Provider wrapper component
 * Must be used in client components only
 */
export function SWRProvider({ children }: SWRProviderProps) {
  return <SWRConfig value={swrConfig}>{children}</SWRConfig>;
}

export default SWRProvider;
