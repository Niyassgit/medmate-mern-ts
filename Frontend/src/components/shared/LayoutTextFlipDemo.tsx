import { LayoutTextFlip } from "./LayoutTextFlip";
import { motion } from "motion/react";

export default function LayoutTextFlipDemo() {
  return (
    <div className="py-20 bg-gradient-to-b from-[#0A1A3A] to-black text-white">
      <motion.div className="relative mx-4 flex flex-col items-center justify-center gap-4 text-center sm:mx-0 sm:mb-0 sm:flex-row">
        <LayoutTextFlip
          text="Choose a plan that gives you "
          words={[
            "More Visibility",
            "More Connections",
            "More Opportunities",
            "More Growth",
          ]}
        />
      </motion.div>

      <p className="mt-4 text-center text-lg text-gray-300 max-w-2xl mx-auto">
        Unlock premium features designed to grow your professional network, 
        reach more doctors & reps, and accelerate your business success.
      </p>
    </div>
  );
}
