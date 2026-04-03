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
