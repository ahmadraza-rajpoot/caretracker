import { connection } from "next/server";
import NavBar from "@/components/NavBar";

export default async function DashboardContent() {
  await connection();

  return (
    <>
      <NavBar />
      <main className="p-6">
        <h1>Dashboard page</h1>
      </main>
    </>
  );
}
