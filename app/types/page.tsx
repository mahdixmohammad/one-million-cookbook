import FoodCard from "@/components/FoodCard";

export default async function Home() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/types`);

  const typesData = await res.json();

  return (
    <div className="flex flex-col px-10 pb-20">
      <div className="my-5 w-fit">
        <h1 className="text-2xl text-black">اختار النوع</h1>
        <div className="bg-gold h-1 w-full"></div>
      </div>
      <div className="xs:grid-cols-2 grid grid-cols-1 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
        {Object.keys(typesData).map((typeName, i) => (
          <FoodCard
            key={i}
            thumbnail={typesData[typeName]["image"]}
            name={typeName}
          />
        ))}
      </div>
    </div>
  );
}
