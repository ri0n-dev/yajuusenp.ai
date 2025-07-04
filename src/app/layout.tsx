import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "@/styles/globals.css";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Yajuusenp.AI",
  description: "Would you like to talk with Yaju Senpai, Koji Tadokoro? If so, be sure to check it out!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${notoSansJP.variable} font-(family-name:--font-noto-sans-jp) antialiased bg-neutral-100`}>
        {children}
      </body>
    </html>
  );
}
