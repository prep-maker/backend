import express from 'express';
import initExpress from './express.js';
import connectDB from './mongoose.js';

const initApp = (app: express.Application) => {
  connectDB();
  initExpress(app);
};

export default initApp;
