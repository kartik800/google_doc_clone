import { Button } from "@/components/ui/button";
import Logo from "./logo";

const Footer = () => {
    return ( 
    <div className="flex items-center w-full p-6 bg-background z-50 dark:bg-[#1F1F1F]">
        Documents
        {/* <Logo/> */}
        <div className="md:ml-auto w-full justify-between md:justify-end flex items-center gap-x-2 text-muted-foreground">
            <Button variant={"ghost"} size={"sm"}>
                Privacy policy
            </Button>
            <Button variant={"ghost"} size={"sm"}>
                Terms and Condition
            </Button>
        </div>
    </div> );
}
 
export default Footer;