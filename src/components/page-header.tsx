import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface PageHeaderProps {
  title: string;
  mobileTitle?: string;
  backHref: string;
  actions: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  mobileTitle,
  backHref,
  actions
}) => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href={backHref}>
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Button>
            </Link>
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
              <span className="hidden sm:inline">{title}</span>
              <span className="sm:hidden">{mobileTitle || title}</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            {actions}
          </div>
        </div>
      </div>
    </header>
  );
};
