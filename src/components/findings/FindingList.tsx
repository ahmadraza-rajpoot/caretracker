"use client";

import Link from "next/link";
import { Plus } from "lucide-react";


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

type FindingsListProps = {
  findings: Finding[];
  addHref?: string;
};

const severityStyles: Record<string, { pill: string; dot: string; label: string }> = {
  low: {
    pill: "bg-slate-100 text-slate-600",
    dot: "bg-slate-400",
    label: "Low",
  },
  medium: {
    pill: "bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
    label: "Medium",
  },
  high: {
    pill: "bg-rose-50 text-rose-700",
    dot: "bg-rose-500",
    label: "High",
  },
};

const statusStyles: Record<string, { pill: string; dot: string; label: string }> = {
  open: {
    pill: "bg-indigo-50 text-indigo-700",
    dot: "bg-indigo-500",
    label: "Open",
  },
  "in-progress": {
    pill: "bg-sky-50 text-sky-700",
    dot: "bg-sky-500",
    label: "In Progress",
  },
  resolved: {
    pill: "bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
    label: "Resolved",
  },
};

const fallbackStyle = {
  pill: "bg-slate-100 text-slate-600",
  dot: "bg-slate-400",
};

function formatDate(date: string) {
  if (!date) return "—";
  // Parse as local date to avoid timezone shifting
  const d = new Date(`${date}T00:00:00`);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getInitials(name?: string) {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function Pill({
  pill,
  dot,
  children,
}: {
  pill: string;
  dot: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${pill}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {children}
    </span>
  );
}

export default function FindingsList({
  findings,
  addHref = "/findings/create-finding",
}: FindingsListProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-indigo-100 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-indigo-100 px-5 py-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Findings ({findings.length})
        </h2>

        <Link
          href={"/findings/create-finding"}
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          Add Finding
        </Link>
      </div>

      {/* List */}
      {findings.length === 0 ? (
        <div className="px-5 py-12 text-center text-sm text-slate-500">
          No findings yet. Add the first one to get started.
        </div>
      ) : (
        <ul className="divide-y divide-indigo-50">
          {findings.map((finding) => {
            const severity = severityStyles[finding.severity];
            const status = statusStyles[finding.status];
            const assignee = finding.assigned_user?.full_name;

            return (
              <li key={finding.id}>
                <Link
                  href={`/findings/view-finding/${finding.id}`}
                  className="flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-indigo-50/40 sm:flex-row sm:items-start sm:justify-between sm:gap-6"
                >
                  {/* Left: title, description, pills */}
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900">
                      {finding.title}
                    </p>

                    {finding.description && (
                      <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                        {finding.description}
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap gap-2">
                      <Pill
                        pill={severity?.pill ?? fallbackStyle.pill}
                        dot={severity?.dot ?? fallbackStyle.dot}
                      >
                        {severity?.label ?? finding.severity}
                      </Pill>

                      <Pill
                        pill={status?.pill ?? fallbackStyle.pill}
                        dot={status?.dot ?? fallbackStyle.dot}
                      >
                        {status?.label ?? finding.status}
                      </Pill>
                    </div>
                  </div>

                  {/* Right: assignee and due date */}
                  <div className="flex shrink-0 flex-row items-center justify-between gap-3 sm:flex-col sm:items-end sm:justify-start sm:gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-700 ring-1 ring-inset ring-indigo-100">
                        {getInitials(assignee)}
                      </span>
                      <span className="text-sm font-medium text-slate-800">
                        {assignee ?? "Unassigned"}
                      </span>
                    </div>

                    <span className="text-sm text-slate-600">
                      Due {formatDate(finding.due_date)}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}