import Container from './Container';
import Icon from './Icons';

export default function CTA() {
  return (
    <section id="cta" className="bg-gradient-to-b from-white  to-blue-400 text-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-300 rounded-full blur-3xl" />
      </div>
      
      <Container className="py-20 md:py-28 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
      
          
          <h2 className="text-4xl text-neutral-600 md:text-5xl lg:text-6xl font-bold leading-tight">
            Ready to transform your workflow?
          </h2>
          <p className="mt-6 text-neutral-700 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Join thousands of professionals who've already upgraded their productivity with ClawX. Start free, no credit card required.
          </p>
          
          {/* Stats row */}
          <div className="mt-10 flex flex-wrap text-neutral-500 justify-center gap-8 md:gap-16">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold">50K+</div>
              <div className="text-neutral-500 text-sm mt-1">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold">10M+</div>
              <div className="text-neutral-500  text-sm mt-1">Tasks Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold">4.9★</div>
              <div className="text-neutral-500 text-sm mt-1">User Rating</div>
            </div>
          </div>
          
          {/* CTA buttons */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="#"
              className="group inline-flex items-center justify-center rounded-xl bg-white text-blue-600 text-base font-semibold px-8 py-4 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              Start Free Trial
              <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm text-white text-base font-medium px-8 py-4 border border-white/20 hover:bg-white/20 transition-all duration-200 cursor-pointer"
            >
              <svg className="mr-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
              </svg>
              Watch Demo
            </a>
          </div>
          
          {/* Trust badges */}
          
        </div>
      </Container>
    </section>
  );
}
