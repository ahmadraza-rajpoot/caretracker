
import { getCurrentOrganization } from "@/lib/data/organization";
import { getCurrentUser } from "@/lib/data/user";
import { createClient } from "@/lib/supabse/server";

export async function POST(req: Request) {
  try {
    // 1. Parse request body
    let body;

    try {
      body = await req.json();
    } catch {
      return Response.json(
        {
          success: false,
          message: "Invalid request body.",
        },
        { status: 400 }
      );
    }

    const {
      title,
      description,
      relatedAudit,
      severity,
      status,
      assignedTo,
      dueDate,
    } = body;

    // 2. Validate required fields
    if (
      !title ||
      !description ||
      !relatedAudit ||
      !severity ||
      !status ||
      !assignedTo ||
      !dueDate
    ) {
      return Response.json(
        {
          success: false,
          message: "All fields are required.",
        },
        { status: 400 }
      );
    }

    // 3. Authenticate user
    const user = await getCurrentUser();

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    // 4. Get current organization
    const organization = await getCurrentOrganization();

    if (!organization) {
      return Response.json(
        {
          success: false,
          message: "No organization found.",
        },
        { status: 404 }
      );
    }

    // 5. Create Supabase client
    const supabase = await createClient();

    // 6. Insert finding
    const { data, error } = await supabase
      .from("findings")
      .insert({
        title: title.trim(),
        description: description.trim(),
        organization_id: organization.id,
        audit_id: relatedAudit,
        assigned_to: assignedTo,
        created_by: user.id,
        severity,
        status,
        due_date: dueDate,
      })
      .select()
      .single();

    if (error) {
      console.error("Finding creation error:", error);

      return Response.json(
        {
          success: false,
          message: "Unable to create finding.",
        },
        { status: 400 }
      );
    }

    // 7. Return success response
    return Response.json(
      {
        success: true,
        message: "Finding created successfully.",
        data,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("POST /api/findings error:", error);

    return Response.json(
      {
        success: false,
        message: "Internal server error.",
      },
      { status: 500 }
    );
  }
}
