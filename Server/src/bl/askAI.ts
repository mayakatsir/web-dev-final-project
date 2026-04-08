import { getOpenAIClient } from '../services/askAI';

export const askAI = async (prompt: string): Promise<string> => {
    const client = getOpenAIClient();

    const completion = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
    });

    const answer = completion.choices[0]?.message?.content;
    if (!answer) throw new Error('No response from ChatGPT');

    return answer;
};

export const recommendRecipe = async (ingredients: string): Promise<string> => {
    const prompt = `I have the following ingredients: ${ingredients}.\nSuggest one recipe I can make with some or all of them. Include the recipe name, a short description, and step-by-step instructions. Keep it concise.`;
    return askAI(prompt);
};
