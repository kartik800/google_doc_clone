"use client";

import Toolbar from "@/components/toolbar";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";

interface DocumentIdPageProps {
    params: {
        documentId: Id<"documents">
    }
}

const DocumentId = ({params}: DocumentIdPageProps) => {
    const document = useQuery(api.documents.getById, {
        documentId: params.documentId
    });

    if(document === undefined){
        return (<p>
            Loading......
        </p>)
    }

    if(document === null){
        return (<div>
            null
        </div>)
    }
    return ( 
        <div className="pb-40">
            <div className="h-14"/>
            <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
                <Toolbar initialData={document}/>
                {/* Editor Component */}
            </div>
        </div>
     );   
}
 
export default DocumentId; 