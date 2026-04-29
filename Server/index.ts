import cors from 'cors';
import express, { Application } from 'express';
import fs from "fs";
import https from 'https';
import path from 'path';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import askAIRouter from './src/routes/askAIRouter';
import authRouter from './src/routes/authRouter';
import commentRouter from './src/routes/commentRouter';
import postRouter from './src/routes/postRouter';
import uploadsRouter from './src/routes/uploadsRouter';
import userRouter from './src/routes/userRouter';
import { getConfig } from './src/services/config';
import { initializeDBConnection } from './src/services/db';

const config = getConfig();

const app: Application = express();
const httpPort = config.HTTP_PORT;
const httpsPort = config.HTTPS_PORT;
const isProduction = config.NODE_ENV === "production"

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
        servers: [{ url: 'https://node60.cs.colman.ac.il' }],
    },
    apis: ['./src/docs/*.ts'],
  };
  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerJsDoc(options)));
  
  app.use("/post", postRouter);
  app.use("/comment", commentRouter);
  app.use("/user", userRouter)
  app.use("/auth", authRouter)
  app.use("/ask-ai", askAIRouter)
  
   if (isProduction) {
    // Serve the built React app
    app.use(express.static(path.resolve(__dirname, '../client')));

    // SPA routes — let React Router handle them
    const clientRoutes = ['/', '/login', '/profile', '/recipe/*'];
    app.get(clientRoutes, (_req, res) => {
      res.sendFile(path.resolve(__dirname, '../client/index.html'));
    });

    const options  = {key: fs.readFileSync(__dirname + '/../certs/key.pem'), cert: fs.readFileSync(__dirname + '/../certs/cert.pem')}
    https.createServer(options, app).listen(
        httpsPort,
        () => {
            console.log(`Server running on port ${httpsPort} https`);
        }
      )
    }else {
      app.listen(httpPort, () => {
      console.log(`Server running on port ${httpPort} http`);
      });    
    }

}

main();
