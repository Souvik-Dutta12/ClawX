import Container from './Container';
import { footerLinkGroups } from '../data/content';

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-blue-400 to-blue-600 text-white  border-blue-500">
      <Container className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <a href="#top" className="flex items-center gap-2 mb-4 inline-block">
              <span className="w-7 h-7 rounded-md bg-white/20 border border-white/40" aria-hidden="true" />
              <span className="text-lg font-semibold text-white tracking-tight">
                ClawX
              </span>
            </a>
            <p className="text-white/90 text-sm max-w-xs">
              Your AI co-pilot for everything. Smart, fast, and always private.
            </p>
          </div>

          {footerLinkGroups.map((group) => (
            <div key={group.heading}>
              <h3 className="text-xs font-semibold text-white/80 uppercase tracking-wider mb-4">
                {group.heading}
              </h3>
              <ul className="flex flex-col gap-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-white/90 hover:text-white transition"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-white/80">
            © {currentYear} ClawX. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="text-white/80 hover:text-white transition" aria-label="Privacy">
              Privacy
            </a>
            <a href="#" className="text-white/80 hover:text-white transition" aria-label="Terms">
              Terms
            </a>
            <a href="#" className="text-white/80 hover:text-white transition" aria-label="Contact">
              Contact
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
