"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Loading from "./Loading";

type LoadingImageProps = {
  className?: string;
  position: "start" | "center",
  width: number;
  height: number;
  src: string;
  alt: string;
};

export default function LoadingImage({
  className = "",
  position,
  width,
  height,
  src,
  alt,
}: LoadingImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!loaded) setShowSpinner(true);
    }, 50);

    return () => clearTimeout(timeout);
  }, [loaded]);

  let positionClass;
  if (position === "start") positionClass = "items-start justify-start";
  else if (position === "center") positionClass = "items-center justify-center";

  return (
    <div className={`relative w-[80%] h-[80%] flex ${positionClass}`}>
    {!loaded && showSpinner && (
        <span className={`absolute inset-0 z-10 flex pointer-events-none ${positionClass}`}>
        <Loading />
        </span>
    )}
    {!src &&
    <div style={{width: width, height: height}}></div>
    }
    {src && 
    <Image
      src={src}
      style={{width: width, height: height}}
      width={0}
      height={0}
      alt={alt}
      onLoad={() => setLoaded(true)}
      className={className}
    />
    }
    </div>
  );
}
