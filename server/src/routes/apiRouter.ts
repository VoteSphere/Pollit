import express, { Router } from 'express';
import { validatePollRequest, createPoll } from '../controllers/pollController.js';

const apiRouter: Router = express.Router();

// POST Route handler
apiRouter.post('/polls', validatePollRequest, createPoll, (req, res) => {
  res.status(201).json(res.locals.pollInfo);
});

// GET Route handler
apiRouter.get('/polls/:id', (req, res) => {
  res.status(200).json();
});

export default apiRouter;
