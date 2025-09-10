import { useEffect,useState } from "react";

interface DotsProps{
    slidesCount:number;
    selectedIndex:number;
    scrollTo:(index:number)=>void;
}

const CarouselDots = ({ slidesCount, selectedIndex, scrollTo }: DotsProps) => {
  return (
    <div className="flex justify-center mt-6 space-x-2">
      {Array.from({ length: slidesCount }).map((_, i) => (
        <button
          key={i}
          onClick={() => scrollTo(i)}
          className={`w-3 h-3 rounded-full transition ${
            selectedIndex === i ? "bg-[#25b6c0]" : "bg-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

export default CarouselDots
