"use client";

import { TimerMain } from '@/components/timer/timer-main';
import { TaskList } from '@/components/tasks/task-list';
import { Header } from '@/components/layout/header';
import { motion } from 'framer-motion';

import { StatsDashboard } from '@/components/stats/stats-dashboard';


export default function Home() {
  return (
    <main className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      <Header />
      

      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="container mx-auto px-4 py-12 min-h-full flex flex-col gap-12">

          {/* Timer Hero Section */}
          <motion.section
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center"
          >
            <TimerMain />
          </motion.section>

          {/* Stats Section */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <StatsDashboard />
          </motion.section>

          {/* Tasks Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-2xl mx-auto"
          >
            <TaskList />
          </motion.section>
        </div>
      </div>
    </main>
  );
}
