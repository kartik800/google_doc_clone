"use client";

import { cn } from "@/lib/utils";
import { ChevronsLeft, MenuIcon, Plus, PlusCircle, Search, Settings, Trash } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import React, { ElementRef, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import UserItem from "./user-item";
import Item from "./item";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import DocumentList from "./document-list";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { PopoverContent } from "@radix-ui/react-popover";
import TrashBox from "./trash";
import { useSearch } from "@/hooks/use-search";
import { useSettings } from "@/hooks/use-settings";
import Navbar from "./navbar";

const Navigation = () => {
    const search = useSearch();
    const settings = useSettings();
    const params = useParams();
    const pathname = usePathname();
    const isPhone = useMediaQuery("(max-width: 768px)");
    const create = useMutation(api.documents.create);

    // useState when we need stateful logic that affects rendering. 
    // useRef for accessing DOM elements and persisting values without causing re-renders
    const isResizingRef = useRef(false);
    const sidebarRef = useRef<ElementRef<"aside">>(null);
    const navbarRef = useRef<ElementRef<"div">>(null);
    const [isResetting, setIsResetting] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(isPhone);

    useEffect(()=> {
        if(isPhone){
            collapse()
        }else {
            resetWidth();
        }
    }, [isPhone]);

    useEffect(()=> {
        if(isPhone){
            collapse()
        }
    }, [isPhone, pathname]);

    

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault();
        event.stopPropagation();

        // console.log(isResizingRef);
        isResizingRef.current = true;

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    }

    const handleMouseUp = () => {
        isResizingRef.current = false;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    }

    const handleMouseMove = (e: MouseEvent) => {
        if(!isResizingRef.current) return;

        // initialize newWidth
        let newWidth = e.clientX;
        
        // limits of resizability
        if(newWidth < 240) newWidth= 240;
        if(newWidth > 480) newWidth=480;

        if(sidebarRef.current && navbarRef.current){
            sidebarRef.current.style.width = `${newWidth}px`;
            navbarRef.current.style.setProperty("left", `${newWidth}px`);
            navbarRef.current.style.setProperty("width", `calc(100 - ${newWidth}px)`)
        }
    }

    const resetWidth = () => {
        if(sidebarRef.current && navbarRef.current){
            setIsCollapsed(false);
            setIsResetting(true);

            sidebarRef.current.style.width = isPhone ? "100%" : "240px";
            navbarRef.current.style.setProperty("left", isPhone ? "100%" : "240px");
            navbarRef.current.style.setProperty("width", isPhone ? "0" :"calc(100% - 240px)");

            setTimeout(() => setIsResetting(false), 300);
        }
    }

    const collapse = () => {
        if(sidebarRef.current && navbarRef.current){
            setIsCollapsed(true);
            setIsResetting(true);

            sidebarRef.current.style.width = "0";
            navbarRef.current.style.setProperty("left", "0");
            navbarRef.current.style.setProperty("width", "100%");

            setTimeout(() => setIsResetting(false), 300);
        }

    }

    const handleCreate = () => {
        const promise = create({
            title: "Untitled Doc"
        });

        toast.promise(promise, {
            loading: "doc is creating..",
            success: "doc is created",
            error: "failed to create doc"
        });
    }

    return ( 
    <>
        <aside 
            ref={sidebarRef}
            className={cn(
                "group/sidebar h-full bg-secondary overflow-y-auto relative flex flex-col w-60 z-[99999]",
                isResetting && "transition-all ease-in-out duration-300",
                isPhone && "w-0"
                )}>
            <div onClick={collapse} role="button" className={cn("h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute right-2 top-2 opacity-0 group-hover/sidebar:opacity-100 transition",
                isPhone && "opacity-100"
            )}>
                <ChevronsLeft className="h-6 w-6"/>
            </div>
            <div>
                <UserItem/>
                <Item
                    label="Search"
                    icon={Search}
                    isSearch
                    onClick={search.onOpen}
                />
                <Item
                    label="Settings"
                    icon={Settings}
                    onClick={settings.onOpen}
                />
                <Item 
                    label="new doc" 
                    onClick={handleCreate} 
                    icon={PlusCircle}/>
            </div>

            <div className="mt-4">
                <DocumentList/>
                <Item
                    onClick={handleCreate}
                    icon={Plus}
                    label="Add a new doc"
                />
                <Popover>
                    <PopoverTrigger className="w-full mt-4">
                        <Item label="Trash" icon={Trash} />
                    </PopoverTrigger>
                    <PopoverContent
                        className="p-0 w-72"
                        side={isPhone ? "bottom": "right"}
                    >
                        <TrashBox/>
                    </PopoverContent>
                </Popover>
            </div>

            <div 
            onMouseDown={handleMouseDown}
            onClick={resetWidth}
            className="opacity-0 group-hover/sidebar:opacity-100 transition right-0 h-full w-1 absolute top-0 bg-primary/10 cursor-ew-resize"
            />
        </aside>
        <div ref={navbarRef} className={cn("absolute top-0 left-60 z-[99999] w-[calc(100%-240px)]", 
            isResetting && "transition-all ease-in-out duration-300",
            isPhone && "left-0 w-full"
        )}>
            {!!params.documentId ? (
                <Navbar
                    isCollapsed={isCollapsed}
                    onResetWidth={resetWidth}
                />
            ) : (
            <nav className="bg-transparent px-3 py-2 w-full">
                {isCollapsed && <MenuIcon onClick={resetWidth} role={"button"} className="h-6 w-6 text-muted-foreground"/>}
            </nav>
            )}
        </div>
    </>
);
}
 
export default Navigation;