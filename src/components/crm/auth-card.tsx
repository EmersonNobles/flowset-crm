interface AuthCardProps {
  title: string
  description: string
  children: React.ReactNode
}

export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <div className="w-full max-w-sm bg-card border border-white/8 rounded-[14px] p-7 shadow-2xl">
      <h1 className="font-display text-2xl tracking-tight text-foreground mb-1">{title}</h1>
      <p className="text-sm text-muted-foreground mb-6">{description}</p>
      {children}
    </div>
  )
}
