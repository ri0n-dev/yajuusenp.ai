import { NextResponse } from "next/server"
import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET)

export async function POST(req: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value

  const text = await req.text()

  if (!text) {
    if (!token) {
      return NextResponse.json({ authenticated: false })
    }
    try {
      await jwtVerify(token, SECRET)
      return NextResponse.json({ authenticated: true })
    } catch {
      return NextResponse.json({ authenticated: false })
    }
  }

  let json
  try {
    json = JSON.parse(text)
  } catch {
    return new NextResponse("Invalid JSON in request body", { status: 400 })
  }

  const { nonce } = json
  const cookieNonce = cookieStore.get("nonce")?.value

  if (!nonce || nonce !== cookieNonce) {
    return new NextResponse("Invalid or expired nonce", { status: 400 })
  }

  const jwt = await new SignJWT({ agreed: true, user: "guest" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .sign(SECRET)

  const res = NextResponse.json({ ok: true, authenticated: true })
  res.cookies.set("auth_token", jwt, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  })
  res.cookies.set("nonce", "", { maxAge: 0, path: "/" })

  return res
}
