"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import {
  doc,
  onSnapshot,
  runTransaction,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { signInAnonymously } from "firebase/auth";
import type { Poll, PollOption } from "@/types";

export function PollView({ pollId }: { pollId: string }) {
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [voting, setVoting] = useState(false);
  const [votedOptionId, setVotedOptionId] = useState<string | null>(null);

  // 1. Auth & Initial Check
  useEffect(() => {
    const unsubAuth = auth.onAuthStateChanged(async (u) => {
      if (u) {
        setUser(u);
        // Check if already voted
        const voteRef = doc(db, "polls", pollId, "votes", u.uid);
        const voteSnap = await getDoc(voteRef);
        if (voteSnap.exists()) {
          setHasVoted(true);
          setVotedOptionId(voteSnap.data().optionId);
        }
      } else {
        signInAnonymously(auth).catch((err) => {
          console.error("Auth failed", err);
          setError("Authentication failed. Please reload.");
        });
      }
    });
    return () => unsubAuth();
  }, [pollId]);

  // 2. Real-time Poll Listener
  useEffect(() => {
    const pollRef = doc(db, "polls", pollId);
    const unsub = onSnapshot(
      pollRef,
      (doc) => {
        if (doc.exists()) {
          setPoll(doc.data() as Poll);
        } else {
          setError("Poll not found");
        }
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError("Failed to load poll");
        setLoading(false);
      },
    );

    return () => unsub();
  }, [pollId]);

  // 3. Handle Vote
  const handleVote = async (optionId: string) => {
    if (!user || hasVoted || voting) return;
    setVoting(true);

    try {
      const pollRef = doc(db, "polls", pollId);
      const voteRef = doc(db, "polls", pollId, "votes", user.uid);

      await runTransaction(db, async (transaction) => {
        const pollDoc = await transaction.get(pollRef);
        const voteDoc = await transaction.get(voteRef);

        if (!pollDoc.exists()) throw new Error("Poll does not exist!");
        if (voteDoc.exists()) throw new Error("You have already voted!");

        const currentPoll = pollDoc.data() as Poll;
        const newOptions = currentPoll.options.map((opt) => {
          if (opt.id === optionId) {
            return { ...opt, voteCount: (opt.voteCount || 0) + 1 };
          }
          return opt;
        });

        transaction.update(pollRef, { options: newOptions });
        transaction.set(voteRef, {
          optionId,
          timestamp: serverTimestamp(),
        });
      });

      setHasVoted(true);
      setVotedOptionId(optionId);
    } catch (err: any) {
      console.error("Vote failed", err);
      alert(err.message || "Vote failed");
    } finally {
      setVoting(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  if (loading) return <div className="p-8 text-center">Loading poll...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!poll) return null;

  const totalVotes = poll.options.reduce(
    (acc, curr) => acc + (curr.voteCount || 0),
    0,
  );

  return (
    <div className="max-w-xl mx-auto p-4 sm:p-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {poll.question}
          </h1>
          <button
            onClick={copyLink}
            className="text-xs text-blue-500 hover:text-blue-600 font-medium"
          >
            Share Link 🔗
          </button>
        </div>

        <div className="space-y-3">
          {poll.options.map((option) => {
            const percentage =
              totalVotes > 0
                ? Math.round(((option.voteCount || 0) / totalVotes) * 100)
                : 0;
            const isSelected = votedOptionId === option.id;

            return (
              <div key={option.id} className="relative group">
                {/* Result Bar Background */}
                <div
                  className="absolute top-0 left-0 h-full bg-blue-50 rounded-lg transition-all duration-500 ease-out"
                  style={{ width: `${percentage}%`, opacity: hasVoted ? 1 : 0 }}
                />

                <button
                  onClick={() => handleVote(option.id)}
                  disabled={hasVoted || voting}
                  className={`relative w-full text-left px-4 py-3 rounded-lg border transition-all z-10 flex justify-between items-center
                    ${
                      hasVoted
                        ? "border-transparent cursor-default"
                        : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                    }
                    ${isSelected ? "ring-2 ring-blue-500 bg-blue-50" : ""}
                  `}
                >
                  <span
                    className={`font-medium ${isSelected ? "text-blue-700" : "text-gray-800"}`}
                  >
                    {option.text}
                  </span>

                  {hasVoted && (
                    <span className="text-sm font-semibold text-gray-600">
                      {percentage}% ({option.voteCount || 0})
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-6 text-right text-xs text-gray-400">
          {totalVotes} votes • {hasVoted ? "You voted" : "Tap to vote"}
        </div>
      </div>
    </div>
  );
}
