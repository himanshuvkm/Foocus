import Header from "@/components/Header";
import { PomodoroTimer } from "@/components/pomodoro";

export default function Home() {
  return (
   <div className="flex min-h-screen flex-col ">
  
  <div>
    <Header />
  </div>

  <div className="flex flex-1 justify-center items-center">
    <PomodoroTimer />
  </div>

</div>

  )
}

