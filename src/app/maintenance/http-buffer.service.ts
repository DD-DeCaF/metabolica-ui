import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable()
export class HttpBufferService {
   buffer: Array<any> = [];

  constructor(private client: HttpClient) { }

  append(request) {
    this.buffer.push(request);
  }

  retryHttpRequest(request) {
    this.client.request(request).subscribe(() => {}, () => {})
  }

  retryAll() {
    for (let request of this.buffer) {
      this.retryHttpRequest(request)
    }
    this.buffer = [];
  }

  rejectAll() {
    this.buffer = [];
  }

}
