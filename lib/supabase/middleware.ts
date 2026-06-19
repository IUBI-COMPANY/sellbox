import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const isConfigured = 
    supabaseUrl && 
    supabaseUrl.startsWith('http') && 
    !supabaseUrl.includes('your-project-url-here') &&
    supabaseAnonKey && 
    !supabaseAnonKey.includes('your-anon-key-here') &&
    !supabaseAnonKey.includes('your-publishable-key-here')

  if (!isConfigured) {
    // If Supabase environment variables are missing, return early to prevent crashing the middleware.
    // The individual client and server utilities will throw descriptive errors when called.
    return supabaseResponse
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: DO NOT remove this line.
  // Calling getUser() refreshes the auth token and keeps the session alive.
  // Any condition-based redirects should go after this call.
  await supabase.auth.getUser()

  return supabaseResponse
}
