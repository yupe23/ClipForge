import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { Button } from '@/components/ui/button';

export default async function NotFound() {
  const { userId } = await auth();

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4 py-12 text-[var(--text-primary)] sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center shadow-sm sm:p-12">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">404</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.06em] text-[var(--text-primary)] sm:text-6xl">
          Page not found
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-[var(--text-secondary)] sm:text-lg">
          The page you were looking for doesn’t exist or may have moved. Let’s get you back to a safe place.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="inline-flex">
            <Button variant="default" size="lg">Back to Home</Button>
          </Link>

          {userId ? (
            <Link href="/dashboard" className="inline-flex">
              <Button variant="secondary" size="lg">Go to Dashboard</Button>
            </Link>
          ) : (
            <Link href="/sign-in" className="inline-flex">
              <Button variant="secondary" size="lg">Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
