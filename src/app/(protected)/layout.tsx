import { createClient } from "@/lib/supabse/server"
import { connection } from "next/server"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import SideBar from "@/components/sideBar"

type children = {
    children: React.ReactNode;
}

const ProtectedContent = async({children}:children) => {

    await connection();

    const supabase = await createClient();

    const {data:{user}, error} = await supabase.auth.getUser();

    if(!user || error){
        redirect("/login")
    }

    return (<>{children}</>
  )
}


export default function ProtectedLayout({children}:children){

    return(
        <Suspense fallback={<div>Loading.....</div>}>
            <ProtectedContent>
                <div className="flex min-h-screen">
                    
                    <SideBar />

                    <main className="flex-1">
                        {children}
                    </main>
                    
                </div>
                
            </ProtectedContent>
        </Suspense>
    )
}