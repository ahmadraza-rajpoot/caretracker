'use client'

import { useEffect, useState } from 'react'
import Content from './content'
import { useParams } from 'next/navigation'
import Loader from '@/components/Loader'

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

const Page = () => {

    const { id } = useParams<{ id: string }>()

    const [finding, setFinding] = useState<Finding | null>(null)
    const [isLoading, setIsLoading] = useState(true)

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

    useEffect(() => {
        fetchFinding()
    }, [id])

    if (isLoading) return <Loader />

    if (!finding) return <p>Finding not found.</p>

    return (
        <div>
            <Content finding={finding} />
        </div>
    )
}

export default Page
