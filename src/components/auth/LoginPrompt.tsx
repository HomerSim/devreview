'use client';

import { LogIn } from 'lucide-react';
import Link from 'next/link';

interface LoginPromptProps {
  message?: string;
  action?: string;
  className?: string;
}

export function LoginPrompt({ 
  message = "로그인이 필요한 기능입니다", 
  action = "로그인하기",
  className = ""
}: LoginPromptProps) {
  return (
    <div className={`flex items-center gap-2 text-gray-600 ${className}`}>
      <LogIn className="w-4 h-4" />
      <span className="text-sm">{message}</span>
      <Link 
        href="/login"
        className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
      >
        {action}
      </Link>
    </div>
  );
}

interface LoginTooltipProps {
  message?: string;
  children: React.ReactNode;
}

export function LoginTooltip({ 
  message = "로그인 후 사용 가능합니다",
  children 
}: LoginTooltipProps) {
  return (
    <div className="group relative">
      <div className="opacity-50 cursor-not-allowed">
        {children}
      </div>
      <div className="invisible group-hover:visible absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
        {message}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  );
}
