import type { ReactNode } from 'react';

interface SectionProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export default function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  className = '',
}: SectionProps) {
  return (
    <section id={id} className={`py-16 md:py-24 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(eyebrow || title || description) && (
          <div className="text-center mb-12 md:mb-16">
            {eyebrow && (
              <p className="text-xs font-semibold tracking-wider text-blue-600 uppercase mb-3">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="text-3xl md:text-4xl font-semibold text-slate-900">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-4 text-slate-600 max-w-2xl mx-auto text-lg">
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
