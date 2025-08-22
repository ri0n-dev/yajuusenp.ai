import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
import { jwtVerify } from "jose"
import { getSystemPrompt, type ModelType } from "@/prompts"

const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET)

const openai = new OpenAI({
    baseURL: "https://capi.voids.top/v2/",
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
    const token = req.cookies.get("auth_token")?.value
    const user = token ? await verify(token) : null

    if (!user) {
        return new NextResponse("Unauthorized - Agreement required", { status: 401 })
    }

    const { message, model } = await req.json()

    if (!model || model !== "yajuu") {
        return new NextResponse("Invalid model", { status: 400 })
    }

    const charaPrompt = getSystemPrompt(model as ModelType);

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

    const chat = await openai.chat.completions.create({
        model: "gpt-5-mini-2025-08-07",
        messages:
            [
                { role: "system", content: `${charaPrompt}\n\n現在は日本時間で ${humanReadable}（ISO: ${iso}）です。` },
                { role: "user", content: message }
            ],
    })

    const aiMessage = chat.choices[0].message.content
    return NextResponse.json({ result: aiMessage })
}