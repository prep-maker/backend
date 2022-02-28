import express, { NextFunction, Request, Response } from 'express';
import config from './config/index.js';
import initApp from './loaders/index.js';
import authRouter from './routes/auth.js';
import userRouter from './routes/user.js';

const app = express();

initApp(app);

app.use('/auth', authRouter);
app.use('/users', userRouter);

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

app.listen(config.port, () => {
  console.log('Server is ready');
});
