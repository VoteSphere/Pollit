import express from 'express';
import apiRouter from './routes/apiRouter.js'; // not defined yet

const app = express();

const PORT = 3000;

app.use('/api', apiRouter);

// define global error handler here

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
