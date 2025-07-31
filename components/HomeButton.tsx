import { HomeIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function HomeButton() {
    return (
        <Link href="/">
            <HomeIcon className="w-8" />
        </Link>
    )
}