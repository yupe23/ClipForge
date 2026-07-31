'use client';

import { UserButton } from '@clerk/nextjs';

export function AuthenticatedUserMenu() {
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)]">
      <UserButton
        appearance={{
          elements: {
            avatarBox: 'h-7 w-7',
            userButtonPopoverCard: 'border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)]',
            userButtonPopoverActionButton: 'text-[var(--text-primary)] hover:bg-[var(--surface-hover)]',
            userButtonPopoverActionButtonText: 'text-[var(--text-primary)]',
            userButtonPopoverFooter: 'hidden',
          },
        }}
      />
    </div>
  );
}
