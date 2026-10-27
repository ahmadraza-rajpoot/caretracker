"use client";

import { useState } from "react";
import { ArrowLeft, ClipboardCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const departments = [
  "Emergency",
  "Nursing",
  "Pharmacy",
  "Laboratory",
  "Administration",
  "Facilities",
];

const statuses = [
  { label: "Draft", value: "draft" },
  { label: "In Progress", value: "in-progress" },
  { label: "Completed", value: "completed" },
] as const;

export default function CreateAuditForm() {

  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [auditDate, setAuditDate] = useState("");
  const [status, setStatus] = useState("draft");
  const [description, setDescription] = useState("");

  function handleSubmit(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();

    const audit = {
      title,
      department,
      audit_date: auditDate,
      status,
      description,
    };

    console.log(audit);
    // Next: save this audit to Supabase.
  }

  function handleReset() {
    setTitle("");
    setDepartment("");
    setAuditDate("");
    setStatus("draft");
    setDescription("");
  }

  return (
    <div className="min-h-full bg-[#F8FAFC] w-200 p-6 md:p-8">
      <div className="mx-auto max-w-5xl">
        <Button
          variant="ghost"
          className="mb-6 text-slate-600"
          onClick={() => window.history.back()}
          type="button"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Audits
        </Button>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          {/* Header */}
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <ClipboardCheck className="h-6 w-6" />
            </div>

            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                Create Audit
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Create a new audit for your organization&apos;s compliance
                activities.
              </p>
            </div>
          </div>

          <Separator className="my-7" />

          <form onSubmit={handleSubmit} onReset={handleReset}>
            <div className="space-y-6">
              {/* Audit Name */}
              <div className="space-y-2">
                <Label htmlFor="title">
                  Audit Name <span className="text-red-500">*</span>
                </Label>

                <Input
                  id="title"
                  placeholder="e.g. Fire Safety Compliance Audit"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              {/* Department and Date */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>
                    Department <span className="text-red-500">*</span>
                  </Label>

                  <Select
                    value={department}
                    onValueChange={(value) => setDepartment(value ?? "")}
                    required
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>

                    <SelectContent>
                      {departments.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="auditDate">
                    Audit Date <span className="text-red-500">*</span>
                  </Label>

                  <Input
                    id="auditDate"
                    type="date"
                    value={auditDate}
                    onChange={(e) => setAuditDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Status */}
              <div className="space-y-2 md:max-w-[calc(50%-12px)]">
                <Label>
                  Status <span className="text-red-500">*</span>
                </Label>

                <Select value={status} onValueChange={(value) => setStatus(value ?? "")}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>

                  <SelectContent>
                    {statuses.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>

                <Textarea
                  id="description"
                  placeholder="Describe the audit's purpose, scope and any additional notes..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>
            </div>

            <Separator className="my-7" />

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <Button type="reset" variant="outline">
                Reset
              </Button>

              <Button
                type="submit"
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Create Audit
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}