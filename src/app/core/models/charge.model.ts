import { SignUpRequest } from "./sign-up.model";

export interface Charge {
    id: number;
    soTien: number;
    user: SignUpRequest;
    accountBalance: number;
    chargeType: string;
    status: string;
    imageUrl: string;
    createBy: string;
    createAt: any;
}