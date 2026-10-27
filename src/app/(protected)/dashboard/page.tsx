import { Suspense } from "react";
import { connection } from "next/server";

import DashboardContent from "@/components/DashboardContent";
import NoOrganization from "@/components/noOrganizations";
import Loader from "@/components/Loader";
import { getCurrentOrganization } from "@/lib/data/organization";

async function DashboardData() {
  await connection();

  const hasOrganization = await getCurrentOrganization();

  if (!hasOrganization) {
    return <NoOrganization />;
  }

  return (
    <main className="bg-[#F8FAFC] h-full">
      <DashboardContent />
    </main>
  );
}

export default function ProtectedDashboard() {
  return (
    <Suspense fallback={<Loader />}>
      <DashboardData />
    </Suspense>
  );
}