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

export { default as Select } from './ui/Select';
export type { SelectProps } from './ui/Select';

export { default as Table } from './ui/Table';
export type { TableProps } from './ui/Table';

export { default as Modal } from './ui/Modal';
export type { ModalProps } from './ui/Modal';

export { default as Tabs } from './ui/Tabs';
export type { TabsProps } from './ui/Tabs';

export { default as Dropdown } from './ui/Dropdown';
export type { DropdownProps } from './ui/Dropdown';

export { default as Sidebar } from './ui/Sidebar';
export type { SidebarProps } from './ui/Sidebar';

export { default as TopBar } from './ui/TopBar';
export type { TopBarProps } from './ui/TopBar';

export { default as MainLayout } from './ui/MainLayout';
export type { MainLayoutProps } from './ui/MainLayout';

// Business Components
export { default as KnowledgeCard } from './business/KnowledgeCard';
export type { KnowledgeCardProps } from './business/KnowledgeCard';

export { default as ContentPreview } from './business/ContentPreview';
export type { ContentPreviewProps } from './business/ContentPreview';

export { default as ChatMessage } from './business/ChatMessage';
export type { ChatMessageProps } from './business/ChatMessage';

// Usage example:
// import { Button, Input, Card, Select, Table, KnowledgeCard } from '@/components';
