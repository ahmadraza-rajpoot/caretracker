
"use server";

import { getCurrentUser } from "@/lib/data/user";
import { getCurrentOrganization } from "@/lib/data/organization";
import { createClient } from "@/lib/supabse/server";

type ActionState = {
  error: string;
  success: boolean;
};

export async function CreateAudit(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();

  const user = await getCurrentUser();

  if (!user) {
    return {
      error: "User is not authenticated",
      success: false,
    };
  }

  const organization = await getCurrentOrganization();

  if (!organization) {
    return {
      error: "No organization found.",
      success: false,
    };
  }

  // Get audit form data
  const title = formData.get("title") as string;
  const department = formData.get("department") as string;
  const auditDate = formData.get("auditDate") as string;
  const status = formData.get("status") as string;
  const description = formData.get("description") as string;

  // Basic validation
  if (!title || !department || !auditDate || !status) {
    return {
      error: "Please fill in all required fields",
      success: false,
    };
  }

  const { error: insertError } = await supabase
    .from("audits")
    .insert({
      title,
      department,
      audit_date: auditDate,
      status,
      description: description || null,
      created_by: user.id,
      organization_id: organization.id,
    });

  if (insertError) {
    console.error("Create audit error:", insertError);

    return {
      error: "Failed to create audit",
      success: false,
    };
  }

  return {
    error: "",
    success: true,
  };
}
