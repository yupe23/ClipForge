'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Route } from 'next';
import {
  Clapperboard,
  Home,
  LifeBuoy,
} from 'lucide-react';

import { AuthenticatedUserMenu } from '@/components/authenticated-user-menu';
import { ThemeToggle } from '@/components/theme-toggle';
import { cn } from '@/lib/utils';

type DashboardShellProps = Readonly<{
  children: React.ReactNode;
}>;

type ShellLink = {
  href: Route;
  label: string;
  icon: typeof Home;
};

const primaryLinks: ShellLink[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: Home,
  },
  {
    href: '/dashboard/support',
    label: 'Support',
    icon: LifeBuoy,
  },
];

const footerLinks: Array<{ href: Route; label: string }> = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard/support', label: 'Support' },
  { href: '/dashboard/support/help', label: 'Help Center' },
  { href: '/dashboard/support/contact', label: 'Contact' },
];

const isActiveRoute = (pathname: string, href: Route) => {
  if (href === '/dashboard') {
    return pathname === '/dashboard';
  }

  return pathname === href || pathname.startsWith(`${href}/`);
};

export function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)]">
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3">
            <Link
              href="/dashboard"
              className="group flex min-w-0 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
              aria-label="ClipForge dashboard"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--brand)]/25 bg-[var(--brand-soft)] text-[var(--brand)] shadow-sm">
                <Clapperboard className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold tracking-wide text-[var(--text-primary)]">
                  ClipForge
                </span>
                <span className="hidden text-xs text-[var(--text-secondary)] sm:block">AI clip studio</span>
              </span>
            </Link>

            <div className="flex shrink-0 items-center gap-2">
              <nav className="hidden items-center rounded-lg border border-[var(--border)] bg-[var(--surface)] p-1 shadow-sm md:flex" aria-label="Dashboard navigation">
                {primaryLinks.map((item) => {
                  const ItemIcon = item.icon;
                  const isActive = isActiveRoute(pathname, item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={isActive ? 'page' : undefined}
                      className={cn(
                        'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]',
                        isActive && 'bg-[var(--brand-soft)] text-[var(--brand)]',
                      )}
                    >
                      <ItemIcon className="h-4 w-4" aria-hidden="true" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
              <ThemeToggle />
              <AuthenticatedUserMenu />
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 md:hidden" aria-label="Dashboard navigation">
            {primaryLinks.map((item) => {
              const ItemIcon = item.icon;
              const isActive = isActiveRoute(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'inline-flex shrink-0 items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-medium text-[var(--text-secondary)] shadow-sm transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]',
                    isActive && 'border-[var(--brand)]/30 bg-[var(--brand-soft)] text-[var(--brand)]',
                  )}
                >
                  <ItemIcon className="h-4 w-4" aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <main id="dashboard-content" className="min-w-0">
          {children}
        </main>
      </div>

      <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-6 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <Link
            href="/dashboard"
            className="group flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            aria-label="ClipForge dashboard"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--brand)]/25 bg-[var(--brand-soft)] text-[var(--brand)]">
              <Clapperboard className="h-4 w-4" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-sm font-semibold text-[var(--text-primary)]">ClipForge</span>
              <span className="text-xs text-[var(--text-secondary)]">Modern tools for short-form video teams.</span>
            </span>
          </Link>

          <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[var(--text-secondary)]" aria-label="Footer navigation">
            {footerLinks.map((item) => (
              <Link key={item.href} href={item.href} className="inline-flex items-center gap-1 transition-colors hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
