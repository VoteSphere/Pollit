// Create new poll

interface PollItem {
  name: string; // must not be empty string
}

// POST request to /api/polls
export interface NewPollRequest {
  name: string; // must not be empty string
  description: string; // could be empty string
  items: PollItem[]; // should have min length 2
  maxVotes: number; // back end should check if > 1
}

// only if success HTTP code 201
export interface NewPollResponse {
  urlSlug: string; // only the part after the /, e.g. '/p/r5ecdf'
}

// define Server Error
export interface ServerError {
  log: string;
  status: number;
  message: { err: string };
}

// Get poll info

export interface GetPollRequest {
  urlSlug: string;
}

export interface GetPollResponse {
  name: string;
  description: string;
  isOpen: boolean;
  maxVotes: number;
  closedTime: string; // stringified date
  createdTime: string; // stringified date
  lastVote: string; // stringified date
  items: PollItem[];
  // votes: Votes[]
}
