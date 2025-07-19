import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className="w-screen h-[80vh] flex flex-col justify-center items-center gap-1">
      <h1 className="text-red-800 text-3xl font-bold">لم يتم العثور عليه</h1>
      <p className="text-xl mb-2">لم يتم العثور على المورد المطلوب.</p>
      <Link href="/types" className="bg-black text-white text-xl px-8 py-1 cursor-pointer rounded-md hover:opacity-85 transition-all duration-150">العودة</Link>
    </div>
  )
}
