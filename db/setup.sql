CREATE TABLE polls (
  _id SERIAL PRIMARY KEY,
  poll_description TEXT,
  name VARCHAR(255) NOT NULL,
  url_slug VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  votes_per_voter INTEGER NOT NULL DEFAULT 1,
  is_open BOOLEAN,
  closed_time TIMESTAMP,
  last_vote TIMESTAMP
);

CREATE TABLE poll_item (
  _id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  poll_id INTEGER REFERENCES polls(_id)
);

CREATE TABLE votes (
  _id SERIAL PRIMARY KEY,
  poll_id INTEGER REFERENCES polls(_id),
  voter_id INTEGER,
  item_id INTEGER REFERENCES poll_item(_id),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE voters (
  _id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_vote TIMESTAMP
)