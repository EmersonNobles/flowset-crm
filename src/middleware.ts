import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Renova a sessão e obtém o usuário autenticado
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Rotas públicas — qualquer outra rota requer autenticação
  const PUBLIC_PATHS = [
    "/",
    "/login",
    "/cadastro",
    "/recuperar-senha",
    "/nova-senha",
  ]
  const PUBLIC_PREFIXES = ["/invite/", "/api/", "/auth/"]

  const isPublic =
    PUBLIC_PATHS.includes(pathname) ||
    PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))

  const isAuthOnlyPath = ["/login", "/cadastro", "/recuperar-senha"].includes(pathname)

  // Usuário logado na raiz ou em páginas de auth → redireciona para dashboard
  if (user && (pathname === "/" || isAuthOnlyPath)) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Usuário não logado tentando acessar rota protegida → redireciona para login
  if (!user && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
