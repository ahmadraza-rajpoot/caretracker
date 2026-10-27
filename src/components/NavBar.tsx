
import { createClient } from "@/lib/supabse/server";
import { Building2, Plus } from "lucide-react";


type MembershipWithOrg = {
  organizations: { org_name: string , slug:string} | null;
};

const NavBar = async () => {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  let organizationName = "No organization";

  if (user && !authError) {
    const { data: membership, error } = await supabase
    .from("organization_members")
    .select(`
        organizations!organization_members_organization_id_fkey (
        org_name
        )
    `)
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle<MembershipWithOrg>();

    if (error) {
      console.error("Failed to fetch organization:", error.message);
    } else {
      organizationName = membership?.organizations?.org_name ?? "No organization";
    }
  }

  return (
    <header className="flex w-full items-center justify-between border-b bg-background px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <Building2 className="size-5" />
        </div>

        <div className="flex flex-col">
          <span className="text-sm font-semibold tracking-tight text-foreground">
            {organizationName}
          </span>

          <span className="text-xs text-muted-foreground">
            Healthcare compliance
          </span>
        </div>
      </div>

      <button
        type="button"
        className="inline-flex hover:cursor-pointer h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
      >
        <Plus className="size-4" />
        Create Audit
      </button>
    </header>
  );
};

export default NavBar;
