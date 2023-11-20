/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Logo } from "./logo";

export function UserControls({
  callId,
  leaveCall,
  timeStamp,
}: {
  callId: string;
  leaveCall: () => void;
  timeStamp: string;
}) {
  return (
    <div className="flex items-center flex-wrap justify-between">
      <Logo />
      <div className="flex flex-col">
        <div>Meeting ID: {callId}</div>
        <div>
          <Timer startTime={timeStamp} />
        </div>
      </div>
      <div className="w-48 h-40 bg-slate-500 rounded-lg">
        <video id="local" />
      </div>
      <div className="m-5">
        <form action={leaveCall}>
          <button>Leave call</button>
        </form>
      </div>
    </div>
  );
}

function Timer({ startTime }: { startTime: string }) {
  const [elapsed, setElapsed] = useState<string>("");
  const targetTime = new Date(startTime).getTime();

  function startTimer() {
    setInterval(() => {
      const currentTime = new Date().getTime();
      const timeDifference = currentTime - targetTime;
      const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
      const minutes = Math.floor(
        (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
      );
      const hours = Math.floor(
        (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      let hourString, minString, secString;
      hours < 10 ? (hourString = `0${hours}`) : (hourString = `${hours}`);
      minutes < 10 ? (minString = `0${minutes}`) : (minString = `${minutes}`);
      seconds < 10 ? (secString = `0${seconds}`) : (secString = `${seconds}`);

      setElapsed(`${hourString}:${minString}:${secString}`);
    }, 1000);
  }

  useEffect(() => {
    startTimer();
  }, []);
  return <div>Timer: {elapsed}</div>;
}
