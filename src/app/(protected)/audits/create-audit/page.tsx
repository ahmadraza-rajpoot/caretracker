import CreateAuditForm from "@/components/audits/AuditForm";
import Loader from "@/components/Loader";
import { getCurrentAuditData } from "@/lib/data/audits";
import { connection } from "next/server";
import { Suspense } from "react";

type PageProps = {
  searchParams: Promise<{ id?: string }>;
};

async function AuditDataCom({
  searchParams,
}: PageProps) {
  await connection();

  const { id } = await searchParams;

  console.log(id);

  const data = id
    ? await getCurrentAuditData(id)
    : null;

  return <CreateAuditForm data={data} id={id} />;
}

export default function Page({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<Loader />}>
      <AuditDataCom searchParams={searchParams} />
    </Suspense>
  );
}