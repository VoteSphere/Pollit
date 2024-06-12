export interface Poll {
  _id: number;
  poll_description: string;
  name: string;
  url_slug: string;
  created_at: Date;
  votes_per_voter: number;
  is_open: boolean;
  closed_time: Date;
  last_vote: Date;
}

export interface PollItem {
  _id: number;
  name: string;
  poll_id: number;
}
