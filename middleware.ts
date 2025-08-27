import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // Rotas que não precisam de autenticação
  const publicRoutes = ["/", "/api/auth", "/_next", "/favicon.ico", "/simple"];

  // Rotas que precisam de autenticação
  const protectedRoutes = ["/dashboard", "/project"];

  const { pathname } = request.nextUrl;

  // Permitir acesso a rotas públicas e assets
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Verificar se é uma rota protegida
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    // Verificar se existe cookie de sessão do Better Auth
    const sessionToken = request.cookies.get("better-auth.session_token");

    if (!sessionToken) {
      // Redirecionar para a landing page se não estiver autenticado
      const loginUrl = new URL("/", request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Se existe token de sessão, permitir acesso
    // A validação completa será feita no lado do cliente
    return NextResponse.next();
  }

  // Para outras rotas, permitir acesso
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
