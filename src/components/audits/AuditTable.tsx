'use client'

import { deleteAudit } from "@/app/(protected)/audits/action";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/utils/showToast";





/* ----------------------------- Types & data ----------------------------- */

type AuditStatus = "Draft" | "In progress" | "Completed";



const STATUSES: AuditStatus[] = ["Draft", "In progress", "Completed"];
const DEPARTMENTS = ["Finance", "HR", "IT", "Operations", "Legal", "Sales"];

// Replace with data from your API
// const MOCK_AUDITS: Audit[] = [
//   { id: "1", name: "Q1 Financial Controls", department: "Finance", auditDate: "2026-01-14", status: "Completed", createdBy: "Sara Khan", findings: 4 },
//   { id: "2", name: "Employee Onboarding Compliance", department: "HR", auditDate: "2026-02-03", status: "Completed", createdBy: "Ali Raza", findings: 2 },
//   { id: "4", name: "Vendor Contract Audit", department: "Legal", auditDate: "2026-03-09", status: "In progress", createdBy: "Usman Tariq", findings: 3 },

//   { id: "6", name: "Sales Commission Accuracy", department: "Sales", auditDate: "2026-04-02", status: "Draft", createdBy: "Bilal Ahmed", findings: 0 },

//   { id: "9", name: "Data Privacy Assessment", department: "Legal", auditDate: "2026-05-19", status: "Draft", createdBy: "Usman Tariq", findings: 0 },
//   { id: "10", name: "Expense Policy Adherence", department: "Finance", auditDate: "2026-06-04", status: "Completed", createdBy: "Ali Raza", findings: 6 },
//   { id: "11", name: "Recruitment Process Review", department: "HR", auditDate: "2026-06-22", status: "In progress", createdBy: "Ayesha Noor", findings: 2 },

//   { id: "13", name: "Customer Refund Process", department: "Sales", auditDate: "2026-07-25", status: "Completed", createdBy: "Hina Malik", findings: 3 },
 
//   { id: "15", name: "Licensing & Permits", department: "Legal", auditDate: "2026-09-01", status: "Draft", createdBy: "Sara Khan", findings: 0 },
//   { id: "16", name: "Inventory Count Verification", department: "Operations", auditDate: "2026-09-17", status: "In progress", createdBy: "Usman Tariq", findings: 4 },
// ];

const PAGE_SIZE_OPTIONS = [5, 10, 25];

