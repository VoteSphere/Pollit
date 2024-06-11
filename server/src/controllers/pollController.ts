import type {
  NewPollRequest,
  NewPollResponse,
  ServerError /* DbPollRequest */,
} from '../../../types/api.d.ts';
import { Request, Response, NextFunction } from 'express';

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
export const createPoll = (req: Request, res: Response, next: NextFunction) => {
  // generate short link(6-index url)
  const url: string = generateRandomString(6);

  // const body = req.body as NewPollRequest;
  // const poll: DbPollRequest = { ...body, url };
  // query the database (insert)
  try {
    // const result = db.pool(...);
    const pollInfo: NewPollResponse = { urlSlug: `/p/${url}` };
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
