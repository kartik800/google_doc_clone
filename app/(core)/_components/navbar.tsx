"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { MenuIcon,  ChevronsLeftRight} from "lucide-react";
import { useParams } from "next/navigation";
import Title from "./title";
import Banner from "./banner";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useUser, SignOutButton } from "@clerk/clerk-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";


interface NavbarProps {
    isCollapsed: boolean
    onResetWidth: () => void
}

const NavbarAvatar = () => {
    const {user } = useUser();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div role="button" className="flex items-center text-sm hover:bg-primary/5">
                    <div className="gap-x-2 flex items-center max-w-[150px]">
                        <Avatar className="h-6 w-6">
                            <AvatarImage src={user?.imageUrl}/>
                        </Avatar>
                    </div>
                    <ChevronsLeftRight className="ml-2 rotate-90 h-4 w-4 text-muted-foreground"/>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
                className="w-80"
                align="start"
                alignOffset={11}
                forceMount
            >
                <div className="flex flex-col space-y-4 p-2">
                    <p className="text-xs font-medium leading-none text-muted-foreground">
                      {user?.emailAddresses[0].emailAddress}  
                    </p>
                    <div className="flex items-center gap-x-2">
                        <div className="rounded-md bg-secondary p-1">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user?.imageUrl}/>
                        </Avatar>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm line-clamp-1">
                                {user?.fullName}
                            </p>
                        </div>
                    </div>
                </div>
                <DropdownMenuSeparator/>
                <DropdownMenuItem asChild className="w-full cursor-pointer text-muted-foreground">
                    <SignOutButton>
                        Sign Out
                    </SignOutButton>
                </DropdownMenuItem>
            </DropdownMenuContent>
       </DropdownMenu>
    )
}

const Navbar = ({isCollapsed, onResetWidth}: NavbarProps) => {
    const params = useParams();
    
    const document = useQuery(api.documents.getById, {
        documentId: params.documentId as Id<"documents">
    });

    if(document === undefined){
        return (
            <nav className="bg-background dark:bg-[1F1F1F] px-3 py-2 w-full flex items-center">
                <Title.Skeleton/>
            </nav>
        )
    }

    if(document == null){
        return null;
    }


    return ( 
        <>
            <nav className="bg-background dark:bg-[1F1F1F] px-3 py-2 w-full flex justify-between items-center gap-x-4">
                {isCollapsed && (
                    <MenuIcon 
                        role="button"
                        onClick={onResetWidth}
                        className="h-6 w-6 text-muted-foreground"
                    />
                )}
                <div className="flex items-center justify-between w-full">
                    <Title initialData={document}/>
                </div>
                {isCollapsed && (
                    <NavbarAvatar/>
                 )}
            </nav>

            {document.isArchived && (
                <Banner documentId={document._id}/>
            )}
        </>
     );
}
 
export default Navbar;