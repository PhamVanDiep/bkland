import { RealEstatePost } from "./real-estate-post.model";

export interface House {
    id: number;
    realEstatePost: RealEstatePost;
    noFloor: number;
    noBedroom: number;
    noBathroom: number;
    furniture: string;
    balconyDirection: string;
    frontWidth: number;
    behindWidth: number;
    streetWidth: number;
}