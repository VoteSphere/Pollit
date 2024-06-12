export const INSERT_POLL = `
  INSERT INTO polls (poll_description, name, url_slug, votes_per_voter)
  VALUES ($1, $2, $3, $4)
  RETURNING _id;
`;

export const INSERT_POLL_ITEM = `
  INSERT INTO poll_item (name, poll_id)
  VALUES ($1, $2)
  RETURNING _id;
`;

export const INSERT_VOTE = `
  INSERT INTO votes (poll_id, voter_id, item_id)
  VALUES ($1, $2, $3)
  RETURNING _id;
`;

export const INSERT_VOTER = `
  INSERT INTO voters (name)
  VALUES ($1)
  RETURNING _id;
`;

export const UPDATE_POLL = `
  UPDATE polls
  SET poll_description = $1, name = $2, url_slug = $3, votes_per_voter = $4, is_open = $5, closed_time = $6
  WHERE _id = $7;
`;

export const UPDATE_LAST_VOTE_TIMESTAMP = `
  UPDATE voters
  SET last_vote = CURRENT_TIMESTAMP
  WHERE _id = $1;
`;

export const SELECT_POLL_BY_URL = `
  SELECT *
  FROM polls
  WHERE url_slug = $1;
`;

export const SELECT_POLL_ITEMS_BY_POLL_ID = `
  SELECT *
  FROM poll_item
  WHERE _id = $1;
`;

export const SELECT_VOTES_BY_POLL_ID = `
  SELECT *
  FROM votes
  WHERE poll_id = $1;
`;

export const SELECT_VOTER_BY_ID = `
  SELECT *
  FROM voters
  WHERE _id = $1;
`;
