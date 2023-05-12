import { District } from "./district.model";
import { Province } from "./province.model";
import { Ward } from "./ward.model";

export interface UserInfo {
    id: string;
    firstName: string;
    lastName: string;
    middleName: string;
    username: string;
    email: string;
    password: string;
    identification: string;
    gender: string;
    province: Province;
    district: District;
    ward: Ward;
    address: string;
    phoneNumber: string;
    dateOfBirth: any;
    accountBalance: number;
    enable: boolean;
    roles: any;
    avatarUrl: string;
    createBy: string;
    createAt: any;
    updateBy: string;
    updateAt: any;
}