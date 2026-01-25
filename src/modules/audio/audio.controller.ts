import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AudioService } from './audio.service';
import { unlink } from 'fs/promises';

@Controller('audio')
export class AudioController {
  constructor(private readonly audioService: AudioService) {}

  @Post('transcribe')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: process.env.TMP_PATH,
        filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
      }),
    }),
  )
  async transcribe(@UploadedFile() file: Express.Multer.File): Promise<{ text: string }> {
    if (!file) {
      throw new BadRequestException({
        code: 'FILE_NOT_PROVIDED',
        message: 'File not received',
      }); 
    }

    try {
      return {
        text: await this.audioService.transcribe(file),
      };
    } finally {
      await unlink(file.path);
    }
  }
}
