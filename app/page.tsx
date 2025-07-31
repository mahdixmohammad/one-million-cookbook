import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
    return (
        <div className="w-screen h-[90vh] flex flex-col justify-center items-center gap-5">
            <Image src="/one-million-logo.jpg" alt="" width={240} height={200}/>
            <div className="flex flex-col gap-3 text-lg">
                <Link href="/types">
                    <button className="bg-gray-300 w-60 py-2 rounded-md cursor-pointer hover:opacity-85 transition-all duration-150">دخول الموظف</button>
                </Link>
                <Link href="/admin/types">
                    <button className="bg-[rgb(50,50,50)] text-white w-60 py-2 rounded-md cursor-pointer hover:opacity-85 transition-all duration-150">دخول المسؤول</button>
                </Link>
            </div>
        </div>
    )
}