import cors from 'cors';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import express, { Application, Response } from 'express';
import authRouter from './src/routes/authRouter';
import commentRouter from './src/routes/commentRouter';
import postRouter from './src/routes/postRouter';
import userRouter from './src/routes/userRouter';
import askAIRouter from './src/routes/askAIRouter';
import uploadsRouter from './src/routes/uploadsRouter';
import { getConfig } from './src/services/config';
import { initializeDBConnection } from './src/services/db';

const config = getConfig();

const app: Application = express();
const port = config.PORT;

const main  = async () => {
  await initializeDBConnection();
  
  app.use(cors());
  app.use(express.json());
  app.use('/uploads', uploadsRouter);

  const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Assignment 2 REST API',
            version: '1.0.0',
            description: 'Maya & Karen\'s REST server including authentication using JWT',
        },
        servers: [{ url: 'http://localhost:3000' }],
    },
    apis: ['./src/docs/*.ts'],
  };
  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerJsDoc(options)));
  
  app.use("/post", postRouter);
  app.use("/comment", commentRouter);
  app.use("/user", userRouter)
  app.use("/auth", authRouter)
  app.use("/ask-ai", askAIRouter)

  app.get('/', (_req, res: Response) => {
    res.send({ message: 'API is running' });
  });
  
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

main();
