"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Loading from "./Loading";

type Props = {
  thumbnail: string;
  name: string;
};

export default function FoodCard({ thumbnail, name }: Props) {
  const [loaded, setLoaded] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const pathname = usePathname();
  const fullPath = `${pathname.endsWith("/") ? pathname : pathname + "/"}${name}`;

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!loaded) setShowSpinner(true);
    }, 100); // delay showing spinner (adjust as needed)

    return () => clearTimeout(timeout);
  }, [loaded]);

  return (
    <Link
      href={fullPath}
      className="relative aspect-[1] w-full bg-gray-700 rounded-md flex flex-col gap-3 pt-4 items-center shadow shadow-black"
    >
      {showSpinner && !loaded && (
        <div className="absolute w-[80%] h-[80%] flex items-center justify-center">
          <Loading />
        </div>
      )}

      <Image
        className={`w-[80%] h-[80%] object-contain`}
        src={thumbnail}
        width={200}
        height={200}
        alt=""
        onLoad={() => setLoaded(true)}
      />

      <h2 className="absolute bottom-5 mt-2 w-[90%] text-center text-4xl xs:text-2xl sm:text-xl lg:text-2xl xl:text-3xl font-bold text-black bg-gold py-0.5 rounded-lg">
        {name}
      </h2>
    </Link>
  );
}
