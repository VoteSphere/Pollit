import express, { Router } from 'express';
import { pool } from '../db/connect.js';
import { validatePollRequest, createPoll, linkOpened } from '../controllers/pollController.js';

const apiRouter: Router = express.Router();

// POST Route handler
apiRouter.post('/polls', validatePollRequest, createPoll, (req, res) => {
  res.status(201).json(res.locals.pollInfo);
});

apiRouter.post('/polls/close', async (req, res) => {
  const { id } = req.body;
  const urlSlug = `/p/${id}`;
  const CLOSE_POLL = `
  UPDATE polls
  SET is_open = false
  WHERE url_slug = $1;
  `;
  await pool.query(CLOSE_POLL, [urlSlug]);

  res.sendStatus(200);
});

// apiRouter.post('/polls/vote', async (req, res) => {
//   const { id, poll_item_name } = req.body; // {itemname: 0, dfjnqw: 3}

//   const VOTE = `
//     INSERT INTO votes (poll_id, item_id)
//     VALUES ($1, $2, $3)
//     RETURNING _id;
//   `;
// });

// GET Route handler
apiRouter.get('/polls/:id', linkOpened, (req, res) => {
  res.status(200).json(res.locals.pollInfo);
});

export default apiRouter;
