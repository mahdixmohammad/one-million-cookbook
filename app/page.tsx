import FoodCard from "@/components/FoodCard";
import Image from "next/image";

export default function Home() {
  return (
    <div className="px-10 pt-5 pb-20 flex flex-col">
      <Image className="mb-5" src="/1M-logo.png" width={60} height={60} alt="" />
      <div className="w-fit mb-10">
        <h1 className="text-2xl">Select Type</h1>
        <div className="w-full h-1 bg-yellow-500"></div>
      </div>
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-5 gap-y-10">
        {[...Array(8)].map((_, i) => (
          <FoodCard key={i} thumbnail="/cake.png" name="Cake" />
        ))}
      </div>
    </div>
  );
}
