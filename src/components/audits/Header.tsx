import { Plus } from "lucide-react";
import Link from "next/link";

const Header = () => {
  return (
    <header className="flex p-4 flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Audits
        </h1>

        <p className="text-sm text-slate-500">
          Create, manage, and track healthcare safety inspections.
        </p>
      </div>

      <Link
        href="/audits/create-audit"
        className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 sm:w-auto"
      >
        <Plus className="h-4 w-4" />
        Create Audit
      </Link>
    </header>
  );
};

export default Header;