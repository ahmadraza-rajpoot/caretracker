'use client'

import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { deleteAudit } from "../../action";
import { showToast } from "@/lib/utils/showToast";
import FindingsList from "@/components/findings/FindingList";


type Finding = {
  id: string;
  title: string;
  description: string;
  status: "open" | "in-progress" | "resolved";
  audit_id: string;
  due_date: string;
  severity: "low" | "medium" | "high";
  created_at: string;
  created_by: string;
  updated_at: string;
  assigned_to: string;
  organization_id: string;

  assigned_user: {
    user_id: string;
    full_name: string;
  };

  creator: {
    user_id: string;
    full_name: string;
  };
};

type Audit = {
  id: string;
  title: string;
  description: string | null;
  status: "draft" | "in-progress" | "completed";
  department: string;
  audit_date: string;
  created_at: string;
  profiles: {
    full_name: string;
  };
  organizations: {
    org_name: string;
  };
  findings: Finding[];
};

type ViewAuditProps = {
  audit: Audit;
  onEdit: () => void;
  onDelete: () => void;
};




export default function ViewAudit({

}: ViewAuditProps) {


    const {id } = useParams();
    const [isLoading, setisLoading] = useState(false)
    const [audit, setAudit] = useState<Audit | null>(null)
    const router = useRouter()


    const fetchAudit = async() =>{
        setisLoading(true)
        const res = await fetch(`/api/audits/${id}`)
        const data = await res.json();
        setAudit(data.data)
        console.log(data.data)
     
        setisLoading(false)
    }

    const handleEdit = () => {
        setisLoading(true)
        router.push(`/audits/create-audit?id=${id}`)
    };

    const handleDelete = async()=> {
        
        if(!confirm("Are you sure? It can't be undeone")) return;
       
        const res = await deleteAudit(id as string)

        if(res.error){
            showToast("Something went wrong.", res.error);
            return;
        }
        
        if(res.success){
            setisLoading(true)
            showToast("Audit Deleted", "Audit has been deleted succesfully");
            router.push("/audits")
            return
        }     
    }

    useEffect(()=>{
        fetchAudit()
    },[])


    if(isLoading){
        return <Loader />
    }



  return (
    <div className="mx-auto w-full p-4 max-w-5xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between p-4">
            <div>
            <h1 className="text-2xl font-semibold text-slate-900">
                {audit?.title}
            </h1>

            <p className="mt-1 text-sm text-indigo-500 rounded-md p-2 border border-indigo-200 bg-indigo-100 font-semibold w-fit">
            
                {audit?.organizations?.org_name}
            </p>
            </div>

            <div className="flex gap-2">
            <Button
                variant="outline"
                onClick={handleEdit}
                className="border-indigo-200 w-30 h-9 hover:cursor-pointer text-white rounded-sm bg-indigo-600 hover:text-white hover:bg-indigo-700"
            >
                Edit Audit
            </Button>

            <Button
            className=" rounded-sm w-30 h-9 hover:bg-red-600 bg-red-500 text-white hover:cursor-pointer"
                
                onClick={handleDelete}
            >
                Delete Audit
            </Button>
            </div>
        </div>

        {/* Audit Information */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
            <div>
                <p className="text-sm text-slate-500">Status</p>
                <p className="mt-1 font-medium capitalize text-slate-900">
                {audit?.status}
                </p>
            </div>

            <div>
                <p className="text-sm text-slate-500">Audit Date</p>
                <p className="mt-1 font-medium text-slate-900">
                {audit?.audit_date}
                </p>
            </div>

            <div>
                <p className="text-sm text-slate-500">Created At</p>
                <p className="mt-1 font-medium text-slate-900">
                {audit?.created_at.split("T")[0]}
                </p>
            </div>

            <div>
                <p className="text-sm text-slate-500">Created By</p>
                <p className="mt-1 font-medium text-slate-900">
                {audit?.profiles.full_name}
                </p>
            </div>
            </div>
            {/* Description */}
            <div className="mt-10">
                <h2 className="text-lg font-semibold text-slate-900">
                    Description
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                {audit?.description}
                </p>
            </div>
            
        </div>

        <FindingsList findings={audit?.findings ?? []} addHref="/findings/new"/>
    </div>
  );
}