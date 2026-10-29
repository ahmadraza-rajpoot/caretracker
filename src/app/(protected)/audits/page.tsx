import AuditTable from "@/components/audits/AuditTable"
import Header from "@/components/audits/Header"
import Loader from "@/components/Loader"
import { getAuditData } from "@/lib/data/audits"
import { connection } from "next/server"
import { Suspense } from "react"


const Audits = async () => {
  await connection();
  const auditData = await getAuditData()
  
  return (
    <Suspense fallback={<Loader />}>
      <div>
        <Header />
        <AuditTable auditData = {auditData} />
      </div>
    </Suspense>
  )
}

export default Audits