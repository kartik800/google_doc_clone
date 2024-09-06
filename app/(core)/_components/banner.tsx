"use client";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface BannerProp {
    documentId: Id<"documents">
}

const Banner = ({documentId}: BannerProp) => {
    const router = useRouter();

    const remove = useMutation(api.documents.remove);
    const restoreTrash = useMutation(api.documents.restoreTrash);

    const onRemove = () => {
        const promise = remove({id: documentId});

        toast.promise(promise, {
            loading: "Removing document...",
            success: "Document Removed",
            error: "Falied to remove Document."
        });

        router.push("/documents");
    }

    const onRestoreTrash = () => {
        const promise = restoreTrash({id: documentId})

        toast.promise(promise, {
            loading: "Restoring document...",
            success: "Document restored",
            error: "Falied to restore Document."
        });
    }

    return ( 
        <div className="w-full bg-rose-500 text-center p-2 text-sm flex items-center text-white gap-x-2 justify-center">
            <p>
                This doc is in the trash.
            </p>
            <Button size={"sm"} onClick={onRestoreTrash} variant={"outline"} className="bg-transparent border-white hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal">
                Restore Doc
            </Button>
            <ConfirmModal onConfirm={onRemove}>
                <Button size={"sm"} variant={"outline"} className="bg-transparent border-white hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal">
                    Permanently Delete 
                </Button>
            </ConfirmModal>
        </div>
     );
}
 
export default Banner;