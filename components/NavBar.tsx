import Image from "next/image";
import Link from "next/link";
import UserButton from "./UserButton";
import HomeIcon from "./HomeButton";

export default function NavBar() {
  return (
    <nav className="flex h-16 w-full items-center justify-between px-5 py-10 sm:px-10">
      <Link href="/types">
        <Image src="/one-million-logo.jpg" width={140} height={50} alt="" />
      </Link>
      <div className="flex gap-4">
        <UserButton />
        <HomeIcon />
      </div>
    </nav>
  );
}
