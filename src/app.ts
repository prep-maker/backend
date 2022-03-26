import express, { NextFunction, Request, Response } from 'express';
import http from 'http';
import config from './common/config/index.js';
import initApp from './loaders/index.js';
import authRouter from './routes/auth.js';
import userRouter from './routes/user.js';
import writingRotuer from './routes/writing.js';

export const app = express();

export const startServer = (): http.Server => {
  initApp(app);

  app.use('/auth', authRouter);
  app.use('/users', userRouter);
  app.use('/writings', writingRotuer);

  app.use((req: Request, res: Response) => {
    res.send('Not Found');
  });

  app.use((err: BadState, req: Request, res: Response, next: NextFunction) => {
    console.error(err);

    if (err.state === 'error' || err.status === 500) {
      return res.status(err.status).json({ message: 'Server Error' });
    }

    res.status(err.status).json({ message: err.message });
  });

  const server = app.listen(config.port, () => {
    console.log('Server is ready');
  });

  return server;
};
