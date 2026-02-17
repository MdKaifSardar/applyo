export interface PollOption {
  id: string;
  text: string;
  voteCount: number;
}

export interface Poll {
  id: string; // Short ID
  question: string;
  options: PollOption[];
  createdAt: number; // Timestamp (millis)
}

// Representing the vote structure in Firestore
// Path: polls/{pollId}/votes/{userId}
export interface Vote {
  optionId: string;
  timestamp: number;
}
