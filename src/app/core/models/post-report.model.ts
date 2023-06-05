import { ReportType } from "./report-type.model";

export interface PostReport {
    id: number,
    description: string;
    postId: string;
    isForumPost: boolean;
    createBy: string;
    createAt: any;
    reportTypes: ReportType[];
}