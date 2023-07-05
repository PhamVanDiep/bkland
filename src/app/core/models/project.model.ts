import { District } from "./district.model"
import { Province } from "./province.model";
import { Ward } from "./ward.model";

export interface Project {
    area: number;
    createAt: any;
    createBy: string;
    district: District;
    email: string;
    enable: boolean;
    id: string;
    imageUrl: string;
    name: string;
    phoneNumber: string;
    projectParams: ProjectParam[];
    province: Province;
    type: string;
    updateAt: any;
    updateBy: string;
    ward: Ward;
    address: string;
    content: string;
}

export interface ProjectParam {
    id: number;
    name: string;
    projectId: string;
    value: string;
}