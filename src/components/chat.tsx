/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { subscribeToChat, writeChatPost, getChatHistory } from "@/lib/firebase";
import { useEffect, useState } from "react";

export function Chat({ callId, userId }: { callId: string; userId: string }) {
  const [chatPosts, setChatPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState<any>();

  useEffect(() => {
    refreshChat();
  }, []);

  useEffect(() => {
    setChatPosts([newPost, ...chatPosts]);
  }, [newPost]);

  function recieveChatPost(data: any) {
    setNewPost(data);
  }

  async function refreshChat() {
    await subscribeToChat(callId, recieveChatPost);
    const chatHistory = await getChatHistory(callId);
    if (!chatHistory) {
      return;
    }
    const posts = Object?.values(chatHistory);
    console.log("posts:", posts);
    setChatPosts(posts);
  }

  function postToChat(data: FormData) {
    const post = data.get("chat-input")?.toString();
    if (post) {
      writeChatPost(userId, callId, post);
    }
    const input = document.getElementById("chat-input") as HTMLInputElement;
    if (input) {
      input.value = "";
    }
  }

  return (
    <div className="w-80 min-h-max bg-white rounded-md p-4 m-4 flex flex-col-reverse">
      <div className="flex w-full">
        <form action={postToChat} className="flex w-full">
          <input
            id="chat-input"
            name="chat-input"
            className="rounded-xl border-solid border-2 border-light-blue-500 p-2 w-full"
            type="text"
            placeholder="Type to chat"
          />
          <button className="w-8">+</button>
        </form>
      </div>
      {chatPosts.length > 0 ? (
        <div>
          {chatPosts?.map((post, i) => {
            if (post && post.userId && post.post) {
              return (
                <div className="p-1" key={i}>
                  <strong>{post.userId}</strong>: {post.post}
                </div>
              );
            }
          })}
        </div>
      ) : null}
    </div>
  );
}
