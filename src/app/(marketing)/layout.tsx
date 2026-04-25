import type { Metadata } from "next"
import { Navbar } from "@/components/marketing/navbar"
import { Footer } from "@/components/marketing/footer"

export const metadata: Metadata = {
  title: "FlowSet CRM — CRM simples para times que querem vender mais",
  description:
    "Gerencie leads, acompanhe negócios no pipeline Kanban e feche mais vendas. Grátis para começar, sem cartão de crédito.",
  openGraph: {
    title: "FlowSet CRM",
    description:
      "CRM simples para freelancers e times comerciais. Pipeline Kanban, gestão de leads e dashboard de métricas.",
    url: "https://flowset.com.br",
    siteName: "FlowSet CRM",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FlowSet CRM — CRM simples para times que querem vender mais",
    description:
      "Gerencie leads, pipeline e métricas de vendas. Grátis para começar.",
  },
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}
