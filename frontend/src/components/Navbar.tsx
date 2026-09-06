import { useState } from 'react';
import { navLinks } from '../data/content';
import Container from './Container';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-5 left-1/2 -translate-x-1/2 w-[85%] max-w-6xl z-50 bg-white backdrop-blur rounded-lg border border-black/20 shadow-md px-4 py-3">
      <Container className="flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-md bg-gradient-to-r from-blue-500 to-blue-600" aria-hidden="true" />
          <span className="text-lg font-semibold text-slate-900 tracking-tight">
            ClawX
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="#cta"
          className="hidden md:inline-flex items-center rounded-lg bg-gradient-to-b from-blue-400 to-blue-600 text-white text-sm font-medium px-4 py-2 border border-blue-500/20 shadow-md transition cursor-pointer"
        >
          Get Started
        </a>

        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-md text-slate-700 hover:bg-slate-100 transition"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label="Toggle navigation menu"
          onClick={() => setOpen((v) => (v === null ? null : !v))}
        >
          <span className="sr-only">Toggle menu</span>
          {open ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>
      </Container>

      <div
        id="mobile-menu"
        className={`md:hidden border-t border-black/10 mt-3 pt-3 transition-all duration-200 ease-out ${
          open ? 'max-h-64 opacity-100' : 'max-h-0 overflow-hidden opacity-0'
        }`}
        aria-hidden={!open}
      >
        <div className="flex flex-col gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-base font-medium text-slate-700 hover:text-blue-600 px-3 py-2 rounded-md hover:bg-slate-50 transition"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#cta"
            className="mt-2 inline-flex items-center justify-center rounded-md bg-gradient-to-b from-blue-400 to-blue-600 text-white text-sm font-medium px-4 py-2 border border-blue-500/20 shadow-sm hover:shadow transition cursor-pointer"
            onClick={() => setOpen(false)}
          >
            Get Started
          </a>
        </div>
      </div>
    </header>
  );
}
