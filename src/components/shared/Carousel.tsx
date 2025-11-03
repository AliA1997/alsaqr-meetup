import { useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/outline';

type CarouselProps = {
    images: any[];
    entityName: string;
}

export default function Carousel({ images, entityName }:  CarouselProps) {
  const autoplay = useRef(
    Autoplay({
      delay: 7000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
    },
    [autoplay.current]
  );

  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit();
    }
  }, [emblaApi]);

  return (
    <div data-testid="imagescarousel" className="flex-1 md:w-1/2 relative">
      <div className="overflow-hidden rounded-lg" ref={emblaRef}>
        <div className="flex">
          {images.map((image: any, index: number) => (
            <div
              key={index}
              className="relative min-w-full flex justify-center items-center"
            >
              {/* Aspect ratio 1:1 */}
              <div className="w-full pb-[100%] relative">
                <img
                  src={image}
                  alt={entityName}
                  className="absolute top-0 left-0 h-full w-full object-cover rounded-lg"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      <button
        onClick={() => emblaApi && emblaApi.scrollPrev()}
        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow hover:bg-white transition"
      >
        <ArrowLeftIcon className="h-[1.25rem] w-[1.25rem]" />
      </button>
      <button
        onClick={() => emblaApi && emblaApi.scrollNext()}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow hover:bg-white transition"
      >
        <ArrowRightIcon className="h-[1.25rem] w-[1.25rem]" />
      </button>
    </div>
  );
}