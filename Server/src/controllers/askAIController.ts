import { Request, Response } from 'express';
import { askAI } from '../bl/askAI';

class AskAIController {
    async ask(req: Request, res: Response) {
        const { prompt } = req.query;

        if (!prompt || typeof prompt !== 'string') {
            res.status(400).json({ message: '`prompt` query param is missing' });
            return;
        }

        try {
            const answer = await askAI(prompt);
            res.status(200).json({ answer });
        } catch (error) {
            res.status(500).json({ message: 'Failed to get response from ChatGPT' });
        }
    }
}

export default new AskAIController();
