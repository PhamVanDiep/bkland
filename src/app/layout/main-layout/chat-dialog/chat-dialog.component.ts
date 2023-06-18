import { HttpStatusCode } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ReplaySubject, takeUntil } from 'rxjs';
import { APIResponse } from 'src/app/core/models/api-response.model';
import { Message } from 'src/app/core/models/chat.model';
import { ChatService } from 'src/app/core/services/chat.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { MessageService } from 'src/app/core/services/message.service';
import { SocketioService } from 'src/app/core/services/socketio.service';

@Component({
  selector: 'app-chat-dialog',
  templateUrl: './chat-dialog.component.html',
  styleUrls: ['./chat-dialog.component.css']
})
export class ChatDialogComponent implements OnInit, OnDestroy, OnChanges {
  private _unsubscribe: ReplaySubject<any> = new ReplaySubject<any>();

  @Input() chatRoomId: number;
  @Input() userDeviceId: string;
  @Input() display: boolean;
  @Output() hideEvent = new EventEmitter<boolean>();

  @ViewChild('listMessages')
  listMessages: ElementRef;

  message: string;
  messages: any[];

  innerWidth: any;
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
  }

  constructor(
    private _loadingService: LoadingService,
    private _messageService: MessageService,
    private _socketioService: SocketioService,
    private _chatService: ChatService
  ) {
    this.innerWidth = window.innerWidth;
    this.message = '';
    this.messages = [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.display) {
      this._socketioService.connect();
      this._socketioService.joinConversation(this.chatRoomId);
      this._socketioService.receiveMessage();
      this._socketioService.message$
        .pipe(takeUntil(this._unsubscribe))
        .subscribe((response: any) => {
          if (response != null) {
            this.messages.push(response);
            this.scrollToBottom();
          }
        });

      this._chatService.getAnonymousChatRoomDetail(this.chatRoomId, this.userDeviceId)
        .pipe(takeUntil(this._unsubscribe))
        .subscribe((response: APIResponse) => {
          if (response.status === HttpStatusCode.Ok) {
            this.messages = response.data.messages;
          } else {
            this._messageService.errorMessage(response.message);
          }
        })
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }

  scrollToBottom(): void {
    try {
      setTimeout(() => {
        this.listMessages.nativeElement.scrollTop = this.listMessages.nativeElement.scrollHeight;
      }, 500);
    } catch (err) { }
  }

  hideDialog(): void {
    this.hideEvent.next(true);
    this._socketioService.leaveConversation(this.chatRoomId);
    this._socketioService.disconnect();
  }

  sendMessage(): void {
    if (this.message.length == 0) {
      return
    }
    let socketBody = {
      message: this.message,
      createBy: this.userDeviceId,
      createAt: new Date(),
      chatId: this.chatRoomId
    }
    this._socketioService.sendMessage(socketBody);
    this.messages.push(socketBody);
    let body: Message = {
      chatRoomId: this.chatRoomId,
      createAt: null,
      createBy: this.userDeviceId,
      id: 0,
      message: this.message,
      updateAt: null,
      updateBy: ''
    }
    this._chatService.createaAnonymousMessage(body);
    this.message = '';
    this.scrollToBottom();
  }
}
