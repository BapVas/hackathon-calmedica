import OpenAI from "openai";

const OpenAiConnector = (apiKey: string) => ({
    query: async (message: string) => {

        const openai = new OpenAI({
            apiKey: apiKey, // This is the default and can be omitted
        });

        const chatCompletion = openai.chat.completions.create({
            messages: [{ role: 'user', content: 'Say this is a test' }],
            model: 'gpt-3.5-turbo',
        });

        return chatCompletion;
    }
});

export default OpenAiConnector;