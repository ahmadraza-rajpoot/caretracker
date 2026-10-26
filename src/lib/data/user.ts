import {cache} from "react"
import { createClient } from "../supabse/server"


export const getCurrentUser = cache(async ()=>{

    const supabase = await createClient();

    const {data:{user}, error} = await supabase.auth.getUser();

    if(!user || error){
        console.log(error)
        return null
    }

    return user
})