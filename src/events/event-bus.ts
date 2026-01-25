import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

@Injectable()
export class EventBus {
  private events = new Subject<any>();

  publish(event: any) {
    this.events.next(event);
  }

  subscribe(callback: (event: any) => void) {
    this.events.subscribe(callback);
  }
}
