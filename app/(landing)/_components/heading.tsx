'use client';

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";


const Heading = () => {
    return (
    <div className="max-w-3xl space-y-4">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
        Build your best ideas together, in Google Docs
        </h1>
        <h3 className="text-base sm:text-xl md:text-2xl font-medium">
            Create and collaborate on online documents in <br/> real-time and from any device.
        </h3>
        <Button variant={"outline"} size={"lg"}>
            Go to docs
            <ArrowRight className="h-4 w-4 ml-2"/>
        </Button>
    </div> 
    
);
}
 
export default Heading;