import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {
  async ask() {
    return 'Hello';
  }
}
