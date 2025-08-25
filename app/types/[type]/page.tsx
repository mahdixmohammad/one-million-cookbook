import FoodCard from "@/components/FoodCard";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ type: string }>;
};

export default async function Type(props: Props) {
  let { type } = await props.params;
  type = decodeURIComponent(type);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/types/${type}`,
    {
      cache: "no-store",
    },
  );

  const typeData = await res.json();

  if (typeData["error"]) notFound();

  return (
    <div className="flex flex-col px-10 pb-20">
      <div className="mb-5 w-fit">
        <h1 className="text-2xl">اختار المنتج</h1>
        <div className="bg-gold h-1 w-full"></div>
      </div>
      <Link
        href="/types"
        className="group relative mb-5 flex h-10 w-26 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-gray-50 text-center text-lg shadow"
        type="button"
      >
        <div className="absolute top-[0px] left-[-1px] z-10 flex h-10 w-8 items-center justify-center rounded-2xl bg-white shadow duration-400 group-hover:w-26">
          <svg
            className="h-[20px] w-[20px] rotate-180"
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
      {typeData["items"] ? (
        <div className="xs:grid-cols-2 grid grid-cols-1 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {Object.keys(typeData["items"]).map((itemName, i) => (
            <FoodCard
              key={i}
              thumbnail={typeData.items[itemName].image}
              name={itemName}
            />
          ))}
        </div>
      ) : (
        <h2 className="text-2xl font-bold text-red-800">
          لا يوجد أي منتجات متاحة حاليًا. تحقق لاحقًا.
        </h2>
      )}
    </div>
  );
}
