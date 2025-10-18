import { Analytics } from "@vercel/analytics/next"
import { Noto_Sans_JP } from "next/font/google";
import { Toaster } from "sonner"
import "@/styles/globals.css";

export { metadata as metadata } from "@/consts/metadata";

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

        <Toaster className="shadow-none border border-neutral-200" position="top-center" />
        <Analytics />
      </body>
    </html>
  );
}
