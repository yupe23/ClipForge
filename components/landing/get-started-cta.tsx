import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { VariantProps } from 'class-variance-authority';
import type { Route } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';

export function getStartedHref(isSignedIn: boolean): Route {
  return (isSignedIn ? '/dashboard' : '/sign-up') as Route;
}

type GetStartedCtaProps = VariantProps<typeof buttonVariants> & {
  children?: ReactNode;
  className?: string;
  isSignedIn: boolean;
};

export function GetStartedCta({
  children = 'Get Started',
  className,
  isSignedIn,
  size = 'default',
  variant = 'default',
}: GetStartedCtaProps) {
  return (
    <Link
      href={getStartedHref(isSignedIn)}
      className={cn(buttonVariants({ className, size, variant }))}
    >
      {children}
    </Link>
  );
}
