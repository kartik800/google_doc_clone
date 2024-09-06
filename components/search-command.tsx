"use client";

import { api } from "@/convex/_generated/api";
import { useSearch } from "@/hooks/use-search";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { File } from "lucide-react";


export const SearchCommand = () => {
    const {user} = useUser();
    const router = useRouter();
    const documents = useQuery(api.documents.getSearch);

    const toggle = useSearch((store) => store.toggle);
    const isOpen = useSearch((store) => store.isOpen);
    const onClose = useSearch((store) => store.onClose);

    const [isMounted, setIsMounted] = useState(false);

    /* to prevent hydration error because of dialog
     command component of shadcn uses dialog in the background
     dialog appears dynamically that cause hydration error because
     on Server it is does not exist and then it reaches client side it suddenly
     appears that cause hydration error, also it doesn't works with use client because 
    it also does some server side rendering
    */

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        const press = (e: KeyboardEvent) => {
            if(e.key === "k" && (e.metaKey || e.ctrlKey)){
                e.preventDefault()
                toggle();
            }
        }

        document.addEventListener("keydown", press);
        return () => document.removeEventListener("keydown", press);
    }, [toggle]);

    const onSelect = (id: string) => {
        router.push(`/documents/${id}`);
        onClose();
    }

    if(!isMounted){
        return null;
    }

    return (
        <CommandDialog open={isOpen} onOpenChange={onClose}>
            <CommandInput 
                placeholder={`Search ${user?.fullName}`}
            />

            <CommandList>
                <CommandEmpty>
                    No Results found
                </CommandEmpty>
                <CommandGroup heading="doc">
                    {documents?.map((document) => (
                        <CommandItem value={`${document._id}-${document.title}`} 
                            title={document.title}
                            onSelect={onSelect}
                            key={document._id}
                        >
                            <File className="mr-2 h-4 w-4"/>
                            <span>
                                {document.title}
                            </span>

                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>

            
        </CommandDialog>
    )
}