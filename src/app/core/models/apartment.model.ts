import { RealEstatePost } from "./real-estate-post.model";

export interface Apartment {
    id: number;
    realEstatePost: RealEstatePost;
    floorNo: number;
    noBedroom: number;
    noBathroom: number;
    furniture: string;
    balconyDirection: string;
    construction: string; 
}