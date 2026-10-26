import { cache } from "react";

import { createClient } from "../supabse/server";
import { getCurrentUser } from "./user";

type MembershipWithOrg = {
    organization_id:string,
    role:string,
    organizations: { org_name: string , slug:string} | null;
};

export const getCurrentOrganization = cache(async ()=>{

    const user = await getCurrentUser();

    if(!user){
        return null;
    }

    const supabase = await createClient();

    const {data, error} = await supabase.from("organization_members")
    .select("organization_id, role, organizations(org_name, slug)")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle<MembershipWithOrg>();

    if(error){
        console.log("error while fetching data", error.message);
        return null;
    }

    if(!data?.organizations){
        return null;
    }

    return {
        id: data.organization_id,
        name: data.organizations.org_name,
        slug: data.organizations.slug,
        role: data.role
    }

})