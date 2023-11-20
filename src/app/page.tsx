/* eslint-disable react-hooks/exhaustive-deps */
"use client";

// libraries
import { useEffect, useState } from "react";

// functions
import { ChimeAttendee, ChimeConfig, createAttendee } from "@/lib/chime";
import { getChimeConfig } from "@/lib/firebase";
import { ChimeProvider } from "@/lib/chimeProvider";

// components
import { StartDialogue } from "@/components/startDialogue";
import { UserControls } from "@/components/userControls";
import { Logo } from "@/components/logo";
import { Attendees } from "@/components/attendees";
import { Chat } from "@/components/chat";

export default function Home() {
  const [callId, setCallId] = useState<string | null>(null);
  const [chimeConfig, setChimeConfig] = useState<ChimeConfig | null>(null);
  const [attendee, setAttendee] = useState<ChimeAttendee | null>(null);
  const [chimeProvider, setChimeProvider] = useState<ChimeProvider | null>(
    null
  );

  useEffect(() => {
    if (callId) {
      console.log("loading:", callId);
      loadChimeConfig();
    }
  }, [callId]);

  async function connectAttendee(data: FormData) {
    const name = data.get("user-name")?.toString();
    if (chimeConfig && name) {
      const attendee = await createAttendee(chimeConfig, name);
      if (!attendee) {
        return;
      }

      setAttendee(attendee);
      console.log("attendee generated");

      const meeting = new ChimeProvider(chimeConfig, attendee);
      if (meeting) {
        setChimeProvider(meeting);
      }
    }
  }

  async function leaveCall() {
    if (!chimeProvider) {
      return;
    }
    chimeProvider.leaveCall().then(() => {
      setAttendee(null);
      setChimeConfig(null);
      setCallId(null);
      setChimeProvider(null);
    });
  }

  async function loadChimeConfig() {
    if (!callId) {
      return;
    }
    const config = await getChimeConfig(callId);

    if (!config) {
      return;
    }

    setChimeConfig(config);
  }

  function VideoCall() {
    if (!attendee) {
      return (
        <div className="p-20 w-full">
          <Logo />
          <form action={connectAttendee} className="flex flex-col items-center">
            <input
              style={{ width: 300 }}
              placeholder="Enter your display name"
              type="text"
              name="user-name"
            ></input>
            <button>Join</button>
          </form>
        </div>
      );
    }

    if (!callId || !chimeConfig || !attendee.ExternalUserId) {
      return;
    }
    return (
      <div className="w-full h-5/6">
        <UserControls
          callId={callId}
          leaveCall={leaveCall}
          timeStamp={chimeConfig.startTime}
        />
        <div
          className="flex flex-row w-full justify-between"
          style={{ height: "80vh" }}
        >
          <Attendees chimeProvider={chimeProvider as ChimeProvider} />
          <Chat callId={callId} userId={attendee.ExternalUserId} />
        </div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-2 w-full">
      <div className="z-10 items-center justify-between font-mono text-sm flex flex-wrap w-full">
        <audio id="chime-audio" />
        {callId ? <VideoCall /> : <StartDialogue idSetter={setCallId} />}
      </div>
    </main>
  );
}
