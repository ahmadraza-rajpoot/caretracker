import { Suspense } from "react";
import DashboardContent from "@/components/DashboardContent";
import NoOrganization from "@/components/noOrganizations";
import Loader from "@/components/Loader";


export default function ProtectedDashboard() {
  const hasOrganization = true;

  if (!hasOrganization) {
    return <NoOrganization />;
  }

  return (
    <Suspense fallback={<Loader/>}>
      
      <main className="bg-[#F8FAFC] h-full">
        <DashboardContent />
      </main>
      
      
    </Suspense>
  );
}
