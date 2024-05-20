import OpenAI from 'openai';

interface Options {
  prompt: string;
}

export const orthographyCheckUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { prompt } = options;
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content:
          'Tu nombre es Gon, debes responder amablemente siempre y dar tu nombre.',
      },
      { role: 'user', content: prompt },
    ],
    model: 'gpt-4o',
  });

  console.log(completion);
  return completion.choices[0];
};
