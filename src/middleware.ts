import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isOnAuthPage = req.nextUrl.pathname === '/login'
  const isOnOnboarding = req.nextUrl.pathname === '/onboarding'
  const isProtectedRoute = ['/dashboard', '/workout', '/progress', '/nutrition'].some(
    path => req.nextUrl.pathname.startsWith(path)
  )

  // ถ้าไม่ได้ login และเข้าหน้าที่ต้อง login
  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  // ถ้า login แล้วและเข้าหน้า login
  if (isOnAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
  }

  // ถ้าเข้าหน้า onboarding และไม่ได้ login
  if (isOnOnboarding && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/workout/:path*',
    '/progress/:path*',
    '/nutrition/:path*',
    '/onboarding',
    '/login',
  ],
}
