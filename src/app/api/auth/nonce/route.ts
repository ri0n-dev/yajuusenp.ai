import { NextResponse } from "next/server"
import crypto from "crypto"

export async function GET() {
  const nonce = crypto.randomBytes(16).toString("hex")
  const response = NextResponse.json({ nonce })
  response.cookies.set("nonce", nonce, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 300,
  })
  return response
}
