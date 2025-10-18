"use client";

import { ArrowLeftCircle, ArrowRightCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { type ProjectMediaRead } from "@/modules/projects/schemas/projects.read.schema";
import { ImageSlide } from "@/modules/ui/components/image-slide";

export const ProjectSlider = ({
    images,
    projectName,
}: {
    images: ProjectMediaRead[];
    projectName: string;
}) => {
    const containerRef = useRef<HTMLDivElement>(null!);
    const innerContentRef = useRef<HTMLDivElement>(null!);
    const [shouldSlide, setShouldSlide] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        evaluateShouldSlide();
    }, [evaluateShouldSlide]);

    const evaluateShouldSlide = () => {
        const innerContentWidth = innerContentRef.current?.scrollWidth ?? 0;
        const containerWidth = containerRef.current?.offsetWidth ?? 0;
        const shouldSlide = innerContentWidth > containerWidth;

        setShouldSlide(shouldSlide);
    };

    useEffect(() => {
        if (!shouldSlide) return;
        // animate innerContentScroll so that the current slide has scrollLeft 0
        innerContentRef.current.style.transition = "transform 0.5s ease-in-out";
        // compute the distance of the current slide from the left of the innerContentRef
        const slideElement = innerContentRef.current.children[
            currentSlide
        ] as HTMLDivElement;
        const slideLeft = slideElement.offsetLeft;

        innerContentRef.current.style.transform = `translateX(-${slideLeft}px)`;
    }, [currentSlide, shouldSlide]);
    const windowHeight = window.innerHeight;
    return (
        <div
            style={{ height: `${(windowHeight / 3) * 2}px` }}
            className={`relative z-0 overflow-hidden bg-accent p-8 shadow-2xl`}
            ref={containerRef}
        >
            <div
                className="pointer-events-none flex h-full w-fit gap-4"
                ref={innerContentRef}
            >
                {images.map((image) => (
                    <ImageSlide
                        key={image.id}
                        src={image.url!}
                        alt={projectName ?? ""}
                        onLoaded={evaluateShouldSlide}
                    />
                ))}
            </div>
            {shouldSlide && (
                <div className="absolute inset-x-4 inset-y-0 flex items-center justify-between">
                    <ArrowLeftCircle
                        opacity={currentSlide === 0 ? 0.5 : 1}
                        height={40}
                        width={40}
                        onClick={() =>
                            setCurrentSlide((prev) => {
                                const nextSlide = prev - 1;
                                if (nextSlide < 0) return 0;
                                return prev - 1;
                            })
                        }
                        className="cursor-pointer text-white"
                    />
                    <ArrowRightCircle
                        opacity={currentSlide === images.length - 1 ? 0.5 : 1}
                        onClick={() =>
                            setCurrentSlide((prev) => {
                                const nextSlide = prev + 1;
                                if (nextSlide >= images.length) return prev;
                                return prev + 1;
                            })
                        }
                        height={40}
                        width={40}
                        className="cursor-pointer text-white"
                    />
                </div>
            )}
        </div>
    );
};
