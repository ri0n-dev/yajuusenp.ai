import { GoogleAnalytics } from "@next/third-parties/google";
import { Noto_Sans_JP } from "next/font/google";
import { Toaster } from "sonner"
import type { Metadata } from "next";
import "@/styles/globals.css";

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

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  display: "swap",
  subsets: ["latin"],
  preload: true,
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body className={`${notoSansJP.variable} font-(family-name:--font-noto-sans-jp) antialiased bg-neutral-100`}>
        <div className="w-full max-w-4xl mx-auto pb-32 px-3">
          {children}
        </div>

        <Toaster position="top-center" />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
