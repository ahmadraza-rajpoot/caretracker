
import { connection } from "next/server";
import NavBar from "@/components/NavBar";
import CardContainer from "./CardContainer";
import { getCurrentUser } from "@/lib/data/user";


export default async function DashboardContent() {
  await connection();
 const user =  await getCurrentUser();
  return (
    <>
      <NavBar />
      <main className="p-6">
        <h1 className="mb-4 text-2xl text-gray-700 font-semibold">Welcome, <span className="text-indigo-500">{user?.user_metadata.name}</span></h1>
        <CardContainer />
      </main>
    </>
  );
}
