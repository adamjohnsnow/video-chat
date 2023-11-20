"use client";

import { ChimeProvider } from "@/lib/chimeProvider";
import { VideoTileState } from "amazon-chime-sdk-js";
import { useEffect, useState } from "react";
import { AttendeeVideo } from "./attendeeVideo";

export function Attendees({ chimeProvider }: { chimeProvider: ChimeProvider }) {
  const [attendeeList, setAttendeeList] = useState<VideoTileState[]>([]);

  useEffect(() => {
    chimeProvider.meetingSession.audioVideo.addObserver({
      videoTileDidUpdate: (tileState: VideoTileState): void => {
        if (!tileState.localTile && tileState.boundExternalUserId) {
          if (
            attendeeList.some(
              (attendee) =>
                attendee.boundAttendeeId === tileState.boundAttendeeId
            )
          ) {
            return;
          }
          setAttendeeList([...attendeeList, tileState]);

          setTimeout(() => {
            const attendeeVid = document.getElementById(
              ("vid-" + tileState.boundAttendeeId) as string
            ) as HTMLVideoElement;
            if (!attendeeVid) {
              console.log("vid tile not found");
              return;
            }
            chimeProvider.meetingSession.audioVideo.bindVideoElement(
              tileState.tileId as number,
              attendeeVid
            );
          }, 1000);
        }
      },
    });
  }, [attendeeList, chimeProvider.meetingSession?.audioVideo]);

  return (
    <div className="flex m-4">
      {attendeeList?.map((attendee, i) => {
        return (
          <AttendeeVideo
            key={i}
            name={attendee.boundExternalUserId as string}
            id={attendee.boundAttendeeId as string}
          />
        );
      })}
    </div>
  );
}
