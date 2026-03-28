'use client';

import { type ReactNode } from 'react';
import { Header } from './header';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header />
      <main className="flex-1 overflow-y-auto bg-muted/30 p-4 lg:p-6">
        {children}
      </main>
    </div>
  );
}
