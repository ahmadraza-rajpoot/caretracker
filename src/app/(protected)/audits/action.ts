'use server'

import { createClient } from "@/lib/supabse/server";
import { getCurrentOrganization } from "@/lib/data/organization";
import { revalidatePath } from "next/cache";


export async function deleteAudit(auditId:string){

    if(!auditId){
        return {error:"Invalid audit id"}
    }

    const organization = await getCurrentOrganization();

    if(!organization){
        return {error:"Orgnization not found"}
    }

    const supabase = await createClient();

    const {error} = await supabase.from("audits")
    .delete()
    .eq("id", auditId)
    .eq("organization_id", organization.id);

    if(error){
        return {
            error:"Error while deleting the audit"
        }
    }

    revalidatePath("/audits");

    return {
        success:true
    }
}