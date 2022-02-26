import cors from 'cors';
import express from 'express';
import monrgan from 'morgan';

const initExpress = (app: express.Application) => {
  app.use(express.json());
  app.use(monrgan('tiny'));
  app.use(cors());
};

export default initExpress;
