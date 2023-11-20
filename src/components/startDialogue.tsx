"use client";

import { newChime } from "@/lib/chime";
import { writeChimeData } from "@/lib/firebase";
import { Dispatch, SetStateAction } from "react";
import uuid from "short-uuid";
import { Logo } from "./logo";

export function StartDialogue({
  idSetter,
}: {
  idSetter: Dispatch<SetStateAction<string | null>>;
}) {
  function newCall() {
    console.log("start new call");
    const callId = uuid.generate();

    newChime(callId).then((chimeData) => {
      if (chimeData) {
        writeChimeData(callId, chimeData);
      }
      idSetter(callId);
    });
  }

  function joinCall(data: FormData) {
    const id = data.get("call-id");

    if (!id) {
      return;
    }

    idSetter(id.toString());
  }

  return (
    <div className="flex flex-col items-center p-20 w-full">
      <Logo />
      <div className="m-2">
        <form action={newCall}>
          <button>Start new call</button>
        </form>
      </div>
      <div>--- or ---</div>
      <div className="flex m-2">
        <form action={joinCall} className="flex flex-col items-center">
          <input
            disabled={false}
            name="call-id"
            type="text"
            placeholder="Enter call ID"
          ></input>
          <div>
            <button>Continue</button>
          </div>
        </form>
      </div>
    </div>
  );
}
