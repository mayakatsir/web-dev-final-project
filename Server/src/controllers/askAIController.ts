import { Request, Response } from 'express';
import { askAI, recommendRecipe } from '../bl/askAI';

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
            console.error('Error calling ChatGPT:', error);
            res.status(500).json({ message: 'Failed to get response from ChatGPT' });
        }
    }

    async recommend(req: Request, res: Response) {
        const { ingredients } = req.body;

        if (!ingredients || typeof ingredients !== 'string') {
            res.status(400).json({ message: '`ingredients` body param is missing' });
            return;
        }

        try {
            const answer = await recommendRecipe(ingredients);
            res.status(200).json({ answer });
        } catch (error) {
            console.error('Error getting recipe recommendation:', error);
            res.status(500).json({ message: 'Failed to get recipe recommendation' });
        }
    }
}

export default new AskAIController();
