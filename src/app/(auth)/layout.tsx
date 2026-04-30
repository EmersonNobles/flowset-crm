import { Zap } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="flex items-center gap-2 mb-8">
        <Zap className="h-7 w-7 text-primary" />
        <span className="text-xl font-bold text-foreground">FlowSet</span>
      </div>
      {children}
    </div>
  );
}
