'use client'

import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabse/client"
import { LogOut } from "lucide-react"

const LogoutButton = () => {
    const router = useRouter();

    const handleClick = async () =>{
        const supabase = createClient();

        const {error} = await supabase.auth.signOut()
        if(error){
            console.log(error);
            return;
        }

        router.replace('/login');
        router.refresh()
    }

  return (
        <button
            onClick={handleClick}
          className="flex hover:cursor-pointer w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={19} strokeWidth={1.8} />
          <span>Logout</span>
        </button>
  )
}

export default LogoutButton