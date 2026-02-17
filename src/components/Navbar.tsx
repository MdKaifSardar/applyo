"use client";

import Link from "next/link";
import { useTheme } from "./ThemeProvider";

export function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
        >
          Poll Rooms
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors hidden sm:block"
          >
            Create Poll
          </Link>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-accent hover:bg-accent/80 transition-colors text-foreground"
            aria-label="Toggle Theme"
          >
            {theme === "light" ? (
              // Moon icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
            ) : (
              // Sun icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" />
                <path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" />
                <path d="m19.07 4.93-1.41 1.41" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
