"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";


// ----------------------
// ANIMATED EYE COMPONENT
// ----------------------
function TextEye() {
  return (
    <div className="relative flex w-8 h-8 items-center justify-center rounded-full bg-white shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)] border border-slate-200 overflow-hidden">
      <motion.div
        className="h-3 w-3 rounded-full bg-black relative"
        animate={{
          x: [0, 6, 0, -6, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Highlight dot stays stable */}
        <div className="absolute right-0.5 top-0.5 h-1 w-1 rounded-full bg-white opacity-80 pointer-events-none" />
      </motion.div>
    </div>
  );
}


// ----------------------
// HEADER COMPONENT
// ----------------------
export default function Header() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
 <nav className="w-full bg-black border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16 md:h-18 lg:h-20">
          
          {/* LOGO */}
          <div className="flex items-center">
            <div className="flex items-center gap-0.5 sm:gap-1 font-black text-base sm:text-xl md:text-2xl lg:text-3xl tracking-wider uppercase">
              <span className="font-serif text-white">F</span>

              {/* Double Eyes "OO" */}
              <div className="flex gap-0.5 mx-0.5">
                <TextEye />
                <TextEye />
              </div>

              <span className="font-serif text-white">CUS</span>
            </div>
          </div>

          {/* TIME */}
          <div className="flex flex-row items-end gap-1 sm:gap-1.5 md:gap-2">
            <h1 className="font-bold text-base sm:text-xl md:text-2xl lg:text-3xl leading-none tabular-nums text-white">
              {format(time, "hh:mm:ss")}
            </h1>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg leading-none pb-0.5 text-white">
              {format(time, "bb")}
            </p>
          </div>

        </div>
      </div>
    </nav>
  );
}
