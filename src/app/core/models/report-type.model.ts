export interface ReportType {
    id: number;
    name: string;
    forum: boolean;
    createBy: string;
    createAt: any;
    updateBy: string;
    updateAt: any;
}

export interface ReportTypeResponse {
    id: number;
    name: string;
    forum: boolean;
    createBy: string;
    createAt: any;
    updateBy: string;
    updateAt: any;
    count: number;
}