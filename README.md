# Poll Rooms 📊

A real-time polling application built with Next.js and Firebase. Creating a poll is instant, and results update live for everyone.

## Fairness & Anti-Abuse Mechanisms

To ensure fair voting, potential abuse is handled in two main ways:

1.  **Identity Persistence (Anonymous Auth)**
    Every visitor is assigned a unique, persistent ID tied to their browser session. This prevents the most common form of abuse—simply refreshing the page to vote again. The ID sticks around even if the user closes and reopens the tab.

2.  **Concurrency Control (Transactions)**
    Voting logic is wrapped in a Firestore Transaction. This means the server atomically checks if a user has already voted _before_ incrementing the count. It effectively prevents race conditions where a user might try to "double-click" or send simultaneous requests to trick the system.

## Edge Cases Handled

- **Live Updates:** Results sync instantly across all connected clients. No refresh needed.
- **Invalid Links:** Navigating to a non-existent poll ID displays a clear, friendly error message instead of crashing.
- **Race Conditions:** As mentioned above, database transactions ensure vote counts remain accurate even under heavy concurrent load.
- **Loading States:** The UI provides feedback (spinners/disabled states) during data fetching and voting actions to prevent confusion.

## Known Limitations

- **Browser-Bound Identity:** Since we use strict anonymity, a determined user could vote multiple times by using Incognito mode or a different browser. Moving to email/social login would solve this but adds friction.
- **No Expiration:** Polls currently live indefinitely. Adding an expiry date or "close poll" feature would be a logical next step.

## How to Run Locally

1.  Clone the repo and install dependencies:
    ```bash
    npm install
    ```
2.  Set up your `.env.local` with Firebase credentials:
    ```bash
    NEXT_PUBLIC_FIREBASE_API_KEY=...
    # ... (other standard firebase config)
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```
