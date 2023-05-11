import { RealEstatePost } from "./real-estate-post.model";

export interface Plot {
    id: number;
    realEstatePost: RealEstatePost,
    frontWidth: number;
    behindWidth: number;
}