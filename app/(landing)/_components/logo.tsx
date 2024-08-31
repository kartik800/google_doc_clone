
/* 
    "cn" libary is used to append dynamic classes to tailwind elements 
    without worrying about overriding and incorrect merging
    we can also use template literals
*/
import { cn } from "@/lib/utils"; 
import { Poppins } from "next/font/google";
import Image from "next/image";

const font = Poppins({
    subsets: ["latin"],
    weight: ["400", "600"],
});

const Logo = () => {
    return ( 
    <div className="hidden md:flex items-center gap-x-2">
        <Image
            src={"/logo.svg"}
            alt="logo"
            height={"40"}
            width={"40"}
        />
        <p className={cn("font-bold text-blue-300", font.className)}>
            Documents
        </p>
    </div> 
);
}
 
export default Logo;