import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
import { jwtVerify } from "jose"
import { rateLimit, getRateLimitHeaders } from "@/lib/rate-limit"

const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET)

const openai = new OpenAI({
    baseURL: "https://capi.voids.top/v2",
    apiKey: "no_api_key_needed",
})

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
    try {
        const rateLimitResponse = rateLimit(req)
        if (rateLimitResponse) {
            return rateLimitResponse
        }

        const token = req.cookies.get("auth_token")?.value
        const user = token ? await verify(token) : null

        if (!user) {
            return new NextResponse("Unauthorized - Agreement required", { status: 401 })
        }

        const { message } = await req.json()
        if (!message) {
            return new NextResponse("Invalid request - message is required", { status: 400 })
        }

        const now = new Date();
        const formatter = new Intl.DateTimeFormat("ja-JP", {
            timeZone: "Asia/Tokyo",
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "short",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: false,
        });
        const humanReadable = formatter.format(now).replace("曜日", "）").replace(/^(.+?)（/, "$1（");
        const iso = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" })).toISOString();

        const soner = await openai.chat.completions.create({
            model: "sonar-pro",
            messages: [
                {
                    role: "system",
                    content: `現在は日本時間で ${humanReadable}（ISO: ${iso}）です。` +
                        'あなたは、ウェブ検索の結果を分析し、1つの明確で丁寧な結論を出すエージェントです。' +
                        'ユーザーの内容と検索の内容で古いやり方や情報を扱っている場合は指摘してください。' +
                        '文法や語調ではなく、情報の正確性について結論づけてください。マークダウンは使用せず、短い**日本語の文章**で結論を述べてください。' +
                        'あなたは思考の過程をユーザーに出力してはいけません。[thinking] や思考過程は返さず、最終的な答えだけを返してください。',
                },
                {
                    role: "user", content: message
                }
            ]
        });

        const result = soner.choices[0].message.content
        
        const headers = getRateLimitHeaders(req)
        return NextResponse.json({ result }, { headers })
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
        console.error("Error in fact check API:", error)
        return NextResponse.json(
            {
                error: "Internal server error",
                details: errorMessage
            },
            { status: 500 }
        )
    }
}