'use client'

import { useEffect, useState } from 'react'
import Content from './content'
import { useParams } from 'next/navigation'
import Loader from '@/components/Loader'
import { useRouter } from 'next/navigation'

export interface Finding {
    title: string;
    description: string;
    severity: "low" | "medium" | "high";
    status: "open" | "in-progress" | "resolved";
    due_date: string;
    created_at: string;

    audits: {
        title: string;
    };

    assigned_user: {
        full_name: string;
    };

    creator: {
        full_name: string;
    };
}

type FindingStatus = "open" | "in-progress" | "resolved";

const Page = () => {

    const { id } = useParams<{ id: string }>()

    const [finding, setFinding] = useState<Finding | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    async function fetchFinding() {
        try {
            setIsLoading(true)

            const res = await fetch(`/api/findings/view-finding/${id}`)
            const data = await res.json()

            if (!res.ok) {
                console.log(data.message)
                return
            }

            setFinding(data.data)

        } catch (error) {
            console.log(
                error instanceof Error
                    ? error.message
                    : "Something went wrong."
            )
        } finally {
            setIsLoading(false)
        }
    }

    const handleStatusUpdate = (newStatus: FindingStatus) => {

        setFinding((prev) => prev ? { ...prev, status: newStatus } : prev);

    };

    useEffect(() => {
        fetchFinding()
    }, [id])

    if (isLoading) return <Loader />

    if (!finding) return <p>Finding not found.</p>

    return (
        <div className=''>
            <button
            onClick={() => router.back()}
            className="rounded-md ml-8 mt-8 hover:cursor-pointer border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
            Go Back
        </button>
            <Content onStatusUpdate ={handleStatusUpdate} finding={finding} id={id} />
        </div>
    )
}

export default Page
