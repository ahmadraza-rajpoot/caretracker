import { createClient } from "@/lib/supabse/server";
import { isValidUUID } from "@/lib/utils/isValidUUID";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  req: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    // Validate finding ID
    if (!isValidUUID(id)) {
      return Response.json(
        {
          success: false,
          message: "A valid finding ID is required.",
        },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Fetch finding with related records
    const { data, error } = await supabase
      .from("findings")
      .select(`
        title,
        description,
        severity,
        status,
        due_date,
        created_at,

        audits (
          title
        ),

        assigned_user:profiles!findings_assigned_to_profile_fkey (
          full_name
        ),

        creator:profiles!findings_created_by_profile_fkey (
          full_name
        )
      `)
      .eq("id", id)
      .maybeSingle();

    if (error) {
      return Response.json(
        {
          success: false,
          message: error.message,
        },
        { status: 500 }
      );
    }

    if (!data) {
      return Response.json(
        {
          success: false,
          message: "Finding not found.",
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: "Finding fetched successfully.",
      data,
    });

  } catch (error) {
    return Response.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong.",
      },
      { status: 500 }
    );
  }
}


export async function PATCH(
    req: Request,
    { params }:RouteContext
) {
    try {

        const { id } = await params;

        if (!isValidUUID(id)) {
            return Response.json(
                { success: false, message: "Invalid finding ID." },
                { status: 400 }
            );
        }

        const { status } = await req.json();
       
        const allowedStatuses = ["open", "in-progress", "resolved"];

        if (!allowedStatuses.includes(status)) {
            return Response.json(
                { success: false, message: "Invalid status." },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        const { data, error } = await supabase
            .from("findings")
            .update({ status })
            .eq("id", id)
            .select("id, status")
            .maybeSingle();

        if (error) {
            return Response.json(
                { success: false, message: error.message },
                { status: 500 }
            );
        }

        if (!data) {
            return Response.json(
                { success: false, message: "Finding not found." },
                { status: 404 }
            );
        }

        return Response.json({
            success: true,
            message: "Finding status updated successfully.",
            data
        });

    } catch (error) {
        return Response.json(
            {
                success: false,
                message: error instanceof Error
                    ? error.message
                    : "Something went wrong."
            },
            { status: 500 }
        );
    }
}