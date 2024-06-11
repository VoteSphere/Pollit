import express, { Router, Request, Response } from 'express';

const apiRouter: Router = express.Router();

// POST Route handler

apiRouter.post(
  '/polls',
  /* add middleware here */ (req: Request, res: Response) => {
    res.status(201).json();
  },
);

export default apiRouter;
