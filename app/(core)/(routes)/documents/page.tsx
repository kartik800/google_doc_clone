"use client";

import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const Documents = () => {
    const {user} = useUser();
    const create = useMutation(api.documents.create);
    const router = useRouter();


   useEffect(() => {
      const promise = create({title: "Untitled Doc"});
      promise.then((document)=> {
         router.push(`/documents/${document}`);
      })
   },[create, router]);

    return ( 
        <div className="flex flex-col items-center justify-center h-full space-y-4">
           <div className="h-full flex items-center justify-center">
                <Spinner/>
            </div>
        </div>
     );
}
 
export default Documents;