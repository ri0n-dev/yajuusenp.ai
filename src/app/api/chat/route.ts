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
    const token = req.cookies.get("auth_token")?.value
    const user = token ? await verify(token) : null

    if (!user) {
        return new NextResponse("Unauthorized - Agreement required", { status: 401 })
    }

    const { message } = await req.json()

    const chat = await openai.chat.completions.create({
        model: "gpt-4o",
        messages:
            [
                { role: "user", content: message }
            ],
    })

    const aiMessage = chat.choices[0].message.content
    return NextResponse.json({ result: aiMessage })
}
