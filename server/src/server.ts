import express, { Request, Response, NextFunction } from 'express';
import apiRouter from './routes/apiRouter.js';
import type { ServerError } from '../../types/api.d.ts';

const app = express();

const PORT = 3000;

app.use(express.json());

app.use('/api', apiRouter);

app.use('*', (req: Request, res: Response) => res.status(404).send('Resource not found'));

// define global error handler here
app.use((err: ServerError, req: Request, res: Response, _next: NextFunction) => {
  const defaultErr: ServerError = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj: ServerError = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
