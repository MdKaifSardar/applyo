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
  const [votingOptionId, setVotingOptionId] = useState<string | null>(null);

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
    setVotingOptionId(optionId);

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
      setVotingOptionId(null);
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
    <div className="w-full  max-w-5xl lg:max-w-none lg:w-[50vw] mx-auto p-4 sm:p-8">
      <div className="bg-card text-card-foreground rounded-2xl shadow-xl border border-border p-6 sm:p-8 transition-colors">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-3 leading-tight">
            {poll.question}
          </h1>
          <button
            onClick={copyLink}
            className="group flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium transition-colors bg-primary/5 px-3 py-1.5 rounded-full w-fit"
          >
            <span>Share Link</span>
            <span className="group-hover:translate-x-0.5 transition-transform">
              🔗
            </span>
          </button>
        </div>

        <div className="space-y-4">
          {poll.options.map((option) => {
            const percentage =
              totalVotes > 0
                ? Math.round(((option.voteCount || 0) / totalVotes) * 100)
                : 0;
            const isSelected = votedOptionId === option.id;
            const isVotingThis = votingOptionId === option.id;

            return (
              <div key={option.id} className="relative group/option">
                {/* Result Bar Background - Wrapped to prevent overflow */}
                <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                  <div
                    className={`h-full transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                      ${isSelected ? "bg-primary/20" : "bg-muted"}
                    `}
                    style={{
                      width: hasVoted ? `${percentage}%` : "0%",
                      opacity: hasVoted ? 1 : 0,
                    }}
                  />
                </div>

                <button
                  onClick={() => handleVote(option.id)}
                  disabled={hasVoted || voting}
                  className={`relative w-full text-left px-5 py-4 rounded-xl border-2 transition-all z-10 flex justify-between items-center bg-transparent
                    ${
                      hasVoted
                        ? "border-transparent cursor-default"
                        : "border-input hover:border-primary/50 hover:bg-accent/50 active:scale-[0.99]"
                    }
                    ${isSelected ? "border-primary ring-1 ring-primary/20" : ""}
                    disabled:opacity-70 disabled:cursor-not-allowed
                  `}
                >
                  <span
                    className={`font-medium text-lg transition-colors flex items-center gap-3 ${
                      isSelected ? "text-primary font-bold" : "text-foreground"
                    }`}
                  >
                    {option.text}
                    {isVotingThis && (
                      <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    )}
                  </span>

                  {hasVoted && (
                    <div className="flex flex-col items-end animate-in fade-in slide-in-from-right-4 duration-500">
                      <span className="text-sm font-bold text-foreground">
                        {percentage}%
                      </span>
                      <span className="text-xs text-muted-foreground font-medium">
                        {option.voteCount || 0} votes
                      </span>
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-8 pt-6 border-t border-border flex justify-between items-center text-sm text-muted-foreground">
          <span className="font-medium">
            {totalVotes} {totalVotes === 1 ? "Vote" : "Votes"}
          </span>
          <span className="bg-muted px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
            {hasVoted ? "Voted" : "Active Poll"}
          </span>
        </div>
      </div>
    </div>
  );
}
