import { useState } from 'react';
import { faqs } from '../data/content';
import Section from './Section';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <Section
      id="faq"
      eyebrow="FAQ"
      title="Questions, answered."
      description="The things people ask most, without the fluff."
    >
      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={item.question}>
              <button
                type="button"
                className="w-full flex items-start justify-between p-5 rounded-md bg-white border border-black/10 shadow-sm hover:shadow transition cursor-pointer text-left"
                aria-expanded={isOpen}
                onClick={() => setOpenIndex((v) => (v === index ? null : index))}
              >
                <span className="text-sm font-medium text-slate-900 pr-4">
                  {item.question}
                </span>
                <svg
                  className={`w-5 h-5 text-slate-400 transition-transform duration-200 flex-shrink-0 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                className={`grid transition-all duration-200 ease-out ${
                  isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="bg-neutral-800 rounded-b-lg pt-1 px-5 pb-4 text-white text-sm leading-relaxed">
                    {item.answer}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
