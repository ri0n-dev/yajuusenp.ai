import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
import { jwtVerify } from "jose"
import { getSystemPrompt, type PromptType } from "@/prompts"

const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET)

const allowedPrompts: PromptType[] = ["yajuu", "kona"]

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

    const { message, model, prompt } = await req.json()

    console.log("Request data:", {
        hasMessage: !!message,
        messageType: typeof message,
        model,
        prompt
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
        const chat = await openai.chat.completions.create({
            model: model || "gpt-5-mini-2025-08-07",
            messages: [
                { role: "system", content: `${charaPrompt}\n\n現在は日本時間で ${humanReadable}（ISO: ${iso}）です。` },
                { role: "user", content: `${user.name} ${message}` }
            ],
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

        const result = chat.choices[0].message.content;

        if (!result) {
            console.error("Empty content in response");
            return new NextResponse("Empty response from AI", { status: 500 });
        }

        console.log("Returning result:", { resultLength: result.length });
        return NextResponse.json({ result });

    } catch (error) {
        console.error("OpenAI API Error:", error);
        return new NextResponse("AI service error", { status: 500 });
    }
}