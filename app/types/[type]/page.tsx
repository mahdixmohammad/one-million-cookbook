import FoodCard from "@/components/FoodCard";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ type: string; }>;
};

export default async function Type(props: Props) {
  let { type } = await props.params;
  type = decodeURIComponent(type);

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/types/${type}`, {
    cache: "no-store",
  });

  const typeData = await res.json();

  if (typeData["error"]) notFound();

  return (
    <div className="px-10 pb-20 flex flex-col">
      <div className="w-fit mb-5">
        <h1 className="text-2xl">اختار المنتج</h1>
        <div className="w-full h-1 bg-gold"></div>
      </div>
      <Link href="/types"
        className="flex items-center justify-center mb-5 text-center text-lg w-26 rounded-2xl h-10 relative group cursor-pointer shadow border-2 border-gray-50 overflow-hidden"
        type="button"
        >
            <div
                className="bg-white shadow rounded-2xl h-10 w-8 flex items-center justify-center absolute left-[-1px] top-[0px] group-hover:w-26 z-10 duration-400"
            >
                <svg
                className="rotate-180 w-[20px] h-[20px]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1024 1024"
                
                >
                <path
                    d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
                    fill="rgb(212,175,55)"
                ></path>
                <path
                    d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
                    fill="rgb(212,175,55)"
                ></path>
                </svg>
            </div>
            <p className="translate-x-2">العودة</p>
        </Link>
      {
        typeData["items"]
        ?
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-5 gap-y-10">
        {Object.keys(typeData["items"]).map((itemName, i) => (
          <FoodCard
            key={i}
            thumbnail={typeData.items[itemName].image}
            name={itemName}
          />
        ))}
      </div>
      :
      <h2 className="text-2xl font-bold text-red-800">لا يوجد أي منتجات متاحة حاليًا. تحقق لاحقًا.</h2>
      }
    </div>
  );
}
