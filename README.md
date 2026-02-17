# Real-Time Poll Rooms 📊

A minimalist, real-time polling application built with Next.js and Firebase.

## Features

- **Instant Poll Creation**: Create a poll with a question and multiple options.
- **Real-Time Updates**: Watch votes come in live without refreshing (powered by Firestore listeners).
- **Shareable Links**: Unique short URLs for every poll.
- **Fairness Enforced**: Prevents double voting using strict mechanisms.

## Fairness Mechanisms

This app implements two layers of protection against abuse:

1.  **Anonymous Authentication (Client Identity)**:
    - Every visitor is assigned a persistent Anonymous User ID via Firebase Auth.
    - This ID is used to track their vote status across sessions.

2.  **Firestore Transactions (Server-Side Enforcement)**:
    - Voting is performed via a database transaction.
    - The transaction atomically checks if a vote document already exists for the User ID _before_ counting the vote.
    - This guarantees that even if a user tries to send multiple requests simultaneously, only one will succeed.

## How to Run

1.  **Configure Firebase**:
    - Create a project at [console.firebase.google.com](https://console.firebase.google.com).
    - Enable **Authentication** (Anonymous provider).
    - Enable **Firestore Database**.
    - Create a `.env.local` file with your config:
      ```bash
      NEXT_PUBLIC_FIREBASE_API_KEY=...
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
      NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
      NEXT_PUBLIC_FIREBASE_APP_ID=...
      ```
    - **Important**: Set Firestore Rules to allow reads/writes (for demo purposes) or restrict writes to valid votes.
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Start Dev Server**:
    ```bash
    npm run dev
    ```

## Edge Case Handling

- **Invalid Poll ID**: Shows a friendly error message if the poll doesn't exist.
- **Network Issues**: Retries connections automatically; voting disabled while offline.
- **Double Voting**: The UI locks immediately after voting, and the backend transaction rejects subsequent attempts.
