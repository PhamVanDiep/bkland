export interface SignUpRequest {
    id: string;
    firstName: string;
    lastName: string;
    middleName: string;
    username: string;
    email: string;
    password: string;
    identification: string;
    gender: string;
    provinceCode: string;
    districtCode: string;
    wardCode: string;
    address: string;
    phoneNumber: string;
    dateOfBirth: string;
    accountBalance: number;
    enable: boolean;
    roles: any;
    avatarUrl: string;
}