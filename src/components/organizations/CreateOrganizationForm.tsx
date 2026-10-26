"use client"

import { useState } from "react"
import { Building2, ArrowRight } from "lucide-react"
import { createClient } from "@/lib/supabse/client"
import { toast } from "@/components/ui/toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { validateOrganization } from "@/features/auth/auth"

export default function CreateOrganizationForm() {
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [slugEdited, setSlugEdited] = useState(false)
  const supabse = createClient()

  const showToast = (title:string, msg:string)=>{
        
        const id = toast.add({
            title:title,
            description:msg,
            actionProps:{
                children:"Undo",
                onClick(){
                    toast.close(id)
                }
            }
        })
    }


  function handleNameChange(value: string) {
    setName(value)

    if (!slugEdited) {
      setSlug(
        value
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
      )
    }
  }

 async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()

    let validationError = validateOrganization(name, slug);

    if(validationError){
      console.log(validationError);
      return;
    }

    const {data, error} = await supabse.rpc("create_organization", {
      p_name: name,
      p_slug: slug,
    })

    if(error){
      console.log(error);
      return;
    }

    setName("");
    setSlug("")
    showToast("Orgnization Created", "New organization has been created.")
    return;

  }

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-xl bg-[#4650C9]/10">
          <Building2 className="size-6 text-[#4650C9]" />
        </div>

        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Create organization
          </h2>
          <p className="text-sm text-muted-foreground">
            Add your hospital or clinic to Care Track.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border bg-card p-6 shadow-sm"
      >
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="organization-name">
              Organization name
            </FieldLabel>

            <Input
              id="organization-name"
              name="name"
              placeholder="City General Hospital"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
              maxLength={120}
            />

            <FieldDescription>
              Enter the official name of your hospital or clinic.
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor="organization-slug">
              Organization slug
            </FieldLabel>

            <Input
              id="organization-slug"
              name="slug"
              placeholder="city-general-hospital"
              value={slug}
              onChange={(e) => {
                setSlugEdited(true)
                setSlug(
                  e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9-]/g, "")
                )
              }}
              pattern="[a-z0-9]+(-[a-z0-9]+)*"
              title="Use lowercase letters, numbers, and single hyphens."
              required
              maxLength={120}
            />

            <FieldDescription>
              Unique identifier using lowercase letters, numbers, and
              hyphens. Automatically generated from the name.
            </FieldDescription>
          </Field>
        </FieldGroup>

        <div className="mt-6 flex justify-end">
          <Button
            type="submit"
            className="bg-[#4650C9] hover:bg-[#3942B0]"
            disabled={!name.trim() || !slug.trim()}
          >
            Create organization
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}
