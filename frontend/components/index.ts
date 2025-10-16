/**
 * KCP Design System - Component Index
 * 
 * This file exports all UI components for easy importing
 */

// Base UI Components
export { default as Button } from './ui/Button';
export type { ButtonProps } from './ui/Button';

export { default as Input } from './ui/Input';
export type { InputProps } from './ui/Input';

export { Card, CardHeader, CardBody, CardFooter } from './ui/Card';
export type { CardProps, CardHeaderProps, CardBodyProps, CardFooterProps } from './ui/Card';

// Business Components
export { default as KnowledgeCard } from './business/KnowledgeCard';
export type { KnowledgeCardProps } from './business/KnowledgeCard';

// Usage example:
// import { Button, Input, Card, KnowledgeCard } from '@/components';
