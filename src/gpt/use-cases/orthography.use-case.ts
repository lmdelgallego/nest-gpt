interface Options {
  prompt: string;
}

export const orthographyCheckUseCase = async (options: Options) => {
  const { prompt } = options;

  return {
    prompt: prompt,
    apiKay: process.env.OPEN_API_KEY,
  };
};
