"use server";

import { db } from "@/lib/firebase";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { redirect } from "next/navigation";

function generateId(length = 10) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function createPoll(formData: FormData) {
  const question = formData.get("question") as string;

  // Extract options from formData
  // We expect inputs named "options" or similar logic
  // Since formData.getAll('options') might work if inputs have same name
  const rawOptions = formData.getAll("options") as string[];
  const options = rawOptions
    .filter((opt) => opt.trim().length > 0)
    .map((text) => ({
      id: crypto.randomUUID(), // Use native Node.js crypto
      text: text.trim(),
      voteCount: 0,
    }));

  if (!question || options.length < 2) {
    throw new Error("Invalid poll data");
  }

  const pollId = generateId(10); // Short ID for URL

  try {
    const pollRef = doc(db, "polls", pollId);
    await setDoc(pollRef, {
      id: pollId,
      question,
      options,
      createdAt: Date.now(),
    });
  } catch (error) {
    console.error("Error creating poll:", error);
    throw new Error("Failed to create poll");
  }

  redirect(`/polls/${pollId}`);
}
