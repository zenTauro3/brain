import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import fs from 'fs';

@Injectable()
export class AudioService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async transcribe(file: Express.Multer.File): Promise<string> {
    const result = await this.openai.audio.transcriptions.create({
      file: fs.createReadStream(file.path),
      model: 'whisper-1',
    });

    return result.text;
  }
}
