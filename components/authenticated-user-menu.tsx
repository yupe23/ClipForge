'use client';

import { UserButton } from '@clerk/nextjs';

export function AuthenticatedUserMenu() {
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-950/70">
      <UserButton
        appearance={{
          elements: {
            avatarBox: 'h-7 w-7',
            userButtonPopoverCard: 'border border-slate-800 bg-slate-950 text-slate-100',
            userButtonPopoverActionButton: 'text-slate-200 hover:bg-slate-900',
            userButtonPopoverActionButtonText: 'text-slate-200',
            userButtonPopoverFooter: 'hidden',
          },
        }}
      />
    </div>
  );
}
