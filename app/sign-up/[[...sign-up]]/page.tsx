import { SignUp } from '@clerk/nextjs';
import { Clapperboard } from 'lucide-react';
import Link from 'next/link';

const clerkAppearance = {
  elements: {
    cardBox: 'bg-transparent shadow-none',
    card: 'bg-slate-900/75 border border-slate-800/80 shadow-sm',
    headerTitle: 'text-slate-50',
    headerSubtitle: 'text-slate-400',
    socialButtonsBlockButton: 'border-slate-800 bg-slate-950/80 text-slate-100 hover:bg-slate-900',
    formFieldLabel: 'text-slate-300',
    formFieldInput: 'border-slate-800 bg-slate-950/80 text-slate-100 placeholder:text-slate-600',
    footerActionText: 'text-slate-400',
    footerActionLink: 'text-sky-300 hover:text-sky-200',
    dividerLine: 'bg-slate-800',
    dividerText: 'text-slate-500',
    formButtonPrimary: 'bg-[var(--accent)] text-[var(--text-primary)] hover:bg-[var(--accent-hover)]',
  },
};

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-[#05070B] px-4 py-6 text-[var(--text-primary)] sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-md flex-col justify-center gap-6">
        <Link href="/" className="flex items-center gap-3 self-center text-sky-400">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-sky-400/30 bg-sky-400/10">
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
