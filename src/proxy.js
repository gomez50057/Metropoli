// src/proxy.js (DESPUÉS)

import { NextResponse } from 'next/server';

export function proxy(request) {
    // Verifica si la ruta es el dashboard
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
        const token = request.cookies.get('authToken');

        // Si no hay token de autenticación, redirige a la página de login
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // Continuar con la solicitud si está autenticado
    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*'], // Protege todas las rutas bajo /dashboard
};
