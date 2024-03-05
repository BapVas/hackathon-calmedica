import OpenAI from "openai";

interface OpenAiConnectorOptions {
  apiKey: string;
}

export class OpenAiConnector {
  private openai: OpenAI;

  constructor(private readonly options: OpenAiConnectorOptions) {
    this.openai = new OpenAI({
      apiKey: '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',
    });
  }

  async query(message: string): Promise<any> {
    try {
      return await this.openai.chat.completions.create({
        messages: [{ role: 'user', content: message }],
        model: 'gpt-3.5-turbo',
      });
    } catch (error) {
      console.error('Error querying OpenAI API:', error);
      throw error;
    }
  }
}
