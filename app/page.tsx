import FoodCard from "@/components/FoodCard";
import Image from "next/image";

export default async function Home() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/types`, {
    cache: "no-store",
  });

  const typesData = await res.json();

  return (
    <div className="px-10 pt-5 pb-20 flex flex-col">
      <Image className="mb-5" src="/1M-logo.png" width={60} height={60} alt="" />
      <div className="w-fit mb-10">
        <h1 className="text-2xl">Select Type</h1>
        <div className="w-full h-1 bg-yellow-500"></div>
      </div>
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-5 gap-y-10">
        {Object.keys(typesData).map((typeName, i) => (
          <FoodCard
            key={i}
            thumbnail={Object.entries(typesData[typeName])[0][1]["image"]}
            name={typeName[0].toUpperCase() + typeName.slice(1)}
          />
        ))}
      </div>
    </div>
  );
}
