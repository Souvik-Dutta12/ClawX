import  Icon  from './Icons';
import { features } from '../data/content';
import Section from './Section';

export default function Features() {
  return (
    <Section
      id="features"
      eyebrow="Features"
      title="Everything you need, nothing you don't."
      description="A focused set of capabilities that grow with you — no bloat, no clutter."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <article
            key={feature.title}
            className="rounded-xl bg-white border border-slate-200 p-6 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition animate-fade-up"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className="w-10 h-10 rounded-md bg-blue-50 flex items-center justify-center mb-4">
              <Icon icon={feature.icon} className="text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              {feature.title}
            </h3>
            <p className="text-slate-600 leading-relaxed text-sm">
              {feature.description}
            </p>
          </article>
        ))}
      </div>
    </Section>
  );
}
