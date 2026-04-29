import { Request, Response } from 'express';
import { askAI, recommendRecipe, recommendFromFavorites } from '../bl/askAI';
import PostRepository from '../repositories/postRepository';

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

    async recommendFromFavorites(req: Request, res: Response) {
        const { userId, mealType } = req.body;

        if (!userId || typeof userId !== 'string') {
            res.status(400).json({ message: '`userId` body param is missing' });
            return;
        }
        if (!mealType || typeof mealType !== 'string') {
            res.status(400).json({ message: '`mealType` body param is missing' });
            return;
        }

        try {
            let sourcePosts = await PostRepository.getTopLikedPostsByCategory(userId, mealType, 5);

            if (sourcePosts.length === 0) {
                const { posts: allLiked } = await PostRepository.getLikedPosts(userId, 1, 100);
                if (allLiked.length === 0) {
                    res.status(400).json({ message: 'User has no liked posts to base a recommendation on' });
                    return;
                }
                sourcePosts = allLiked.slice().sort((a, b) => b.likesCount - a.likesCount).slice(0, 5);
            }

            const descriptions = sourcePosts
                .map((p) => p.description)
                .filter((d): d is string => !!d && d.trim().length > 0);

            const answer = await recommendFromFavorites(descriptions, mealType);
            res.status(200).json({ answer });
        } catch (error) {
            console.error('Error generating recipe from favorites:', error);
            res.status(500).json({ message: 'Failed to generate recipe from favorites' });
        }
    }
}

export default new AskAIController();
