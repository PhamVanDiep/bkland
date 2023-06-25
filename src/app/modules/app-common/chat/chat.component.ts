import { HttpStatusCode } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ReplaySubject, firstValueFrom, takeUntil } from 'rxjs';
import { APIResponse } from 'src/app/core/models/api-response.model';
import { ChatRoom, Message } from 'src/app/core/models/chat.model';
import { AppTitleService } from 'src/app/core/services/app-title.service';
import { ChatService } from 'src/app/core/services/chat.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { MediaService } from 'src/app/core/services/media.service';
import { MessageService } from 'src/app/core/services/message.service';
import { SocketioService } from 'src/app/core/services/socketio.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewInit, OnDestroy {
  private _unsubscribe: ReplaySubject<any> = new ReplaySubject<any>();
  private title: string = "Nhắn tin";

  @ViewChild('chatInputParent')
  chatInputParent: ElementRef;

  @ViewChild('listMessages')
  listMessages: ElementRef;

  chatInputParentWidth: any;

  message: string;
  selectedChatId: number;

  sidebarVisible: boolean;

  innerWidth: any;

  chatRooms: any[];
  messages: any[];

  currentUserId: string;

  selectedChatRoom: any;
  currentUserAvatarRetrive: any;

  newChatRoomDialogVisible: boolean;
  selectedNewChatUser: any;
  lstUsers: any[];
  lstUserClones: any[];
  filterValue: string;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
    this.chatInputParentWidth = this.chatInputParent.nativeElement.offsetWidth;
  }

  constructor(
    private _appTitleServie: AppTitleService,
    private _loadingService: LoadingService,
    private _messageService: MessageService,
    private _socketioService: SocketioService,
    private _chatService: ChatService,
    private _mediaService: MediaService
  ) {
    this._appTitleServie.setTitle(this.title);
    this.messages = [];
    this.message = '';
    this.innerWidth = window.innerWidth;
    this.sidebarVisible = false;
    this.chatRooms = [];
    this.selectedChatId = 0;
    this.currentUserId = JSON.parse(window.atob((localStorage.getItem('accessToken') || '').split('.')[1])).id;
    this.newChatRoomDialogVisible = false;
    this.lstUsers = [];
    this.lstUserClones = [];
    this.filterValue = '';
  }

  ngAfterViewInit(): void {
    // throw new Error('Method not implemented.');
    this.chatInputParentWidth = this.chatInputParent.nativeElement.offsetWidth;
  }

  sidebarModal(): boolean {
    if (this.innerWidth < 1024) {
      return true
    }
    return false;
  }

  ngOnInit(): void {
    this._loadingService.loading(true);
    this._socketioService.connect();

    this._socketioService.receiveMessage();
    this._socketioService.message$
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: any) => {
        if (response != null) {
          this.messages.push(response);
          this.scrollToBottom();
        }
      })

    this._chatService.findChatRoomByUser()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        this._loadingService.loading(false);
        if (response.status === HttpStatusCode.Ok) {
          this.chatRooms = response.data;
          this.chatRooms.forEach(e => {
            e.avatarRetrive = '/assets/images/user.png';
            if (e.avatarUrl == undefined || e.avatarUrl == null || e.avatarUrl.length == 0) {
              e.avatarRetrive = '/assets/images/user.png'
            } else if (e.avatarUrl.includes(environment.BASE_URL_NO_AUTH)) {
              this._mediaService.retriveImage(e.avatarUrl)
                .pipe(takeUntil(this._unsubscribe))
                .subscribe((response: APIResponse) => {
                  if (response.status === HttpStatusCode.Ok) {
                    e.avatarRetrive = this._mediaService.getImgSrc(response.data);
                  } else {
                    this._messageService.errorMessage(response.message);
                  }
                })
            } else {
              e.avatarRetrive = e.avatarUrl;
            }
          })
        } else {
          this._messageService.errorMessage(response.message);
        }
      });

    this._mediaService.avatar$
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: any) => {
        if (response != null) {
          this.currentUserAvatarRetrive = response;
        }
      })
  }

  sendMessage(): void {
    if (this.message.length == 0) {
      return
    }
    let socketBody = {
      message: this.message,
      createBy: this.currentUserId,
      createAt: new Date(),
      chatId: this.selectedChatId
    }
    this._socketioService.sendMessage(socketBody);
    this.messages.push(socketBody);
    let body: Message = {
      chatRoomId: this.selectedChatId,
      createAt: null,
      createBy: '',
      id: 0,
      message: this.message,
      updateAt: null,
      updateBy: ''
    }
    this._chatService.createMessage(body);
    this.message = '';
    this.scrollToBottom();
  }

  imageClick(): void {
    if (this.innerWidth > 640) {
      return;
    }
    this.sidebarVisible = true;
  }
  getLastMessageOfChatRoom(item: any): string {
    let message = item.message.length > 30 ? item.message.substr(0, 30) + '...' : item.message;
    if (this.currentUserId == item.createBy) {
      return 'Bạn: ' + message;
    } else {
      return item.fullName + ': ' + message;
    }
  }

  onChatRoomSelect(item: any): void {
    if (this.selectedChatRoom != null && this.selectedChatRoom.id == item.id) {
      return;
    }
    this._loadingService.loading(true);
    this.selectedChatRoom = item;
    this._socketioService.joinConversation(this.selectedChatRoom.id);
    this._chatService.chatRoomDetail(this.selectedChatId)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        this._loadingService.loading(false);
        if (response.status === HttpStatusCode.Ok) {
          this.messages = response.data.messages;
          this.sidebarVisible = false;
          this.scrollToBottom();
        } else {
          this._messageService.errorMessage(response.message);
        }
      })
  }

  scrollToBottom(): void {
    try {
      setTimeout(() => {
        this.listMessages.nativeElement.scrollTop = this.listMessages.nativeElement.scrollHeight;
      }, 500);
    } catch (err) { }
  }

  createNewChatRoom(): void {
    this._loadingService.loading(true);
    let body: ChatRoom = {
      anonymous: false,
      createAt: null,
      createBy: '',
      enable: true,
      firstUserId: this.currentUserId,
      secondUserId: this.selectedNewChatUser.id,
      id: 0,
      messages: [],
      updateAt: null,
      updateBy: ''
    };
    this._chatService.createChatRoom(body)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        this._loadingService.loading(false);
        if (response.status === HttpStatusCode.Ok) {
          let newChatRoom = {
            id: response.data.id,
            avatarUrl: this.selectedNewChatUser.avatarUrl,
            message: '',
            createBy: '',
            fullName: this.selectedNewChatUser.fullName,
            avatarRetrive: this.selectedNewChatUser.avatarRetrive
          }
          this.chatRooms.push(newChatRoom);
          this.selectedChatRoom = newChatRoom;
          this.selectedChatId = response.data.id;
          this.onChatRoomSelect(newChatRoom);
          this.messages = [];
          this.newChatRoomDialogVisible = false;
        } else {
          this._messageService.errorMessage(response.message);
        }
      })
  }

  filter(): void {
    this.lstUserClones = this.lstUsers.filter(e => e.fullName.includes(this.filterValue) || e.phoneNumber.includes(this.filterValue));
  }

  async getListChatUserEnable() {
    this._loadingService.loading(true);
    let response = await firstValueFrom(this._chatService.getChatUserEnable().pipe(takeUntil(this._unsubscribe)));
    this._loadingService.loading(false);
    if (response.status === HttpStatusCode.Ok) {
      for (let index = 0; index < response.data.length; index++) {
        const element = response.data[index];
        element.avatarRetrive = '/assets/images/user.png';
        if (element.avatarUrl == undefined || element.avatarUrl == null || element.avatarUrl.length == 0) {
          element.avatarRetrive = '/assets/images/user.png'
        } else if (element.avatarUrl.includes(environment.BASE_URL_NO_AUTH)) {
          await firstValueFrom(this._mediaService.retriveImage(element.avatarUrl)
            .pipe(takeUntil(this._unsubscribe))) 
            .then((response1: APIResponse) => {
              if (response1.status === HttpStatusCode.Ok) {
                element.avatarRetrive = this._mediaService.getImgSrc(response1.data);
              } else {
                this._messageService.errorMessage(response1.message);
              }
            });
        } else {
          element.avatarRetrive = element.avatarUrl;
        }
      }
      this.lstUsers = response.data;
      this.lstUserClones = response.data;
    } else {
      this._messageService.errorMessage(response.message);
    }
  }

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
    if (this.selectedChatId != null) {
      this._socketioService.leaveConversation(this.selectedChatId);
    }
    this._socketioService.disconnect();
  }
}
