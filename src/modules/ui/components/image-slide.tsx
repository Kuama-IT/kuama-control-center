"use client";
import { useEffect, useRef } from "react";
import NextImage from "next/image";

export const ImageSlide = ({
  alt,
  src,
  onLoaded,
}: {
  alt: string;
  src: string;
  onLoaded?: () => void;
}) => {
  const ref = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    if (!ref.current) return;
    const img = new Image();

    img.onload = function () {
      const imgRatio = img.width / img.height;
      const containerHeight = ref.current.offsetHeight;
      const containerWidth = containerHeight * imgRatio;
      ref.current.style.width = `${containerWidth}px`;
      ref.current.style.minWidth = `${containerWidth}px`;
    };

    img.src = src;
  }, [ref]);
  return (
    <div className="relative h-full overflow-hidden rounded-xl" ref={ref}>
      <NextImage
        onLoadingComplete={() => onLoaded?.()}
        src={src}
        alt={alt}
        style={{ objectFit: "cover" }}
        fill={true}
      />
    </div>
  );
};
