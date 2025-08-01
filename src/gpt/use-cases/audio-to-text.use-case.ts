import * as fs from 'fs';
import OpenAI from 'openai';

interface Options {
  prompt?: string;
  audioFile?: Express.Multer.File;
}

export const audioToTextUseCase = async (openAi: OpenAI, options: Options) => {
  const { prompt, audioFile } = options;
  console.log({ prompt, audioFile });

  const response = await openAi.audio.transcriptions.create({
    model: 'whisper-1',
    file: fs.createReadStream(audioFile.path),
    prompt, // tiene que ser el mismo idioma que el audio
    language: 'es', // idioma del audio
    response_format: 'verbose_json', // vtt, srt, json, text, verbose_json
  });

  console.log({ response });

  return response;
};
