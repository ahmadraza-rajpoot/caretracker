import { createClient } from "@/lib/supabse/server";
import { isValidUUID } from "@/lib/utils/isValidUUID";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  try {


    // 1. Get and validate audit ID
    const { id } = await params;

    if (!isValidUUID(id)) {
      return Response.json(
        {
          success: false,
          message: "Invalid audit ID.",
        },
        { status: 400 }
      );
    }

    // 2. Create Supabase client
    const supabase = await createClient();

    // 3. Verify authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return Response.json(
        {
          success: false,
          message: "Unauthorized. Please sign in.",
        },
        { status: 401 }
      );
    }

    // 4. Fetch audit
    const { data: audit, error } = await supabase
      .from("audits")
      .select(`
        id,
        title,
        description,
        status,
        department,
        audit_date,
        created_at,
        profiles(full_name),
        organizations(org_name)
      `)
      .eq("id", id)
      .maybeSingle();

    // 5. Handle database errors
    if (error) {
      console.error("Failed to fetch audit:", {
        code: error.code,
        message: error.message,
      });

      return Response.json(
        {
          success: false,
          message: "Unable to retrieve audit.",
        },
        { status: 500 }
      );
    }

    // 6. Handle missing or inaccessible audit
    if (!audit) {
      return Response.json(
        {
          success: false,
          message: "Audit not found.",
        },
        { status: 404 }
      );
    }

    // 7. Return successful response
    return Response.json(
      {
        success: true,
        message: "Audit retrieved successfully.",
        data: audit,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error(
      "GET audit API error:",
      error instanceof Error ? error.message : error
    );

    return Response.json(
      {
        success: false,
        message: "Internal server error.",
      },
      { status: 500 }
    );
  }
}
