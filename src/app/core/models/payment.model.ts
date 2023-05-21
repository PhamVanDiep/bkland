export interface Payment {
    content: string;
    amount: number;
    accountBalance: number;
    createAt: any;
}

export interface PostPay {
    id: number;
    user: any;
    realEstatePost: any;
    price: number;
    accountBalance: number;
    content: string;
    createAt: any;
}

export interface SpecialAccountPay {
    id: number,
    user: any;
    amount: number;
    accountBalance: number;
    content: string;
    monthlyPay: boolean;
    createBy: string;
    createAt: any;
}