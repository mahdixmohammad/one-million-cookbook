import Image from "next/image";
import Link from "next/link";
import UserIcon from "./UserIcon";

export default function NavBar() {
    return (
        <nav className="h-16 w-screen px-10 py-10 flex items-center justify-between">
            <Link href="/types">
                <Image src="/1M-logo.png" width={60} height={60} alt="" />
            </Link>
            <UserIcon />
        </nav>
    )
}