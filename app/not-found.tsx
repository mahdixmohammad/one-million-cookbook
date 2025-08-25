import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-[90vh] w-screen flex-col items-center justify-center gap-1">
      <h1 className="text-3xl font-bold text-red-800">لم يتم العثور عليه</h1>
      <p className="mb-2 text-xl">لم يتم العثور على المورد المطلوب.</p>
      <Link
        href="/"
        className="rounded-md bg-black px-15 py-1 text-xl text-white transition-all duration-150 hover:opacity-85"
      >
        العودة
      </Link>
    </div>
  );
}
