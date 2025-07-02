import * as fs from 'fs';
import * as path from 'path';
import { NotFoundException } from '@nestjs/common';

export const textToAudioGetterUseCase = async (id: string) => {
  const filePath = path.resolve(
    __dirname,
    '../../../generated/audio/',
    `${id}.mp3`,
  );

  const exists = fs.existsSync(filePath);

  console.log(`Speech file exists: ${exists}`);

  if (!exists) new NotFoundException(`Audio file not found for ID: ${id}`);

  return filePath;
};
