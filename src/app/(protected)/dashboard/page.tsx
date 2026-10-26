import { Suspense } from "react";
import DashboardContent from "@/components/DashboardContent";
import NoOrganization from "@/components/noOrganizations";


export default function ProtectedDashboard() {
  const hasOrganization = true;

  if (!hasOrganization) {
    return <NoOrganization />;
  }

  return (
    <Suspense fallback={<div className="h-16 animate-pulse border-b bg-muted/30" > Loading..</div> }>
      <DashboardContent />
    </Suspense>
  );
}
