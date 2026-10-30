
"use server";

import { getCurrentUser } from "@/lib/data/user";
import { getCurrentOrganization } from "@/lib/data/organization";
import { createClient } from "@/lib/supabse/server";
import { revalidatePath } from "next/cache";

type ActionState = {
  error: string;
  success: boolean;
};

export async function CreateAudit(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();

  // 1. Authenticate user
  const user = await getCurrentUser();

  if (!user) {
    return {
      error: "User is not authenticated",
      success: false,
    };
  }

  // 2. Get current organization
  const organization = await getCurrentOrganization();

  if (!organization) {
    return {
      error: "No organization found.",
      success: false,
    };
  }

  // 3. Check user role
  const role = await getCurrentUserRole(user.id, organization.id);

  if (!role || (role !== "admin" && role !== "auditor")) {
    return {
      error: "Unauthorized request",
      success: false,
    };
  }

  // 4. Get form data
  const auditId = formData.get("auditId")?.toString().trim();

  const title = formData.get("title")?.toString().trim() ?? "";
  const department = formData.get("department")?.toString() ?? "";
  const auditDate = formData.get("auditDate")?.toString() ?? "";
  const status = formData.get("status")?.toString() ?? "";
  const description = formData.get("description")?.toString().trim() ?? "";

  // 5. Validate required fields
  if (!title || !department || !auditDate || !status) {
    return {
      error: "Please fill in all required fields",
      success: false,
    };
  }

  // 6. Update existing audit
  if (auditId) {
    let query = supabase
      .from("audits")
      .update({
        title,
        department,
        audit_date: auditDate,
        status,
        description: description || null,
      })
      .eq("id", auditId)
      .eq("organization_id", organization.id);

    if (role !== "admin") {
      query = query.eq("created_by", user.id);
    }

    const { data, error } = await query.select("id");

    if (error) {
      console.error("Update audit error:", error);

      return {
        error: "Failed to update audit",
        success: false,
      };
    }

    if (!data?.length) {
      return {
        error: "Audit not found or you don't have permission to update it.",
        success: false,
      };
    }

    revalidatePath("/audits");

    return {
      error: "",
      success: true,
    };
  }

  // 7. Create new audit
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

  revalidatePath("/audits");

  return {
    error: "",
    success: true,
  };
}

// Get current user's role in the organization
export async function getCurrentUserRole(
  userId: string,
  organizationId: string
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("organization_members")
    .select("role")
    .eq("user_id", userId)
    .eq("organization_id", organizationId)
    .single();

  if (error) {
    console.error("Get user role error:", error);
    return null;
  }

  return data?.role ?? null;
}
