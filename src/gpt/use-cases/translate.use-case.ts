import OpenAI from 'openai';

interface Options {
  prompt: string;
  lang: string;
}

export const translateUseCase = async (
  openai: OpenAI,
  { prompt, lang }: Options,
) => {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    temperature: 0.2,
    //max_tokens: 100,
    messages: [
      {
        role: 'system',
        content: `Traduce el siguiente texto al idioma ${lang}:${prompt}.`,
      },
    ],
  });

  return { message: completion.choices[0].message.content };
};
