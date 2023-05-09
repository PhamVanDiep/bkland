import { District } from "./district.model";
import { Province } from "./province.model";
import { SignUpRequest } from "./sign-up.model";
import { Ward } from "./ward.model";

export interface RealEstatePost {
    id: string;
    type: string;
    ownerId: SignUpRequest;
    title: string;
    description: string;
    addressShow: string;
    area: number;
    price: number;
    province: Province;
    district: District;
    ward: Ward;
    status: string;
    lat: number;
    lng: number;
    enable: boolean;
    priority: number;
    period: number;
    direction: string;
    sell: boolean;
    street: string;
    createBy: string;
    createAt: any;
    updateBy: string;
    updateAt: any;
}