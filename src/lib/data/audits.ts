'use server'

import { createClient } from "../supabse/server"
import { getCurrentOrganization } from "./organization";
import { cache } from "react";

export const getAuditData = cache( async ()=>{
    const organization = await getCurrentOrganization()
    const supabase = await createClient();
    
    const {data, error} = await supabase.from("audits")
    .select("*, profiles(full_name)")
    .eq("organization_id", organization?.id)

    if(error){
        console.log("Error while fetching audit data")
        return []
    }

    const auditData = data.map((audit, idx)=>(
        {
            id:audit.id,
            name:audit.title,
            department:audit.department,
            auditDate:audit.audit_date,
            status:audit.status,
            createdBy:audit.profiles?.full_name??"Unknown",
            findings:0
        }
    ))

    console.log(auditData)

    return auditData

   
})


export const getCurrentAuditData = cache(async (id:string)=>{

    const organization = await getCurrentOrganization();

    if(!organization){
        return {
            error:"No orgnization found"
        }
    }

    const supabase = await createClient();

    const {data, error} = await supabase.from("audits")
    .select("title, department, audit_date, status, description")
    .eq("id",id)
    .eq("organization_id", organization.id)

    if(error){
        return {error: error.message}
    }


    console.log(data)
    return {
        data
    }
})