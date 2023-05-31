import { District } from "./district.model";
import { SignUpRequest } from "./sign-up.model";

export interface EnablePFRequest {
    userId: string;
    enable: boolean;
}

export interface PriceFluctuationRequest {
    userId: string;
    districts: string[];
    districtPrice: number;
    enable: boolean;
}

export interface PriceFluctuationResponse {
    user: SignUpRequest;
    districts: District[];
    districtPrice: number;
    enable: boolean;
    createBy: string;
    createAt: string;
    updateAt: string;
    updateBy: string;
}