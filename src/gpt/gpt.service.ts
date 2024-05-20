import { Injectable } from '@nestjs/common';
import { orthographyCheckUseCase } from './use-cases';
import { OrthographyDto } from './dto';
import OpenAI from 'openai';

@Injectable()
export class GptService {
  // solo va a llamar casos de uso

  private openAi = new OpenAI({
    apiKey: process.env.OPEN_API_KEY,
  });

  async orthographyCheck(orthographyDto: OrthographyDto) {
    return await orthographyCheckUseCase(this.openAi, {
      prompt: orthographyDto.prompt,
    });
  }
}
