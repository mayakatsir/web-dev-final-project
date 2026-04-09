import { getOpenAIClient } from '../services/askAI';

export const askAI = async (prompt: string): Promise<string> => {
    const client = getOpenAIClient();

    const completion = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
    });

    const answer = completion.choices[0]?.message?.content;
    if (!answer) throw new Error('Failed to get response from ChatGPT');

    return answer;
};

export const recommendRecipe = async (ingredients: string): Promise<string> => {
    const prompt = `I have the following ingredients: ${ingredients}.\nSuggest one recipe I can make with some or all of them. Include the recipe name, a short description, and step-by-step instructions. Keep it concise.`;
    return askAI(prompt);
};

export const recommendFromFavorites = async (descriptions: string[], mealType: string): Promise<string> => {
    const descriptionList = descriptions.map((d, i) => `${i + 1}. ${d}`).join('\n');
    const prompt = `A user loves the following recipes:\n${descriptionList}\n\nBased on their taste, suggest one new ${mealType} recipe they would enjoy. Include the recipe name, a short description, and step-by-step instructions. Keep it concise.`;
    return askAI(prompt);
};
