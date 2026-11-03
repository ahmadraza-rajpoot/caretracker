'use client'

import { useState } from "react";
import { Finding } from "./page";
import { capitalize, formatText } from "@/lib/utils/customMethods";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/utils/showToast";


type FindingStatus = "open" | "in-progress" | "resolved";

type findingParam = {
    finding:Finding,
    id:string,
    onStatusUpdate:(status: FindingStatus) => void;
}

const severityColor = {
    low:"text-green-700 ring-green-200 bg-green-50",
    medium:"text-yellow-700 ring-yellow-200 bg-yellow-50",
    high:"text-red-700 ring-red-200 bg-red-50"
}
type StatusLabel = "Open" | "In Progress" | "Resolved";

const Content = ({finding, id, onStatusUpdate}:findingParam) => {
    
    const [btnText, setBtnText] = useState(formatText(finding.status))
    
    const status = ["Open", "In Progress", "Resolved"];
    const router= useRouter()

    const apiStatus: Record<StatusLabel, string> = {
        Open: "open",
        "In Progress": "in-progress",
        Resolved: "resolved",
    };

const updateStatus = async (newStatus:FindingStatus) => {
  try {
    const status = apiStatus[btnText as StatusLabel];

    if (!status) {
      console.error("Invalid status");
      return;
    }

    const res = await fetch(`/api/findings/view-finding/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error(data.message || "Failed to update status");
      return;
    }
    onStatusUpdate(newStatus)
    console.log(data);
    showToast("Status Updated", "Status has been udpated successfully")
    router.refresh();
  } catch (error) {
    console.error("Error updating finding status:", error);
  }
};

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">

        {/* Header */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Finding Details
              </p>

              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
                {finding.title}
              </h1>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className={ `rounded-full px-3 py-1 text-sm font-medium ${severityColor[finding.severity]} ring-1 ring-inset`}>
                {capitalize(finding.severity)} Severity
              </span>

              <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700 ring-1 ring-inset ring-green-200">
                {formatText(finding.status)}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">

          {/* Left Content */}
          <div className="space-y-6 lg:col-span-2">

            {/* Description */}
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900">
                Description
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                {finding.description}
              </p>
            </div>

            {/* Update Status */}
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Update Finding Status
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Change the current status of this finding.
                </p>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                {status.map((item) => (
                  <button
                    onClick={()=>setBtnText(item)}
                    key={item}
                    className={`rounded-md border hover:cursor-pointer px-5 py-2 text-sm font-medium transition ${
                      item === btnText
                        ? "border-indigo-500 text-indigo-600 border-2"
                        : "border-slate-100 bg-white border-2 text-slate-700"
                    }`}
                  >
                    {item}
                  </button>
                ))}

              </div>

                <button onClick={()=>updateStatus(btnText as FindingStatus)} className="w-40 mt-6 rounded-sm hover:cursor-pointer h-10 bg-indigo-600 text-white">Update Status</button>

            </div>

          </div>

          {/* Right Sidebar */}
          <div className="h-fit rounded-lg border bg-white shadow-sm">
            <div className="border-b px-6 py-4">
              <h2 className="text-base font-semibold text-slate-900">
                Finding Information
              </h2>
            </div>

            <div className="divide-y">

              <div className="px-6 py-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Related Audit
                </p>
                <p className="mt-1 text-sm font-medium text-slate-900">
                  {finding.audits.title}
                </p>
              </div>

              <div className="px-6 py-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Assigned To
                </p>
                <p className="mt-1 text-sm font-medium text-slate-900">
                  {finding.assigned_user.full_name}
                </p>
              </div>

              <div className="px-6 py-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Due Date
                </p>
                <p className="mt-1 text-sm font-medium text-slate-900">
                  {finding.due_date}
                </p>
              </div>

              <div className="px-6 py-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Created At
                </p>
                <p className="mt-1 text-sm font-medium text-slate-900">
                  {finding.created_at.split("T")[0]}
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Content