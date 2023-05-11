export interface Login {
    username: string;
    password: string;
    deviceInfo: string;
}

export interface LoginResponse {
    username: string;
    email: string;
    id: string;
    refreshToken: string;
    type: string;
    accessToken: string;
    roles: any;
}