import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
    return (
        <div className="w-screen h-screen flex flex-col justify-center items-center">
            <Image src="/1M-logo.png" alt="" width={100} height={100}/>
            <div className="flex flex-col gap-3 text-lg">
                <Link href="/types">
                    <button className="bg-gray-300 w-60 py-2 rounded-md cursor-pointer hover:opacity-85 transition-all duration-150">عرض الوصفات</button>
                </Link>
                <Link href="/admin/types">
                    <button className="bg-gold w-60 py-2 rounded-md cursor-pointer hover:opacity-85 transition-all duration-150">عرض المسؤول</button>
                </Link>
            </div>
        </div>
    )
}