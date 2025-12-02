import { DoctorCardGuestDTO } from "@/features/shared/dto/DoctorCardGuestDTO";
import userIconPng from "@/assets/userIconPng.png";

const CreateCard = ({ card }: { card: DoctorCardGuestDTO }) => (
  <div className="p-4 rounded-lg mx-4 shadow hover:shadow-lg transition-all duration-200 w-72 shrink-0 bg-white">
    <div className="flex gap-2">
      <img
        className="size-11 rounded-full"
        src={card.profileImage ?? userIconPng}
        alt={card.name}
      />
      <div className="flex flex-col">
        <p className="font-semibold text-gray-800">{card.name}</p>
        <span className="text-xs text-slate-500">{card.hospitalName}</span>
      </div>
    </div>

    {/* About Text */}
    <p className="text-sm py-4 text-gray-700 line-clamp-2">
      {card.about || "No description available"}
    </p>

    {/* Date */}
    <div className="flex items-center justify-between text-slate-500 text-xs">
      <span>Joined On</span>
      <p>{new Date(card.createdAt).toLocaleDateString()}</p>
    </div>
  </div>
);

const ReviewMarquee = ({ cardsData }: { cardsData: DoctorCardGuestDTO[] }) => {
  return (
    <>
      <style>{`
        @keyframes marqueeScroll {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .marquee-inner {
          animation: marqueeScroll 25s linear infinite;
        }
        .marquee-reverse {
          animation-direction: reverse;
        }
      `}</style>

      <div className="marquee-row w-full mx-auto max-w-6xl overflow-hidden relative">
        <div className="marquee-inner flex transform-gpu min-w-[200%] gap-2 py-6">
          {[...cardsData, ...cardsData].map((card, index) => (
            <CreateCard key={index} card={card} />
          ))}
        </div>
      </div>

      <div className="marquee-row w-full mx-auto max-w-6xl overflow-hidden relative">
        <div className="marquee-inner marquee-reverse flex transform-gpu min-w-[200%] gap-2 py-6">
          {[...cardsData, ...cardsData].map((card, index) => (
            <CreateCard key={index} card={card} />
          ))}
        </div>
      </div>
    </>
  );
};

export default ReviewMarquee;
