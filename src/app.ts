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
  const message: ErrorState['reason'] & string = err.message;

  console.error(err);

  switch (message) {
    case 'duplicate': {
      return res.status(400).send('이미 존재하는 이메일입니다.');
    }

    default: {
      res.status(500).send('Server error');
    }
  }
});

app.listen(config.port, () => {
  console.log('Server is ready');
});
