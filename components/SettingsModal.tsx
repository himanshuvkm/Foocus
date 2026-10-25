"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export type Settings = {
  focusMinutes: number;
  shortMinutes: number;
  longMinutes: number;
};

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onSave: (newSettings: Settings) => void;
}

function SettingsForm({
  settings,
  onClose,
  onSave,
}: {
  settings: Settings;
  onClose: () => void;
  onSave: (newSettings: Settings) => void;
}) {
  const [focus, setFocus] = useState(settings.focusMinutes);
  const [short, setShort] = useState(settings.shortMinutes);
  const [long, setLong] = useState(settings.longMinutes);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clampedFocus = Math.max(1, Math.min(180, Number(focus) || 25));
    const clampedShort = Math.max(1, Math.min(60, Number(short) || 5));
    const clampedLong = Math.max(1, Math.min(90, Number(long) || 15));

    onSave({
      focusMinutes: clampedFocus,
      shortMinutes: clampedShort,
      longMinutes: clampedLong,
    });
    onClose();
  };

  return (
    <div className="relative w-full max-w-sm bg-neutral-950 border border-neutral-800 rounded-2xl p-6 text-white shadow-2xl">
      <div className="flex items-center justify-between pb-4 border-b border-neutral-900">
        <span className="text-[11px] uppercase tracking-[0.3em] text-neutral-400 font-medium">
          Timer Settings
        </span>
        <button
          type="button"
          onClick={onClose}
          className="text-neutral-500 hover:text-white transition-colors cursor-pointer"
          aria-label="Close settings"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div className="space-y-1.5">
          <label className="text-[11px] uppercase tracking-wider text-neutral-500 block">
            Focus (minutes)
          </label>
          <input
            type="number"
            min={1}
            max={180}
            value={focus}
            onChange={(e) => setFocus(Number(e.target.value))}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-white transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] uppercase tracking-wider text-neutral-500 block">
            Short Break (minutes)
          </label>
          <input
            type="number"
            min={1}
            max={60}
            value={short}
            onChange={(e) => setShort(Number(e.target.value))}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-white transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] uppercase tracking-wider text-neutral-500 block">
            Long Break (minutes)
          </label>
          <input
            type="number"
            min={1}
            max={90}
            value={long}
            onChange={(e) => setLong(Number(e.target.value))}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-white transition-colors"
          />
        </div>

        <div className="pt-2 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              setFocus(25);
              setShort(5);
              setLong(15);
            }}
            className="text-[11px] text-neutral-600 hover:text-neutral-400 transition-colors cursor-pointer"
          >
            Reset defaults
          </button>

          <button
            type="submit"
            className="px-5 py-2 text-xs font-medium uppercase tracking-wider bg-white text-black rounded-lg hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export function SettingsModal({
  isOpen,
  onClose,
  settings,
  onSave,
}: SettingsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="relative z-10 w-full max-w-sm"
          >
            <SettingsForm
              settings={settings}
              onClose={onClose}
              onSave={onSave}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
