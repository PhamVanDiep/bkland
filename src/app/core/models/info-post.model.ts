import { InfoType } from "./info-type.model";

export interface InfoPost {
    id: number;
    infoType: InfoType;
    title: string;
    description: string;
    content: string;
    createBy: string;
    createAt: any;
    updateBy: string;
    updateAt: any;
}