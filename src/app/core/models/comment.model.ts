export interface Comment {
    id: number;
    postId: string;
    content: string;
    forumPost: boolean;
    createBy: string;
    createAt: any;
    updateBy: string;
    updateAt: any;
}

export interface CommentResponse {
    id: number;
    postId: string;
    content: string;
    forumPost: boolean;
    createBy: string;
    createAt: any;
    updateBy: string;
    updateAt: any;
    fullName: string;
    avatarUrl: any;
}