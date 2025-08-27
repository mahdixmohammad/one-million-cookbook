"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Loading from "./Loading";

type LoadingImageProps = {
  className?: string;
  loadingSize?: "small" | "medium";
  position: "start" | "center";
  width: number;
  height: number;
  src: string;
  alt: string;
};

export default function LoadingImage({
  className = "",
  loadingSize = "medium",
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
    <div className={`relative flex h-[80%] w-[80%] ${positionClass}`}>
      {!loaded && showSpinner && (
        <span
          className={`pointer-events-none absolute inset-0 z-10 flex ${positionClass}`}
        >
          <Loading size={loadingSize} />
        </span>
      )}
      {!src && <div style={{ width: width, height: height }}></div>}
      {src && (
        <Image
          src={src}
          style={{ width: width, height: height }}
          width={0}
          height={0}
          alt={alt}
          onLoad={() => setLoaded(true)}
          className={className}
        />
      )}
    </div>
  );
}
