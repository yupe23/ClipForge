import { auth } from '@clerk/nextjs/server';
import { LandingPage } from '@/components/landing/landing-page';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const { userId } = await auth();

  if (userId) {
    redirect('/dashboard');
  }

  return <LandingPage />;
}
