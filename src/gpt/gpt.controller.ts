import {
  Body,
  Controller,
  // FileTypeValidator,
  Get,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import type { Response } from 'express';
import { GptService } from './gpt.service';
import {
  OrthographyDto,
  ProsConsDiscusserDto,
  TextToAudioDto,
  TranslateDto,
} from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AudioToTextDto } from './dto/audio-to-text';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Post('orthography-check')
  orthographyCheck(@Body() orthographyDto: OrthographyDto) {
    return this.gptService.orthographyCheck(orthographyDto);
  }

  @Post('pros-cons-discusser')
  prosConsDicusser(@Body() prosConsDto: ProsConsDiscusserDto) {
    return this.gptService.prosConsDiscusser(prosConsDto);
  }

  @Post('pros-cons-discusser-stream')
  async prosConsDicusserStream(
    @Body() prosConsDto: ProsConsDiscusserDto,
    @Res() res: Response,
  ) {
    const stream = await this.gptService.prosConsDiscusserStream(prosConsDto);

    res.setHeader('Content-Type', 'application/json');
    res.status(HttpStatus.OK);

    for await (const chunk of stream) {
      const piece = chunk.choices[0].delta.content || '';
      res.write(piece);
    }
    res.end();
  }

  @Post('translate')
  async translate(@Body() translateDto: TranslateDto) {
    return this.gptService.translate(translateDto);
  }

  @Post('text-to-audio')
  async textToAudio(
    @Body() translateDto: TextToAudioDto,
    @Res() res: Response,
  ) {
    const filePath = await this.gptService.textToAudio(translateDto);

    res.set('Content-Type', 'audio/mp3');
    res.status(HttpStatus.OK);
    res.sendFile(filePath.speechFile);
  }

  @Get('text-to-audio/:id')
  async getTextToAudio(@Param('id') id: string, @Res() res: Response) {
    const filePath = await this.gptService.getTextToAudio(id);

    res.set('Content-Type', 'audio/mp3');
    res.status(HttpStatus.OK);
    res.sendFile(filePath);
  }

  @Post('audio-to-text')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './generated/uploads',
        filename: (req, file, cb) => {
          const fileExt = file.originalname.split('.').pop();
          const fileName = `${new Date().getTime()}.${fileExt}`;
          return cb(null, fileName);
        },
      }),
    }),
  )
  async audioToText(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1000 * 1024 * 5,
            message: 'File is too large. Max size is 5MB.',
          }), // 5MB
          /*new FileTypeValidator({
            fileType: 'audio/*',
          }),*/
        ],
      }),
    )
    file: Express.Multer.File,
    @Body('prompt') audioToTextDto?: AudioToTextDto,
  ) {
    return this.gptService.audioToText(file, audioToTextDto);
  }
}
