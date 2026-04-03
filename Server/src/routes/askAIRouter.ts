import { Router } from 'express';
import askAIController from '../controllers/askAIController';

const askAIRouter = Router();

askAIRouter.get('/', askAIController.ask);

export default askAIRouter;
