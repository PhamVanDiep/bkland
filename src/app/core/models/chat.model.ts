export interface NotificationMessage {
    content: string;
}

export interface Message {
    id: number;
    message: string;
    chatRoomId: number;
    createBy: string;
    createAt: any;
    updateBy: string;
    updateAt: any;
}

export interface ChatRoom {
    id: number;
    firstUserId: string;
    secondUserId: string;
    enable: boolean;
    anonymous: boolean;
    messages: Message[];
    createBy: string;
    createAt: any;
    updateBy: string;
    updateAt: any;
}