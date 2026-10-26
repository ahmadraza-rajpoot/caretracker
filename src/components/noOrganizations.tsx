import Link from "next/link"
import { Building2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NoOrganization() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#4650C9]/10">
        <Building2 className="h-8 w-8 text-[#4650C9]" />
      </div>

      <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
        No organization yet
      </h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
        You haven't created or joined an organization yet.
        Create an organization to start managing healthcare
        audits with Care Track.
      </p>

      <Button
        
        className="mt-6 bg-[#4650C9] hover:bg-[#3942B0]"
      >
        <Link className="flex items-center" href="/organizations">
          Go to Organizations
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </section>
  )
}
