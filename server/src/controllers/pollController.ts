import type { NewPollRequest, NewPollResponse, ServerError } from '../../../types/api.d.ts';
import { Request, Response, NextFunction } from 'express';
import { pool } from '../db/connect.js';
import * as db from '../db/connect.js';
import type pg from 'pg';
import {
  INSERT_POLL,
  INSERT_POLL_ITEM,
  SELECT_POLL_BY_URL,
  SELECT_POLL_ITEMS_BY_POLL_ID,
} from '../db/queries.js';
import { Poll, PollItem } from '../types.js';

export interface InsertQueryRes extends pg.QueryResult {
  rows: [
    {
      _id: number;
    },
  ];
}

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

//user opens link
//user sends request to server for information on poll and poll items associated with poll
//in request user sends pollID from link
//query for all information on poll
//query for all poll items associated
//response all poll item names and ids as object
//response poll description, name, votes-per-voter, isOpen

export const linkOpened = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get relevent poll information
    const poll_url_slug = req.params.id;
    const pollInfo = await db.query(SELECT_POLL_BY_URL, [`/p/${poll_url_slug}`]);
    if (!pollInfo || pollInfo.rows.length === 0) {
      console.error('No poll found with the provided ID.');
      throw new Error();
    }

    const { _id, poll_description, name, votes_per_voter, is_open } = pollInfo.rows[0] as Poll;

    // create an array of each relevent pollItem's name
    const pollItemsInfo = await db.query(SELECT_POLL_ITEMS_BY_POLL_ID, [_id]);
    if (!pollItemsInfo || pollItemsInfo.rows.length === 0) {
      console.error('No poll items found or query failed.');
      throw new Error();
    }
    const pollItemNames: string[] = pollItemsInfo.rows.map(
      (column: PollItem): string => column.name,
    );

    // return relevent information to client
    res.locals.pollInfo = {
      poll_description: poll_description,
      poll_name: name,
      votes_per_voter: votes_per_voter,
      is_open: is_open,
      pollItemNames: pollItemNames,
    };
    next();
  } catch (err) {
    const databaseErr: ServerError = {
      log: 'Error retrieving poll information',
      status: 404,
      message: { err: 'Poll does not exist' },
    };
    next(databaseErr);
  }
};
