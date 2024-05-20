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
        content: `
        Te será proveídos textos en español con posibles errores de ortográfia y gramaticales,
        Las palabras usada deben de existir en el diccionario de l Real Academa Española,
        Debes de reponder en formato JSON,
        tu tarea es corregirlos y retornar información soluciones,
        también denes de dar un procentaje de aciertos por el usuario,

        Si no hay errores, debes de retornar un mensaje de felicitaciones.

        Ejemplo de salida:
        
        {
          userScore: number,
          errors: string[], // ['error -> solucion']
          message: string, // Usar emojis y texto para felicitar al usuario
        }
        `,
      },
      { role: 'user', content: prompt },
    ],
    model: 'gpt-4o',
    temperature: 0.3,
    max_tokens: 100,
  });
  // console.log(completion.choices[0].message.content);
  return JSON.parse(completion.choices[0].message.content);
};
