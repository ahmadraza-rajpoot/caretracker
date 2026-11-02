'use client'

import { useEffect, useState } from 'react'

import Header from '@/components/findings/Header'
import FindingsTable, { type Finding } from './FindingTable'

const Findings = () => {
  const [findings, setFindings] = useState<Finding[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
        setError('')

        const res = await fetch('/api/findings', { cache: 'no-store' })
        const result = await res.json()

        if (!res.ok || !result.success) {
          throw new Error(result.message || 'Failed to fetch findings')
        }

        setFindings(result.data ?? [])
      } catch (err) {
        console.error(err)
        setError(err instanceof Error ? err.message : 'Something went wrong')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) return <h1>Loading....</h1>

  return (
    <div>
      <Header />

      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : (
        <div className='px-4 mt-5'>
          <FindingsTable findings={findings} />
        </div>
      )}
    </div>
  )
}

export default Findings