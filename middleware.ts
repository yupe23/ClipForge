import { clerkMiddleware } from '@clerk/nextjs/server';

const protectedRoutes = ['/dashboard', '/projects'];

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;
  const isProtectedRoute = protectedRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

  if (isProtectedRoute) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
    '/__clerk/(.*)',
  ],
};
