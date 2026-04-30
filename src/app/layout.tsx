import type { Metadata } from "next";
import { Gloock, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const gloock = Gloock({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FlowSet CRM",
  description: "Plataforma de gestão de clientes e vendas para PMEs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${gloock.variable} ${inter.variable} ${ibmPlexMono.variable} dark`}
    >
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
