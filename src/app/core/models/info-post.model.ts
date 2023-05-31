import { InfoType } from "./info-type.model";
import { SignUpRequest } from "./sign-up.model";

export interface InfoPost {
    id: number;
    infoType: InfoType;
    title: string;
    description: string;
    content: string;
    imageUrl: string;
    view: number;
    createBy: string;
    createAt: any;
    updateBy: string;
    updateAt: any;
}

export interface InfoPostResponse {
    id: number;
    infoType: InfoType;
    title: string;
    description: string;
    content: string;
    imageUrl: string;
    view: number;
    createBy: string;
    createAt: any;
    updateBy: string;
    updateAt: any;
    user: SignUpRequest;
    retriveImage: any;
}

export interface TinTucResponse {
    infoType: InfoType;
    infoPosts: InfoPostResponse[];
}