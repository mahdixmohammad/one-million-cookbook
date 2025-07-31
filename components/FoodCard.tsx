"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LoadingImage from "./LoadingImage";

type Props = {
  thumbnail: string;
  name: string;
};

export default function FoodCard({ thumbnail, name }: Props) {
  const pathname = usePathname();
  const fullPath = `${pathname.endsWith("/") ? pathname : pathname + "/"}${name}`;

  return (
    <Link
      href={fullPath}
      className="relative aspect-[1] w-full bg-[rgb(50,50,50)] rounded-md flex flex-col gap-3 pt-4 items-center shadow shadow-black"
    >
      <LoadingImage
        className="w-[100%] h-[100%] object-contain"
        position="center"
        src={thumbnail}
        width={200}
        height={200}
        alt=""
      />
      <h2 className="absolute bottom-5 mt-2 w-[90%] text-center text-4xl xs:text-2xl sm:text-xl lg:text-2xl xl:text-3xl font-bold text-black bg-gold py-0.5 rounded-lg">
        {name}
      </h2>
    </Link>
  );
}
