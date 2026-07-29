import { NextRequest, NextResponse } from 'next/server';
import { auth } from './auth';

const publicRoutes = ['/'];

export default async function middleware(req: NextRequest) {
  if (!publicRoutes.includes(req.nextUrl.pathname)) {
    const session = await auth();
    if (!session) {
      return NextResponse.redirect(new URL('/', req.nextUrl));
    }
  }
  return NextResponse.next();
}

// Routes middleware should not run on
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
