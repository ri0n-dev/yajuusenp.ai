import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
import { jwtVerify } from "jose"

const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET)

const openai = new OpenAI({
    baseURL: "https://api.voids.top/v1",
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

        const gptOptimization = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system", content: 'ユーザーのメッセージの情報が正しいか、やり方が正しいかどうかを判断するために、ウェブ検索（フレーズ検索）できるように、最適化し、英語にしてください。'
                },
                {
                    role: "user", content: message
                }
            ]
        });

        const optimized = gptOptimization.choices[0].message.content

        const langSearchResp = await fetch("https://api.langsearch.com/v1/web-search", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${process.env.LANGSEARCH_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                query: optimized,
            })
        });

        if (!langSearchResp.ok) {
            throw new Error(`LangSearch API error: ${langSearchResp.status}`)
        }
        const langSearchJson = await langSearchResp.json()

        const summary = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system", content:
                        `現在は日本時間で ${humanReadable}（ISO: ${iso}）です。` +
                        'あなたは、ウェブ検索の結果を分析し、1つの明確で丁寧な結論を出すエージェントです。' +
                        '検索結果は最新な情報であり、正確なものです。' +
                        'ユーザーの内容と検索の内容で古いやり方や情報を扱っている場合は指摘してください。' +
                        '文法や語調ではなく、情報の正確性について結論づけてください。マークダウンは使用せず、短い**日本語の文章**で結論を述べてください。'
                },
                {
                    role: "user", content: message
                },
                {
                    role: "assistant", content: `検索結果: ${JSON.stringify(langSearchJson)}`
                }
            ]
        })

        return NextResponse.json({ result: summary.choices[0].message.content, optimized, langSearchJson })
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