const STATUS_STYLES: Record<AuditStatus, string> = {
  Draft: "bg-slate-100 text-slate-700 ring-slate-200",
  "In progress": "bg-blue-50 text-blue-700 ring-blue-200",
  Completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

/* ------------------------------- Helpers -------------------------------- */

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

/* ----------------------------- Row actions ------------------------------ */

function RowActions({
  audit,
  onView,
  onEdit,
  onDelete,
}: {
  audit: Audit;
  onView: (a: Audit) => void;
  onEdit: (a: Audit) => void;
  onDelete: (a: Audit) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const item = "flex w-full items-center px-3 py-2 text-left text-sm hover:bg-slate-50 focus:bg-slate-50 focus:outline-none";

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Actions for ${audit.name}`}
        onClick={() => setOpen((o) => !o)}
        className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <circle cx="5" cy="12" r="1.8" />
          <circle cx="12" cy="12" r="1.8" />
          <circle cx="19" cy="12" r="1.8" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-20 mt-1 w-36 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
        >
          <button role="menuitem" className={`${item} text-slate-700`} onClick={() => { setOpen(false); onView(audit); }}>
            View
          </button>
          <button role="menuitem" className={`${item} text-slate-700`} onClick={() => { setOpen(false); onEdit(audit); }}>
            Edit
          </button>
          <div className="my-1 border-t border-slate-100" />
          <button role="menuitem" className={`${item} text-red-600 hover:bg-red-50 focus:bg-red-50`} onClick={() => { setOpen(false); onDelete(audit); }}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------ Main table ------------------------------ */

type Audit = {
  id: string;
  name: string;
  department: string;
  auditDate: string;
  status: "Completed" | "In progress" | "Draft";
  createdBy: string;
  findings: number;
};

type AuditsTableProps = {
  auditData: Audit[];
};

export default function AuditsTable({auditData}:AuditsTableProps) {


  const [audits, setAudits] = useState<Audit[]>(auditData);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [department, setDepartment] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const router = useRouter();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return audits.filter(
      (a) =>
        (!q || a.name.toLowerCase().includes(q) || a.createdBy.toLowerCase().includes(q)) &&
        (!status || a.status === status) &&
        (!department || a.department === department)
    );
  }, [audits, search, status, department]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pageRows = filtered.slice(start, start + pageSize);

  const hasFilters = Boolean(search || status || department);

  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setDepartment("");
    setPage(1);
  };

  // Hook these up to your router / modals / API
  const handleView = (a: Audit) => console.log("View", a.id);

  const handleEdit = (a: Audit) => {
    router.push(`/audits/create-audit?id=${encodeURIComponent(a.id)}`)
  };

 const handleDelete = async (a: Audit) => {
  const confirmed = window.confirm(
    `Delete "${a.name}"? This can't be undone.`
  );

  if (!confirmed) return;

  const result = await deleteAudit(a.id);

  if (result?.error) {
    alert(result.error);
    showToast("Error while deleting", result.error)
    return;
  }

  // Remove the deleted row immediately from the client UI
  setAudits((current) =>
    current.filter((audit) => audit.id !== a.id)
  );

  showToast("Audit Deleted", "Audited has been delted successfully")
  // Refresh server-rendered data
  router.refresh();
};

  const control =
    "h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30";

  // Page numbers with ellipsis
  const pageNumbers = useMemo(() => {
    const pages: (number | "…")[] = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) pages.push(i);
      else if (pages[pages.length - 1] !== "…") pages.push("…");
    }
    return pages;
  }, [totalPages, currentPage]);

  useEffect(()=>{
    setAudits(auditData)
  },[auditData])

  return (
    <div className="mx-auto w-full max-w-6xl p-4 sm:p-6">


      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="search"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search audits"
            aria-label="Search audits"
            className={`${control} w-full pl-9`}
          />
        </div>

        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          aria-label="Filter by status"
          className={control}
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          value={department}
          onChange={(e) => { setDepartment(e.target.value); setPage(1); }}
          aria-label="Filter by department"
          className={control}
        >
          <option value="">All departments</option>
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <button
          type="button"
          onClick={clearFilters}
          disabled={!hasFilters}
          className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Clear all filters
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto rounded-t-xl">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">Audit Name</th>
                <th scope="col" className="px-4 py-3 font-medium">Department</th>
                <th scope="col" className="px-4 py-3 font-medium">Audit Date</th>
                <th scope="col" className="px-4 py-3 font-medium">Status</th>
                <th scope="col" className="px-4 py-3 font-medium">Created By</th>
                <th scope="col" className="px-4 py-3 text-right font-medium">Findings</th>
                <th scope="col" className="w-12 px-4 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-14 text-center">
                    <p className="font-medium text-slate-900">No audits found</p>
                    <p className="mt-1 text-slate-500">Try a different search or clear your filters.</p>
                    {hasFilters && (
                      <button onClick={clearFilters} className="mt-3 text-sm font-medium text-indigo-600 hover:underline">
                        Clear all filters
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                pageRows.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/70">
                    <td className="px-4 py-3 font-medium text-slate-900">{a.name}</td>
                    <td className="px-4 py-3 text-slate-600">{a.department}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">{formatDate(a.auditDate)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${STATUS_STYLES[a.status]}`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{a.createdBy}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-900">{a.findings}</td>
                    <td className="px-4 py-3 text-right">
                      <RowActions audit={a} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 text-sm text-slate-600">
          <div className="flex items-center gap-3">
            <span>
              {filtered.length === 0 ? "0 results" : `${start + 1}–${Math.min(start + pageSize, filtered.length)} of ${filtered.length}`}
            </span>
            <label className="flex items-center gap-2">
              <span className="text-slate-500">Rows per page</span>
              <select
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                className="h-8 rounded-md border border-slate-300 bg-white px-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              >
                {PAGE_SIZE_OPTIONS.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </label>
          </div>

          <nav aria-label="Pagination" className="flex items-center gap-1">
            <button
              onClick={() => setPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-8 rounded-md border border-slate-300 px-3 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            {pageNumbers.map((p, i) =>
              p === "…" ? (
                <span key={`gap-${i}`} className="px-2 text-slate-400">…</span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  aria-current={p === currentPage ? "page" : undefined}
                  className={`h-8 min-w-8 rounded-md px-2 ${
                    p === currentPage
                      ? "bg-indigo-600 font-medium text-white"
                      : "border border-transparent hover:bg-slate-100"
                  }`}
                >
                  {p}
                </button>
              )
            )}
            <button
              onClick={() => setPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-8 rounded-md border border-slate-300 px-3 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}