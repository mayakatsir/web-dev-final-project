import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import { Express } from 'express';
import postRouter from '../routes/postRouter';
import { getConfig } from '../services/config';
import { initializeDBConnection } from '../services/db';
import commentRouter from '../routes/commentRouter';
import userRouter from '../routes/userRouter';
import authRouter from '../routes/authRouter';
import askAIRouter from '../routes/askAIRouter';


declare global {
    var initTestServer: () => Promise<Express>;
    var closeTestServer: () => Promise<void>;
}

let appInstance: Express | null = null;

export const createApp = async () => {
    await initializeDBConnection();
    const app = express();

    app.use(cors());
    app.use(express.json()); 
  
    app.use("/post", postRouter);
    app.use("/comment", commentRouter);
    app.use("/user", userRouter)
    app.use("/auth", authRouter);
    app.use("/ask-ai", askAIRouter);

    app.get('/', (_req: Request, res: Response) => {
      res.send({ message: 'API is running' });
    });
  
    app.use((_err: Error, _req: Request, res: Response, _next: NextFunction) => {
        res.status(500).send({ message: 'Error' });
    });

    return app;
};

global.initTestServer = async (): Promise<Express> => {
  if (!appInstance) {
    const app  = await createApp();
    appInstance = app;
  }
  
  return appInstance;
};


global.closeTestServer = async (): Promise<void> => {
    appInstance = null;
};