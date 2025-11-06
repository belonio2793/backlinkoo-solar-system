import React from 'react';

type Props = {
  variant?: 'default' | 'wide' | 'narrow';
  className?: string;
  children: React.ReactNode;
  hero?: React.ReactNode;
};

const variantToMaxWidth: Record<string, string> = {
  default: 'max-w-4xl',
  wide: 'max-w-6xl',
  narrow: 'max-w-3xl',
};

export default function ContentContainer({ variant = 'default', className = '', children, hero }: Props) {
  const maxWidthClass = variantToMaxWidth[variant] || variantToMaxWidth.default;

  return (
    <main className={`${maxWidthClass} mx-auto px-6 py-16` + (className ? ` ${className}` : '')}>
      {hero}
      <div className="bg-white dark:bg-slate-900/70 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-8 prose prose-slate mx-auto">
        {children}
      </div>
    </main>
  );
}
