import { type NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"
import { rateLimit, getRateLimitHeaders } from "@/lib/rate-limit"

const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET)

async function verify(token: string) {
    try {
        const { payload } = await jwtVerify(token, SECRET)
        if (payload.agreed === true) return payload
        return null
    } catch {
        return null
    }
}

export async function POST(req: NextRequest) {
    const rateLimitResponse = rateLimit(req)
    if (rateLimitResponse) {
        return rateLimitResponse
    }

    const token = req.cookies.get("auth_token")?.value
    if (!(token && await verify(token))) {
        return new NextResponse("Unauthorized - Agreement required", { status: 401 })
    }

    const { url } = await req.json()
    if (!url) {
        return new NextResponse("URL is required", { status: 400 })
    }

    const apiKey = process.env.XGD_API_KEY
    const res = await fetch(`https://xgd.io/V1/shorten?url=${encodeURIComponent(url)}&key=${apiKey}&filterbots=true&analytics=false`)
    if (!res.ok) {
        return new NextResponse("Failed to shorten URL", { status: 500 })
    }

    const data = await res.json()

    const headers = getRateLimitHeaders(req)
    return NextResponse.json({ shorturl: data.shorturl }, { headers })
}