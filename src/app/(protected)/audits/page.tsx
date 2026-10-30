import AuditTable from "@/components/audits/AuditTable";
import Header from "@/components/audits/Header";
import Loader from "@/components/Loader";
import { getAuditData } from "@/lib/data/audits";
import { connection } from "next/server";
import { Suspense } from "react";

type AuditStatus = "Draft" | "In progress" | "Completed";
interface Audit {
  id: string;
  name: string;
  department: string;
  auditDate: string; // ISO date
  status: AuditStatus;
  createdBy: string;
  findings: number;
}

async function AuditData() {
  await connection();
  const auditData = await getAuditData();



  return <AuditTable auditData={auditData} />;
}

const Audits = () => {

  return (
    <div>
      <Header />

      <Suspense fallback={<Loader />}>
        <AuditData />
      </Suspense>
    </div>
  );
};

export default Audits;