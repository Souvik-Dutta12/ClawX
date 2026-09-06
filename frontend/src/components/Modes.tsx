import  Icon  from './Icons';
import { modes } from '../data/content';
import Section from './Section';

export default function Modes() {
  return (
    <Section
      id="modes"
      eyebrow="Modes"
      title="One assistant, many superpowers."
      description="Switch modes instantly depending on what you're working on — no new tabs, no new tools."
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {modes.map((mode, index) => (
          <article
            key={mode.title}
            className="rounded-2xl p-8 shadow-md bg-gradient-to-br from-blue-600/20 to-blue-50 hover:shadow-lg transition animate-fade-up"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className="mb-6">
              <Icon icon={mode.icon} className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              {mode.title}
            </h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              {mode.description}
            </p>
            <span className="inline-block rounded-md bg-blue-400/20 border border-blue-900/20 text-blue-700 px-2 py-1 text-xs font-medium">
              {mode.badge}
            </span>
          </article>
        ))}
      </div>
    </Section>
  );
}
