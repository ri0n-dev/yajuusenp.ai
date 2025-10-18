import type { Metadata } from "next";

const url = "https://yajuusenp.ai/";
const icon = "/favicon.ico";
const ogpIcon = "/ogp.png";
const siteName = "Yajuusenp.AI";
const description = "野獣先輩と会話するという夢を持っている人たちのために作られました。野獣先輩と会話したい？野獣先輩と遊びたい？野獣先輩にコーディングしてほしい？そんなあなたはぜひチェックしてください！";

export const metadata: Metadata = {
    metadataBase: new URL(url),
    title: {
        default: `${siteName}`,
        template: `%s / ${siteName}`
    },
    description,
    openGraph: {
        title: siteName,
        description,
        url,
        siteName,
        locale: "ja-JP",
        type: "website",
        images: ogpIcon
    },
    icons: icon,
    verification: {
        google: ""
    },
    publisher: `@ri0n_dev`,
    robots: "index, follow",
    creator: `@ri0n_dev`,
    keywords: ["Yajuusenpai", "Yajuu", "Yajuusenp.ai", "YAJUUSENP.AI"],
};