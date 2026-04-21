interface AuthCardProps {
  title: string
  description: string
  children: React.ReactNode
}

export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <div className="w-full max-w-sm bg-card border border-border rounded-lg p-6 shadow-sm">
      <h1 className="text-xl font-bold text-foreground mb-1">{title}</h1>
      <p className="text-sm text-muted-foreground mb-6">{description}</p>
      {children}
    </div>
  )
}
