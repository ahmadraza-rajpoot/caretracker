"use client";

import React, { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ClipboardCheck } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { showToast } from "@/lib/utils/showToast";

type Audit = {
  id: string;
  title: string;
};

type OrganizationUser = {
  user_id: string;
  full_name: string;
};

type FindingFormProps = {
  audits: Audit[];
  users: OrganizationUser[];
};

const severities = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const statuses = [
  { value: "open", label: "Open" },
  { value: "in-progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
];

export default function FindingForm({ audits, users }: FindingFormProps) {
  const router = useRouter();

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [relatedAudit, setRelatedAudit] = useState("");
  const [severity, setSeverity] = useState("");
  const [status, setStatus] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState("");

  // API states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Value -> label lists so the Select can display names instead of IDs
  const auditItems = audits.map((audit) => ({
    value: audit.id,
    label: audit.title,
  }));

  const userItems = users.map((user) => ({
    value: user.user_id,
    label: user.full_name,
  }));

  // Submit form
  async function handleSubmit(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const findingData = {
      title,
      description,
      relatedAudit,
      severity,
      status,
      assignedTo,
      dueDate,
    };

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/findings/create-finding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(findingData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create finding");
      }


        setTitle("")
        setDescription("")
        setRelatedAudit("")
        setSeverity("")
        setStatus("")
        setAssignedTo("")
        setDueDate("")
      showToast("Finding Created", "Finding has been created successfully!")
      router.push("/findings");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Reset form
  function handleReset() {
    setTitle("");
    setDescription("");
    setRelatedAudit("");
    setSeverity("");
    setStatus("");
    setAssignedTo("");
    setDueDate("");
    setError("");
  }

  return (
    <div className="min-h-full w-full bg-[#F8FAFC] p-6 md:p-8">
      <div className="mx-auto max-w-5xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6 text-slate-600"
          onClick={() => router.back()}
          type="button"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Findings
        </Button>

        {/* Main Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          {/* Header */}
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <ClipboardCheck className="h-6 w-6" />
            </div>

            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                Create Finding
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Record a new finding and assign it for corrective action.
              </p>
            </div>
          </div>

          <Separator className="my-7" />

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Finding Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g. Missing fire safety equipment"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Related Audit + Severity */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Related Audit */}
              <div className="space-y-2">
                <Label>
                  Related Audit <span className="text-red-500">*</span>
                </Label>
                <Select
                  items={auditItems}
                  value={relatedAudit}
                  onValueChange={(value) => setRelatedAudit(value ?? "")}
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select audit" />
                  </SelectTrigger>
                  <SelectContent>
                    {auditItems.map((audit) => (
                      <SelectItem key={audit.value} value={audit.value}>
                        {audit.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Severity */}
              <div className="space-y-2">
                <Label>
                  Severity <span className="text-red-500">*</span>
                </Label>
                <Select
                  items={severities}
                  value={severity}
                  onValueChange={(value) => setSeverity(value ?? "")}
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    {severities.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Status + Assigned To */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Status */}
              <div className="space-y-2">
                <Label>
                  Status <span className="text-red-500">*</span>
                </Label>
                <Select
                  items={statuses}
                  value={status}
                  onValueChange={(value) => setStatus(value ?? "")}
                  required
                >
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

              {/* Assigned To */}
              <div className="space-y-2">
                <Label>
                  Assigned To <span className="text-red-500">*</span>
                </Label>
                <Select
                  items={userItems}
                  value={assignedTo}
                  onValueChange={(value) => setAssignedTo(value ?? "")}
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent>
                    {userItems.map((user) => (
                      <SelectItem key={user.value} value={user.value}>
                        {user.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Due Date */}
            <div className="space-y-2 md:max-w-[calc(50%-12px)]">
              <Label htmlFor="dueDate">
                Due Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="dueDate"
                name="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe the finding, risk, and any relevant details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                required
              />
            </div>

            {/* API Error */}
            {error && (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            )}

            <Separator className="my-7" />

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={handleReset}
              >
                Reset
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                {isSubmitting ? "Creating..." : "Create Finding"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}