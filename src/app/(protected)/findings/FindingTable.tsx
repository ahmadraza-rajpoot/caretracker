"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, Eye, Search, User } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type Finding = {
  id: string;
  title: string;
  description: string;
  audit_id: string;
  assigned_to: string;
  severity: "low" | "medium" | "high" | string;
  status: "open" | "in-progress" | "resolved" | string;
  due_date: string;
  audits: { title: string } | null;
  assigned_user: { user_id: string; full_name: string } | null;
};

type FindingsTableProps = {
  findings: Finding[];
};

const statusFilterItems = [
  { value: "all", label: "All Statuses" },
  { value: "open", label: "Open" },
  { value: "in-progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
];

const severityFilterItems = [
  { value: "all", label: "All Severities" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const statusStyles: Record<string, string> = {
  open: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  "in-progress": "bg-amber-50 text-amber-700 ring-amber-200",
  resolved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

const severityStyles: Record<string, string> = {
  low: "bg-slate-50 text-slate-600 ring-slate-200",
  medium: "bg-orange-50 text-orange-700 ring-orange-200",
  high: "bg-rose-50 text-rose-700 ring-rose-200",
};

const statusLabels: Record<string, string> = {
  open: "Open",
  "in-progress": "In Progress",
  resolved: "Resolved",
};

const severityLabels: Record<string, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

const fallbackBadge = "bg-slate-50 text-slate-600 ring-slate-200";

function formatDate(date: string) {
  if (!date) return "—";
  // Parse as local date to avoid timezone shifting
  const d = new Date(`${date}T00:00:00`);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function Badge({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${className}`}
    >
      {children}
    </span>
  );
}

export default function FindingsTable({ findings }: FindingsTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");

  const filteredFindings = useMemo(() => {
    const query = search.trim().toLowerCase();

    return findings.filter((finding) => {
      const matchesSearch =
        !query ||
        finding.title.toLowerCase().includes(query) ||
        (finding.audits?.title ?? "").toLowerCase().includes(query) ||
        (finding.assigned_user?.full_name ?? "").toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" || finding.status === statusFilter;

      const matchesSeverity =
        severityFilter === "all" || finding.severity === severityFilter;

      return matchesSearch && matchesStatus && matchesSeverity;
    });
  }, [findings, search, statusFilter, severityFilter]);

  const isEmpty = filteredFindings.length === 0;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative w-full lg:flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-indigo-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by finding, audit or assignee..."
            className="w-full border-indigo-100 bg-white pl-9 focus-visible:ring-indigo-200"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 lg:flex">
          <Select
            items={statusFilterItems}
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value ?? "all")}
          >
            <SelectTrigger className="w-full border-indigo-100 bg-white lg:w-44">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statusFilterItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            items={severityFilterItems}
            value={severityFilter}
            onValueChange={(value) => setSeverityFilter(value ?? "all")}
          >
            <SelectTrigger className="w-full border-indigo-100 bg-white lg:w-44">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              {severityFilterItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Mobile / tablet: cards */}
      <div className="space-y-3 lg:hidden">
        {isEmpty ? (
          <div className="rounded-xl border border-indigo-100 bg-white px-5 py-10 text-center text-sm text-slate-500">
            No findings match your search or filters.
          </div>
        ) : (
          filteredFindings.map((finding) => (
            <div
              key={finding.id}
              className="rounded-xl border border-indigo-100 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="break-words font-medium text-slate-900">
                    {finding.title}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-slate-500">
                    {finding.audits?.title ?? "—"}
                  </p>
                </div>

                <Link
                  href={`/findings/${finding.id}`}
                  className="inline-flex shrink-0 items-center gap-1 rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 transition-colors hover:bg-indigo-100"
                >
                  <Eye className="h-3.5 w-3.5" />
                  View
                </Link>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <Badge className={severityStyles[finding.severity] ?? fallbackBadge}>
                  {severityLabels[finding.severity] ?? finding.severity}
                </Badge>
                <Badge className={statusStyles[finding.status] ?? fallbackBadge}>
                  {statusLabels[finding.status] ?? finding.status}
                </Badge>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                <span className="inline-flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-indigo-400" />
                  {finding.assigned_user?.full_name ?? "Unassigned"}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5 text-indigo-400" />
                  {formatDate(finding.due_date)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop: table */}
      <div className="hidden overflow-hidden rounded-xl border border-indigo-100 bg-white shadow-sm lg:block">
        <table className="w-full table-fixed text-left text-sm">
          <thead className="bg-indigo-50/70 text-indigo-900">
            <tr>
              <th className="w-[26%] px-4 py-3 font-semibold">Finding</th>
              <th className="w-[20%] px-4 py-3 font-semibold">Related Audit</th>
              <th className="w-[10%] px-4 py-3 font-semibold">Severity</th>
              <th className="w-[12%] px-4 py-3 font-semibold">Status</th>
              <th className="w-[14%] px-4 py-3 font-semibold">Assigned To</th>
              <th className="w-[12%] px-4 py-3 font-semibold">Due Date</th>
              <th className="w-[6%] px-4 py-3 text-right font-semibold">View</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-indigo-50">
            {isEmpty ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-12 text-center text-slate-500"
                >
                  No findings match your search or filters.
                </td>
              </tr>
            ) : (
              filteredFindings.map((finding) => (
                <tr
                  key={finding.id}
                  className="transition-colors hover:bg-indigo-50/40"
                >
                  <td className="px-4 py-3">
                    <p
                      className="truncate font-medium text-slate-900"
                      title={finding.title}
                    >
                      {finding.title}
                    </p>
                  </td>

                  <td className="px-4 py-3 text-slate-600">
                    <p className="truncate" title={finding.audits?.title}>
                      {finding.audits?.title ?? "—"}
                    </p>
                  </td>

                  <td className="px-4 py-3">
                    <Badge className={severityStyles[finding.severity] ?? fallbackBadge}>
                      {severityLabels[finding.severity] ?? finding.severity}
                    </Badge>
                  </td>

                  <td className="px-4 py-3">
                    <Badge className={statusStyles[finding.status] ?? fallbackBadge}>
                      {statusLabels[finding.status] ?? finding.status}
                    </Badge>
                  </td>

                  <td className="px-4 py-3 text-slate-600">
                    <p className="truncate">
                      {finding.assigned_user?.full_name ?? "Unassigned"}
                    </p>
                  </td>

                  <td className="px-4 py-3 text-slate-600">
                    {formatDate(finding.due_date)}
                  </td>

                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/findings/view-finding/${finding.id}`}
                      aria-label={`View finding: ${finding.title}`}
                      title="View finding"
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-indigo-50 text-indigo-700 transition-colors hover:bg-indigo-100"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer count */}
      <p className="text-xs text-slate-500">
        Showing {filteredFindings.length} of {findings.length} findings
      </p>
    </div>
  );
}