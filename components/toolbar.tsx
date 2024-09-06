"use client";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { ElementRef, useRef, useState } from "react";


interface ToolbarProps {
    initialData: Doc<"documents">,
    preview?: boolean
}


const Toolbar = ({initialData, preview}: ToolbarProps) => {

    const inputRef = useRef<ElementRef<"textarea">>(null);
    const [isEditing, setIsEditing] = useState(false);

    const [value, setValue] = useState(initialData.title);

    const update = useMutation(api.documents.update);

    const enableInput = () => {
        if(preview) return;

        setIsEditing(true);
        setTimeout(() => {
            setValue(initialData.title);
            inputRef.current?.focus();
        }, 0) 
    };

    const disableInput = () => setIsEditing(false);


    const onKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if(e.key == "Enter"){
            e.preventDefault();
            disableInput();
        }
    };


    return ( 
        <div className="pl-[54px] group relative">
            editor
        </div>
     );
}
 
export default Toolbar;