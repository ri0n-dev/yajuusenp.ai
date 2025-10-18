import { NextRequest, NextResponse } from "next/server"

interface RateLimitEntry {
    count: number
    resetTime: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of rateLimitStore.entries()) {
        if (now > entry.resetTime) {
            rateLimitStore.delete(key)
        }
    }
}, 60000)

export function rateLimit(req: NextRequest): NextResponse | null {
    const forwarded = req.headers.get("x-forwarded-for")
    const ip = forwarded ? forwarded.split(",")[0].trim() : 
               req.headers.get("x-real-ip") || 
               "unknown"

    const now = Date.now()
    const windowMs = 60000
    const maxRequests = 20

    const entry = rateLimitStore.get(ip)

    if (!entry || now > entry.resetTime) {
        rateLimitStore.set(ip, {
            count: 1,
            resetTime: now + windowMs
        })
        return null
    }

    if (entry.count >= maxRequests) {
        const resetIn = Math.ceil((entry.resetTime - now) / 1000)
        return new NextResponse(
            JSON.stringify({
                error: "レート制限に達しました",
                message: `1分間に${maxRequests}回までのリクエストが許可されています。${resetIn}秒後に再試行してください。`
            }),
            {
                status: 429,
                headers: {
                    "Content-Type": "application/json",
                    "Retry-After": String(resetIn),
                    "X-RateLimit-Limit": String(maxRequests),
                    "X-RateLimit-Remaining": "0",
                    "X-RateLimit-Reset": String(entry.resetTime)
                }
            }
        )
    }

    entry.count++
    rateLimitStore.set(ip, entry)

    return null
}

export function getRateLimitHeaders(req: NextRequest): Record<string, string> {
    const forwarded = req.headers.get("x-forwarded-for")
    const ip = forwarded ? forwarded.split(",")[0].trim() : 
               req.headers.get("x-real-ip") || 
               "unknown"

    const entry = rateLimitStore.get(ip)
    const maxRequests = 30

    if (!entry) {
        return {
            "X-RateLimit-Limit": String(maxRequests),
            "X-RateLimit-Remaining": String(maxRequests),
        }
    }

    return {
        "X-RateLimit-Limit": String(maxRequests),
        "X-RateLimit-Remaining": String(Math.max(0, maxRequests - entry.count)),
        "X-RateLimit-Reset": String(entry.resetTime)
    }
}
