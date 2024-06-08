/* next */
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
	const token = request.cookies.get('token')?.value;
	if (
		!token &&
		!request.nextUrl.pathname.startsWith('/login') &&
		!request.nextUrl.pathname.startsWith('/register')
	) {
		return Response.redirect(new URL('/login', request.url));
	}
}

export const config = {
	matcher: ['/dashboard', '/debt/:path*', '/payment-plan/:path*'],
};
