import { GetStartedCta } from '@/components/landing/get-started-cta';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import type { Route } from 'next';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
];

type SiteHeaderProps = {
  isSignedIn: boolean;
};

export function SiteHeader({ isSignedIn }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-sm font-semibold text-[var(--text-primary)]">
            CF
          </div>
          <span className="text-sm font-semibold tracking-[0.16em] text-[var(--text-primary)]">CLIPFORGE</span>
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {!isSignedIn ? (
            <>
              <Link
                href={'/sign-in' as Route}
                className="hidden h-9 items-center justify-center rounded-md px-3 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] sm:inline-flex"
              >
                Sign In
              </Link>
              <GetStartedCta isSignedIn={isSignedIn} size="sm" />
            </>
          ) : (
            <UserButton afterSignOutUrl="/" />
          )}
        </div>
      </div>
    </header>
  );
}
