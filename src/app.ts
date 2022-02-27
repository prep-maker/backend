import express, { NextFunction, Request, Response } from 'express';
import config from './config/index.js';
import initApp from './loaders/index.js';
import authRouter from './routes/auth.js';

const app = express();

initApp(app);

app.use('/auth', authRouter);

app.use((req: Request, res: Response) => {
  res.send('Not Found');
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const message: ErrorState['message'] = err.message;

  console.error(err);

  if (message === 'unknown') {
    return res.json({ message: 'Server Error' });
  }

  res.json({ message });
});

app.listen(config.port, () => {
  console.log('Server is ready');
});
