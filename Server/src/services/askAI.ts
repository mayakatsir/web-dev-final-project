import OpenAI from 'openai';
import { getConfig } from './config';

let client: OpenAI;

export const getOpenAIClient = () => {
    if (!client) {
        client = new OpenAI({ apiKey: getConfig().OPENAI_API_KEY });
    }
    return client;
};
