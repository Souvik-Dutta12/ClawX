import Icon  from './Icons';

export default function Hero() {
  return (
    <section
      className="h-screen flex flex-col items-center justify-center overflow-hidden relative mask-b-from-[70%] "
      style={{
        backgroundImage: 'url(/bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        // maskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
        // WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
        // opacity: 0.4,
      }}
    >
      {/* Content overlay to ensure text readability */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start lg:items-center text-center lg:text-left">
          <div className="space-y-6">
            <p className="text-xs font-semibold tracking-wider text-white uppercase">
              Meet ClawX
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl text-white font-bold leading-tight ">
              Your AI co-pilot for <span className="bg-blue-600 text-white">
                everything
              </span>
            </h1>
            <p className="text-neutral-200 max-w-xl lg:max-w-none">
              ClawX combines advanced language and vision models into a single intuitive interface — helping you write, code, research, and create without context-switching.
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <a
                href="#cta"
                className="inline-flex items-center rounded-lg bg-gradient-to-b from-blue-400 to-blue-600 text-white text-sm font-medium px-5 py-2.5 border border-blue-500/20 shadow-md transition cursor-pointer"
              >
                Get Started Free
              </a>
              <a
                href="#faq"
                className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-blue-600 transition bg-white px-4 py-2 rounded-lg border border-slate-200/50 shadow-md"
              >
                Learn more
                <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>

          <div className="relative animate-fade-up lg:mt-0 mt-8 video">
            <div className="relative rounded-2xl shadow-md overflow-hidden bg-blue-400">
              <video
                className="w-full h-auto rounded-2xl"
                src="/clawX-demo.mp4"
                autoPlay
                loop
                muted
                playsInline
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
