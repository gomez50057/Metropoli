import { NextResponse } from 'next/server';

const trimSlash = (value) => (value || '').replace(/\/+$/, '');

function apiUrl(request, path) {
    const base = trimSlash(process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL);
    if (!base) return new URL(path, request.url).toString();
    return base.endsWith('/api') ? `${base}${path.replace(/^\/api/, '')}` : `${base}${path}`;
}

export async function proxy(request) {
    const token = request.cookies.get('authToken')?.value;

    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
        const response = await fetch(apiUrl(request, '/api/dashboard/stats/'), {
            headers: {
                Authorization: `Bearer ${token}`,
                Cookie: `authToken=${token}`,
            },
            cache: 'no-store',
        });

        if (response.ok) {
            return NextResponse.next();
        }
    } catch (error) {
        // Fall through to login.
    }

    const loginUrl = new URL('/login', request.url);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete('authToken');
    return response;
}

export const config = {
    matcher: ['/dashboard/:path*'],
};
