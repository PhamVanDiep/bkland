export interface UserDeviceToken {
    id: number,
    userId: string;
    deviceInfo: string;
    notifyToken: string;
    enable: boolean;
    logout: boolean;
    createBy: string;
    createAt: any;
    updateBy: string;
    updateAt: any;
}