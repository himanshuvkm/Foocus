"use client";

import { motion, AnimatePresence } from "framer-motion";

interface AnimatedDigitProps {
  digit: string;
}

export function AnimatedDigit({ digit }: AnimatedDigitProps) {
  return (
    <div className="relative w-[0.65em] h-[1em] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.span
          key={digit}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.18, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {digit}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
