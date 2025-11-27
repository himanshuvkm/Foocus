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
    <div className="bg-black text-white">
      <div className="border-b-2 border-gray-600 border-opacity-50 h-16 flex justify-between px-12 py-3">

        {/* LOGO */}
        <div className="flex flex-col items-center justify-center gap-8 text-white">
          <div className="flex items-center gap-1 font-black text-4xl tracking-wider uppercase">
            <span className="font-serif">F</span>

            {/* Double Eyes "OO" */}
            <div className="flex gap-1 mx-0.5">
              <TextEye />
              <TextEye />
            </div>

            <span className="font-serif">CUS</span>
          </div>
        </div>

  
        <div className="flex flex-row items-end gap-2">
          <h1 className="font-bold text-4xl leading-none">
            {format(time, "hh:mm:ss")}
          </h1>
          <p className="text-xl leading-none pb-1">
            {format(time, "bb")}
          </p>
        </div>

      </div>
    </div>
  );
}
