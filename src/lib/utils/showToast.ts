import { toast } from "@/components/ui/toast"


export const showToast = (title:string, msg:string)=>{
        
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