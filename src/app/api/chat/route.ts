import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
import { jwtVerify } from "jose"
import { getSystemPrompt, type PromptType } from "@/prompts"
import { rateLimit, getRateLimitHeaders } from "@/lib/rate-limit"

const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET)

const allowedPrompts: PromptType[] = ["normal", "yajuu", "kona"]

const voids = new OpenAI({
    baseURL: "https://capi.voids.top/v2/",
    apiKey: "yajuu_no_kokoro_no_naka_ni_aru_sa_www",
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
    const rateLimitResponse = rateLimit(req)
    if (rateLimitResponse) {
        return rateLimitResponse
    }

    const token = req.cookies.get("auth_token")?.value
    if (!(token && await verify(token))) {
        return new NextResponse("Unauthorized - Agreement required", { status: 401 })
    }

    const username = req.cookies.get("name")?.value || "ユーザー"

    const { message, model, prompt, history } = await req.json()

    console.log("Request data:", {
        hasMessage: !!message,
        messageType: typeof message,
        model,
        prompt,
        historyLength: history?.length || 0
    });

    if (!message || typeof message !== "string" || message.trim() === "") {
        return new NextResponse("Invalid or missing message", { status: 400 })
    }

    if (!prompt || !allowedPrompts.includes(prompt as PromptType)) {
        return new NextResponse("Invalid or missing prompt", { status: 400 })
    }

    if (!model || typeof model !== "string") {
        return new NextResponse("Invalid or missing model", { status: 400 })
    }

    const charaPrompt = getSystemPrompt(prompt as PromptType);

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

    try {
        const messages: Array<{ role: "system" | "user" | "assistant", content: string }> = [
            { role: "system", content: `ユーザーの名前は${username}です。\n\n${charaPrompt}\n\n現在は日本時間で ${humanReadable}（ISO: ${iso}）です。` }
        ];

        if (history && Array.isArray(history)) {
            for (const msg of history) {
                if (msg.content &&
                    msg.content !== "[thinking]" &&
                    msg.content !== "[stop]" &&
                    !msg.isThinking &&
                    typeof msg.content === "string" &&
                    msg.content.trim() !== "") {

                    const role = msg.sender?.role === "ai" ? "assistant" : "user";
                    messages.push({ role, content: msg.content });
                }
            }
        }

        messages.push({ role: "user", content: message });

        const chat = await voids.chat.completions.create({
            model: model || "gpt-4o-mini",
            messages,
            max_tokens: 4096,
        });

        console.log("Chat response received:", {
            id: chat.id,
            model: chat.model,
            choices: chat.choices?.length || 0,
            usage: chat.usage
        });

        if (!chat.choices || chat.choices.length === 0) {
            console.error("No choices in response");
            return new NextResponse("No response from AI", { status: 500 });
        }

        let result = chat.choices[0].message.content;

        if (!result) {
            console.error("Empty content in response");
            return new NextResponse("Empty response from AI", { status: 500 });
        }

        result = result.replace(/\[thinking\]([\s\S]*?)\[\/thinking\]/g, "")

        const headers = getRateLimitHeaders(req)
        return NextResponse.json({ result }, { headers });

    } catch (error) {
        console.error("OpenAI API Error:", error);
        return new NextResponse("AI service error", { status: 500 });
    }
}