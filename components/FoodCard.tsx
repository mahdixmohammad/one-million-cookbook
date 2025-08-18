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
      className="relative flex aspect-[1] w-full flex-col items-center gap-3 rounded-md bg-[rgb(50,50,50)] pt-4 shadow shadow-black"
    >
      <LoadingImage
        className="h-[100%] w-[100%] object-contain"
        position="center"
        src={thumbnail}
        width={200}
        height={200}
        alt=""
      />
      <h2 className="xs:text-2xl bg-gold absolute bottom-5 mt-2 w-[90%] rounded-lg py-0.5 text-center text-4xl font-bold text-black sm:text-xl lg:text-2xl xl:text-3xl">
        {name}
      </h2>
    </Link>
  );
}
