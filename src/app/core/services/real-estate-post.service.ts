import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { APIResponse } from '../models/api-response.model';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class RealEstatePostService {
    private _interestPosts: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    private _searchBody: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    get searchBody$(): Observable<any> {
        return this._searchBody.asObservable();
    }

    get interestPosts$(): Observable<any> {
        return this._interestPosts.asObservable();
    }

    setInterestPosts(res: number): void {
        this._interestPosts.next(res);
    }

    setSearchBody(body: any): void {
        this._searchBody.next(body);
    }
    
    private accessToken: string;

    constructor(
        private _httpClient: HttpClient
    ) { 
        this.accessToken = localStorage.getItem('accessToken') || '';
    }

    createPost(body: any): Observable<APIResponse> {
        this.accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.post<APIResponse>(`${environment.BASE_URL_AUTH}/real-estate-post`, body,
            {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            }
        );
    }

    getPostById(id: string): Observable<APIResponse> {
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_NO_AUTH}/real-estate-post/${id}`);
    }

    findByIdWithIncreaseView(id: string): Observable<APIResponse> {
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_NO_AUTH}/real-estate-post/user-view/${id}`);
    }

    clickUserDetail(body: any): Observable<APIResponse> {
        return this._httpClient.post<APIResponse>(`${environment.BASE_URL_NO_AUTH}/real-estate-post/click-info`, body);
    }

    updatePost(body: any): Observable<APIResponse> {
        this.accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.put<APIResponse>(`${environment.BASE_URL_AUTH}/real-estate-post`, body,
            {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            }
        );
    }

    getPostdByOwnerId(): Observable<APIResponse> {
        this.accessToken = localStorage.getItem('accessToken') || '';
        let _id = JSON.parse(window.atob((localStorage.getItem('accessToken') || '').split('.')[1])).id;
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_AUTH}/real-estate-post/user/${_id}`, {
            headers: {
                'Authorization': `Bearer ${this.accessToken}`
            }
        });
    }

    disablePost(postId: string): Observable<APIResponse> {
        this.accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.put<APIResponse>(`${environment.BASE_URL_AUTH}/real-estate-post/disable/${postId}`, null, {
            headers: {
                'Authorization': `Bearer ${this.accessToken}`
            }
        })
    }

    getAllPost(): Observable<APIResponse> {
        this.accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_AUTH}/real-estate-post/all`, {
            headers: {
                'Authorization': `Bearer ${this.accessToken}`
            }
        })
    }

    disableOrEnablePost(id: string): Observable<APIResponse> {
        this.accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.put<APIResponse>(`${environment.BASE_URL_AUTH}/real-estate-post/enable/${id}`, null,
            {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            }
        );
    }

    updatePostStatus(body: any): Observable<any> {
        this.accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.put<APIResponse>(`${environment.BASE_URL_AUTH}/real-estate-post/status`, body,
            {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            }
        );
    }

    enableRequest(): Observable<any> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_AUTH}/real-estate-post/enable-request`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
    }

    userRequested(): Observable<any> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_AUTH}/real-estate-post/user-requested`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
    }

    agencyRequested(): Observable<any> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_AUTH}/real-estate-post/agency-requested`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
    }

    findContactOfPost(id: string): Observable<any> {
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_NO_AUTH}/real-estate-post/contact?id=${id}`);
    }

    anonymousInterested(body: any): Observable<APIResponse> {
        return this._httpClient.post<APIResponse>(`${environment.BASE_URL_NO_AUTH}/real-estate-post/interested`, body);
    }

    userInterested(body: any): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.post<APIResponse>(`${environment.BASE_URL_AUTH}/real-estate-post/interested`, body, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
    }

    findByUserIdAndDeviceInfo(userId: string, deviceInfo: string): Observable<APIResponse> {
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_NO_AUTH}/real-estate-post/interested?userId=${userId}&deviceInfo=${deviceInfo}`);
    }

    countByUserIdAndDeviceInfo(userId: string, deviceInfo: string): Observable<APIResponse> {
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_NO_AUTH}/real-estate-post/interested/count?userId=${userId}&deviceInfo=${deviceInfo}`);
    }

    isInterested(userId: string, realEstatePostId: string, deviceInfo: string): Observable<APIResponse> {
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_NO_AUTH}/real-estate-post/isInterested?userId=${userId}&deviceInfo=${deviceInfo}&realEstatePostId=${realEstatePostId}`);
    }

    detailPageData(sell: number, type: string, limit: number, offset: number, userId: string, deviceInfo: string): Observable<APIResponse> {
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_NO_AUTH}/real-estate-post/detailPageData?sell=${sell}&type=${type}&limit=${limit}&offset=${offset}&userId=${userId}&deviceInfo=${deviceInfo}`);
    }

    countTotalBySellAndTypeClient(sell: number, type: string): Observable<APIResponse> {
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_NO_AUTH}/real-estate-post/countTotalBySellAndTypeClient?sell=${sell}&type=${type}`);
    }

    countNoOfInterestAndComment(id: string): Observable<APIResponse> {
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_NO_AUTH}/real-estate-post/interestAndComment?postId=${id}`);
    }

    getPostsByMostInterested(): Observable<APIResponse> {
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_NO_AUTH}/real-estate-post/mostInterested`);
    }

    getPostsByMostView(): Observable<APIResponse> {
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_NO_AUTH}/real-estate-post/mostView`);
    }

    getPostsByNewest(): Observable<APIResponse> {
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_NO_AUTH}/real-estate-post/newest`);
    }

    search(body: any): Observable<APIResponse> {
        return this._httpClient.post<APIResponse>(`${environment.BASE_URL_NO_AUTH}/real-estate-post/search`, body);
    }

    getChart1Data(sell: number, type: string, provinceCode: string, year: number): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_AUTH}/real-estate-post/statistic/chart1?sell=${sell}&type=${type}&provinceCode=${provinceCode}&year=${year}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
    }

    getChart2Data(sell: number, type: string, provinceCode: string, year: number): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_AUTH}/real-estate-post/statistic/chart2?sell=${sell}&type=${type}&provinceCode=${provinceCode}&year=${year}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
    }

    getPriceFluctuationStatistic(sell: number, type: string, provinceCode: string, districCode: string, wardCode: string, month: number, year: number): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_AUTH}/real-estate-post/statistic/price-fluctuation?sell=${sell}&type=${type}&provinceCode=${provinceCode}&districtCode=${districCode}&month=${month}&wardCode=${wardCode}&year=${year}`, 
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
    }

    getMostRepPriceFluctuation(): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_AUTH}/real-estate-post/statistic/most-change-price`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
    }

    getPriceChartOption(postId: string): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_AUTH}/real-estate-post/statistic/price?postId=${postId}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
    }

    getViewChartOption(postId: string, month: number, year: number): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_AUTH}/real-estate-post/statistic/view?postId=${postId}&month=${month}&year=${year}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
    }

    getCommentChartOption(postId: string, month: number, year: number): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_AUTH}/real-estate-post/statistic/comment?postId=${postId}&month=${month}&year=${year}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
    }

    getInterestedChartOption(postId: string, month: number, year: number): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_AUTH}/real-estate-post/statistic/interested?postId=${postId}&month=${month}&year=${year}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
    }

    getReportChartOption(postId: string, month: number, year: number): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_AUTH}/real-estate-post/statistic/report?postId=${postId}&month=${month}&year=${year}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
    }

    getClickedViewChartOption(postId: string, month: number, year: number): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_AUTH}/real-estate-post/statistic/click?postId=${postId}&month=${month}&year=${year}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
    }

    getAllPostOfUser(): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_AUTH}/real-estate-post/all-of-user`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
    }

    getAllInterestedUsersOfPost(postId: string): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_AUTH}/real-estate-post/interested/all-user?postId=${postId}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
    }

    completeStatus(postId: string): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.post<APIResponse>(`${environment.BASE_URL_AUTH}/real-estate-post/complete-status?realEstatePostId=${postId}`, null, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
    }
}
