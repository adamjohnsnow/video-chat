import { FirebaseApp, initializeApp } from "firebase/app";
import {
  ref,
  set,
  getDatabase,
  Database,
  child,
  get,
  push,
  onValue,
  onChildAdded,
} from "firebase/database";
import { ChimeConfig } from "./chime";
import { Meeting } from "@aws-sdk/client-chime-sdk-meetings";
import { subscribe } from "diagnostics_channel";

let app: FirebaseApp;
let db: Database;

if (
  process.env.NEXT_PUBLIC_FIREBASE_URL &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECTID
) {
  const firebaseConfig = {
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID,
  };

  app = initializeApp(firebaseConfig);
  db = getDatabase(app);
}

export function writeChimeData(callId: string, meeting: Meeting) {
  const timestamp = new Date();
  const chimeConfig: ChimeConfig = {
    ...meeting,
    startTime: timestamp.toISOString(),
  };
  set(ref(db, callId + "/chime"), chimeConfig);
}

export async function getChimeConfig(
  callId: string
): Promise<ChimeConfig | null> {
  const dbRef = ref(db);
  const snapshot = await get(child(dbRef, callId + "/chime"));
  if (snapshot.exists()) {
    const chime = snapshot.val() as ChimeConfig;
    console.log("config found");
    return chime;
  } else {
    console.log("No data available");
    return null;
  }
}

export async function writeChatPost(
  userId: string,
  callId: string,
  postContent: string
) {
  push(ref(db, callId + "/chat"), { userId: userId, post: postContent });
}

export function subscribeToChat(callId: string, callback: any) {
  onChildAdded(ref(db, callId + "/chat"), (snapshot) => {
    callback(snapshot.val());
  });
}

export async function getChatHistory(callId: string) {
  const dbRef = ref(db);
  const snapshot = await get(child(dbRef, callId + "/chat"));
  if (snapshot.exists()) {
    console.log("chat found", snapshot.val());
    return snapshot.val();
  } else {
    console.log("No data available");
    return null;
  }
}
