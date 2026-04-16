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
import https from 'https';
import fs from "fs";
import path from "path";

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

  const clientDist = path.join(__dirname, '../../Client/dist');
  app.use(express.static(clientDist));
  app.get('*', (_req, res: Response) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
  
   if (isProduction) {
    const options  = {key: fs.readFileSync("../client-key.pem"), cert:  fs.readFileSync("../client-cert.pem")}
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
