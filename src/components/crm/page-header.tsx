import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  action?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, breadcrumbs, action, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4 mb-6", className)}>
      <div className="min-w-0">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1 mb-1">
            {breadcrumbs.map((item, index) => (
              <span key={index} className="flex items-center gap-1">
                {index > 0 && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
                {item.href ? (
                  <a href={item.href} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                    {item.label}
                  </a>
                ) : (
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <h1 className="font-display text-xl sm:text-2xl text-foreground tracking-tight truncate">{title}</h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-0.5 truncate">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0 self-start">{action}</div>}
    </div>
  );
}
