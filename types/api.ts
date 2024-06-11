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
