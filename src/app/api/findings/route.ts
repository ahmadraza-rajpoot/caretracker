
import { getCurrentOrganization } from "@/lib/data/organization";
import { getCurrentUser } from "@/lib/data/user";
import { createClient } from "@/lib/supabse/server";

export async function GET() {
  try {
    // 1. Authenticate user
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

    // 2. Get current organization
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

    // 3. Create Supabase client
    const supabase = await createClient();

    // 4. Fetch organization findings with related audit
    const { data: findings, error: findingsError } = await supabase
      .from("findings")
      .select("*, audits(title)")
      .eq("organization_id", organization.id)
      .order("created_at", { ascending: false });

    if (findingsError) {
      console.error("Fetch findings error:", findingsError);

      return Response.json(
        {
          success: false,
          message: "Unable to fetch findings.",
        },
        { status: 500 }
      );
    }

    // 5. Get assigned users and creators
    const userIds = [
      ...new Set(
        findings.flatMap((finding) => [
          finding.assigned_to,
          finding.created_by,
        ])
      ),
    ];

    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("user_id, full_name")
      .in("user_id", userIds);

    if (profilesError) {
      console.error("Fetch finding profiles error:", profilesError);

      return Response.json(
        {
          success: false,
          message: "Unable to fetch user information.",
        },
        { status: 500 }
      );
    }

    // 6. Map user profiles to findings
    const profilesMap = new Map(
      profiles.map((profile) => [profile.user_id, profile])
    );

    const formattedFindings = findings.map((finding) => ({
      ...finding,
      assigned_user: profilesMap.get(finding.assigned_to) ?? null,
      creator: profilesMap.get(finding.created_by) ?? null,
    }));

    // 7. Return findings
    return Response.json(
      {
        success: true,
        message: "Findings fetched successfully.",
        data: formattedFindings,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("GET /api/findings error:", error);

    return Response.json(
      {
        success: false,
        message: "Internal server error.",
      },
      { status: 500 }
    );
  }
}
