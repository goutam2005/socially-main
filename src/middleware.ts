import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Define protected routes
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/settings',
  '/main',
  // Add more protected routes as needed
];

// Define authentication routes
const authRoutes = [
  '/auth/login',
  '/auth/signup',
  '/login',
  '/signup',
  '/register',
];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('authtoken')?.value;
  const path = request.nextUrl.pathname;

  // Check if the path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    path === route || path.startsWith(`${route}/`)
  );

  // Check if the path is an auth route
  const isAuthRoute = authRoutes.some((route) =>
    path === route || path.startsWith(`${route}/`)
  );

  // If user has a token and tries to access auth pages, redirect to dashboard
  if (isAuthRoute && token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jwtVerify(token, secret);

      // Token is valid, redirect to dashboard
      return NextResponse.redirect(new URL('/', request.url));
    } catch (error) {
      // Token is invalid, allow access to auth pages
      return NextResponse.next();
    }
  }

  // If trying to access protected routes without a token, redirect to login
  if (isProtectedRoute) {
    if (!token) {
      // Redirect to login if no token is found
      const url = new URL('/auth/login', request.url);
      url.searchParams.set('callbackUrl', path);
      return NextResponse.redirect(url);
    }

    try {
      // Verify the token
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jwtVerify(token, secret);

      // Token is valid, continue to the protected route
      return NextResponse.next();
    } catch (error) {
      // Token is invalid, redirect to login
      const url = new URL('/auth/login', request.url);
      url.searchParams.set('callbackUrl', path);
      return NextResponse.redirect(url);
    }
  }

  // For non-protected routes, continue normally
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};