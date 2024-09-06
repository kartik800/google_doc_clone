"use client";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Spinner } from "@/components/spinner";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { Search, Trash, Undo } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const TrashBox = () => {
    const router = useRouter();
    const params = useParams();
    const documents = useQuery(api.documents.getTrash);
    const restoreTrash = useMutation(api.documents.restoreTrash);
    const remove = useMutation(api.documents.remove);

    const [search, setSearch] = useState("");
    
    const filteredDocument = documents?.filter((document) => {
        return document.title.toLowerCase().includes(search.toLowerCase());

    });

    const onClick = (documentId: string) => {
        router.push(`/documents/${documentId}`);
    }

    const onRestoreTrash = (event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        documentId: Id<"documents">
    )=> {
        event.stopPropagation();
        const promise = restoreTrash({id: documentId});

        toast.promise(promise, {
            loading: "restoring doc..",
            success: "doc is restored",
            error: "failed to restore doc"
        })
    };
    
    const onRemove = (documentId: Id<"documents">)=> {
        const promise = remove({id: documentId});

        toast.promise(promise, {
            loading: "permanently deleting doc..",
            success: "doc is permanently deleted",
            error: "failed to delete doc"
        })

        if(params.documentId == documentId){
            router.push("/documents");
        }
    };

    if(documents == undefined){
        return (
            <div className="h-full flex items-center justify-center p-4">
                <Spinner size="lg" />
            </div>
        )
    }


    return ( 
        <div className="text-sm">
            <div className="flex items-center gap-x-1 p-2">
                <Search className="h-4 w-4"/>
                <Input 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
                    placeholder="Filter by title......"
                />
            </div>
            <div className="mt-2 px-1 pb-1">
                <p className="hidden last:block text-muted-foreground text-center text-xs">
                    No doc found
                </p>
                {filteredDocument?.map((document) => (
                    <div className="text-sm rounded-sm w-full hover:bg-primary/5 flex items-center justify-between text-primary" role="button" onClick={() => onClick(document._id)} key={document._id}>
                        <span className="truncate pl-2 ">
                            {document.title}
                        </span>
                        <div className="flex items-center">
                            <div role="button" className="rounded-sm p-2 hover:bg-neutral-200" onClick={(e) => onRestoreTrash(e, document._id)}>
                                <Undo className="h-4 w-4 text-muted-foreground"/>
                            </div> 
                            <ConfirmModal onConfirm={() => onRemove(document._id)}>
                                <div role="button" className="rounded-sm p-2 hover:bg-neutral-200">
                                    <Trash className="h-4 w-4 text-muted-foreground"/>
                                </div>
                            </ConfirmModal>
                        </div>    
                    </div>    
                ))}
            </div>
        </div>
    );
}
 
export default TrashBox;