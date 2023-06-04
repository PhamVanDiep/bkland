import { PostMedia } from "./post-media.model";

export interface ForumPost {
    id: string;
    content: string;
    createBy: string;
    createAt: any;
    updateBy: string;
    updateAt: any;
    postMedia: PostMedia[];
}

export interface ForumPostLog {
    noReports: number;
    noLikes: number;
    noComments: number
}