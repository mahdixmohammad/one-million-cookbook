import Image from "next/image";
import Link from "next/link";
import UserButton from "./UserButton";
import HomeIcon from "./HomeButton";

export default function NavBar() {
    return (
        <nav className="h-16 w-full px-5 sm:px-10 py-10 flex items-center justify-between">
            <Link href="/types">
                <Image src="/one-million-logo.jpg" width={140} height={50} alt="" />
            </Link>
            <div className="flex gap-4">
                <UserButton />
                <HomeIcon />
            </div>
        </nav>
    )
}