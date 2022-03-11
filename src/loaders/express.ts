import cors from 'cors';
import express from 'express';
import monrgan from 'morgan';
import config from '../common/config/index.js';

const initExpress = (app: express.Application) => {
  app.use(express.json());
  app.use(monrgan('tiny'));
  app.use(
    cors({
      origin: config.cors.allowedOrigin,
    })
  );
};

export default initExpress;
