import Link from "next/link"

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8">
      <Link href="/" className="font-display font-bold text-xl tracking-tight mb-8">
        Flow<span className="text-primary">Set</span>
      </Link>
      <div className="w-full max-w-md">{children}</div>
    </div>
  )
}
