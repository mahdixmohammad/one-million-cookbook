import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex h-[90vh] w-screen flex-col items-center justify-center gap-5">
      <Image src="/one-million-logo.jpg" alt="" width={240} height={200} />
      <div className="flex flex-col gap-3 text-lg">
        <Link href="/types">
          <button className="w-60 cursor-pointer rounded-md bg-gray-300 py-2 transition-all duration-150 hover:opacity-85">
            دخول الموظف
          </button>
        </Link>
        <Link href="/admin/">
          <button className="w-60 cursor-pointer rounded-md bg-[rgb(50,50,50)] py-2 text-white transition-all duration-150 hover:opacity-85">
            دخول المسؤول
          </button>
        </Link>
      </div>
    </div>
  );
}
