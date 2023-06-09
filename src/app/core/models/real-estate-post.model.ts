import { Apartment } from "./apartment.model";
import { District } from "./district.model";
import { House } from "./house.model";
import { Plot } from "./plot.model";
import { PostMedia } from "./post-media.model";
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
    view: number;
    clickedView: number;
    createBy: string;
    createAt: any;
    updateBy: string;
    updateAt: any;
}

export interface RealEstatePostRequest {
    realEstatePost: RealEstatePost;
    images: PostMedia[];
    plot: Plot;
    apartment: Apartment;
    house: House;
}

export interface SearchRequest {
    sell: any;
    type: any;
    keyword: any;
    provinceCode: any;
    districtCode: any[];
    wardCode: any[];
    startPrice: any;
    endPrice: any;
    startArea: any;
    endArea: any;
    noOfBedrooms: any[];
    direction: any[];
    limit: number;
    offset: number;
    userId: string;
    deviceInfo: string;
}