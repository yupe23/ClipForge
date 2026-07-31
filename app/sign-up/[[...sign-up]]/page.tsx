import { SignUp } from '@clerk/nextjs';
import { Clapperboard } from 'lucide-react';
import Link from 'next/link';

const clerkAppearance = {
  elements: {
    cardBox: 'bg-transparent shadow-none',
    card: 'bg-[var(--surface)] border border-[var(--border)] shadow-sm',
    headerTitle: 'text-[var(--text-primary)]',
    headerSubtitle: 'text-[var(--text-secondary)]',
    socialButtonsBlockButton: 'border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] hover:bg-[var(--surface-hover)]',
    formFieldLabel: 'text-[var(--text-primary)]',
    formFieldInput: 'border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]',
    footerActionText: 'text-[var(--text-secondary)]',
    footerActionLink: 'text-[var(--brand)] hover:text-[var(--accent-hover)]',
    dividerLine: 'bg-[var(--border)]',
    dividerText: 'text-[var(--text-secondary)]',
    formButtonPrimary: 'bg-[var(--accent)] text-[var(--accent-foreground)] hover:bg-[var(--accent-hover)]',
  },
};

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-6 text-[var(--text-primary)] sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-md flex-col justify-center gap-6">
        <Link href="/" className="flex items-center gap-3 self-center text-[var(--brand)]">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--brand)]/30 bg-[var(--brand-soft)]">
            <Clapperboard className="h-5 w-5" aria-hidden="true" />
          </div>
          <span className="text-sm font-semibold uppercase tracking-[0.24em]">CLIPFORGE</span>
        </Link>

        <SignUp
          appearance={clerkAppearance}
          path="/sign-up"
          routing="path"
        />
      </div>
    </main>
  );
}
