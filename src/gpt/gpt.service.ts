import { Injectable } from '@nestjs/common';
import {
  orthographyCheckUseCase,
  prosConsDiscusserStreamUseCase,
  prosConsDiscusserUseCase,
} from './use-cases';
import { OrthographyDto, ProsConsDiscusserDto } from './dto';
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

  async prosConsDiscusser(prosConsDto: ProsConsDiscusserDto) {
    return await prosConsDiscusserUseCase(this.openAi, {
      prompt: prosConsDto.prompt,
    });
  }
  async prosConsDiscusserStream(prosConsDto: ProsConsDiscusserDto) {
    return await prosConsDiscusserStreamUseCase(this.openAi, {
      prompt: prosConsDto.prompt,
    });
  }
}
