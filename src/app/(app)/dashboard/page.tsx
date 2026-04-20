import { PageHeader } from "@/components/crm/page-header";

export default function DashboardPage() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Visão geral do seu pipeline e métricas"
      />
      <p className="text-muted-foreground text-sm">Em breve: gráficos e métricas (M5)</p>
    </div>
  );
}
