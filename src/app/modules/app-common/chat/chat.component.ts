import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject, takeUntil } from 'rxjs';
import { LoadingService } from 'src/app/core/services/loading.service';
import { MessageService } from 'src/app/core/services/message.service';
import { WebSocketService } from 'src/app/core/services/web-socket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  private _unsubscribe: ReplaySubject<any> = new ReplaySubject<any>();

  messages: any[];
  message: string;

  constructor(
    private _loadingService: LoadingService,
    private _messageService: MessageService,
    private _webSocketService: WebSocketService
  ) {
    this.messages = [
      {
        sender: "123",
        content: "123"
      }
    ];
    this.message = '';
  }

  ngOnInit(): void {
    this._webSocketService._connect();
    // throw new Error('Method not implemented.');
    this._webSocketService.message$.
      pipe(takeUntil(this._unsubscribe))
      .subscribe((response: any) => {
        if (response != null) {
          this.messages.push(response);
        }
      })
  }

  sendMessage(): void {
    this._webSocketService._send({
      sender: 'abc',
      content: this.message
    });
  }

  getItemInfo(item: any): string {
    return JSON.stringify(item);
  }
  
  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }
}
