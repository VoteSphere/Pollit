import type {
  NewPollRequest,
  NewPollResponse,
  ServerError /* DbPollRequest */,
} from '../../../types/api.d.ts';
import { Request, Response, NextFunction } from 'express';
import { pool } from '../db/connect.js';
import pg from 'pg';
import { INSERT_POLL, INSERT_POLL_ITEM } from '../db/queries.js';

// function to generate random string
function generateRandomString(length: number): string {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}
// function to handle create poll feature
export const createPoll = async (req: Request, res: Response, next: NextFunction) => {
  // generate short link(6-index url)
  const url: string = generateRandomString(6);
  const urlSlug = `/p/${url}`;

  const body = req.body as NewPollRequest;
  const { description, name, items, maxVotes } = body;

  interface InsertQueryRes extends pg.QueryResult {
    rows: [
      {
        _id: number;
      },
    ];
  }

  try {
    // to do: use a transaction and pipeline/batch requests
    // insert poll into the polls table and retrieve id
    const response = (await pool.query(INSERT_POLL, [
      description,
      name,
      urlSlug,
      maxVotes,
    ])) as InsertQueryRes;
    if (response.rowCount !== 1) throw new Error();
    const pollId = response?.rows[0]?._id;

    // for each poll item, insert into poll_item table
    const promises: Promise<pg.QueryResult>[] = [];
    items.forEach((e) => {
      promises.push(pool.query(INSERT_POLL_ITEM, [e.name, pollId]));
    });

    await Promise.all(promises);

    const pollInfo: NewPollResponse = { urlSlug };
    res.locals.pollInfo = pollInfo;
    next();
  } catch (err: unknown) {
    const databaseErr: ServerError = {
      log: 'Error inserting new poll in database',
      status: 500,
      message: { err: 'Something went wrong' },
    };
    next(databaseErr);
  }
};

export const validatePollRequest = (req: Request, res: Response, next: NextFunction) => {
  const poll: NewPollRequest = req.body as NewPollRequest;

  if (
    !poll ||
    typeof poll.name !== 'string' ||
    typeof poll.description !== 'string' ||
    !Array.isArray(poll.items) ||
    poll.items.length < 2 ||
    !poll.items.every(
      (item) => item !== null && typeof item === 'object' && typeof item.name === 'string',
    ) ||
    typeof poll.maxVotes !== 'number' ||
    poll.maxVotes < 1
  ) {
    const invalidInputErr: ServerError = {
      log: 'Invalid inputs',
      status: 400,
      message: { err: 'Invalid inputs' },
    };
    next(invalidInputErr);
  } else {
    next();
  }
};
