export default class Util {
    static setDateDiff(time: any): string {
        let diffTime = ((new Date()).getTime() - (new Date(time)).getTime()) / 1000;
        if (diffTime >= 24 * 60 * 60) {
            return Math.floor(diffTime / (24 * 60 * 60)) + ' ngày';
        } else if (diffTime >= 3600 && diffTime < 24 * 60 * 60) {
            return Math.floor(diffTime / (3600)) + ' giờ';
        } else if (diffTime >= 60 && diffTime < 3600) {
            return Math.floor(diffTime / 60) + ' phút';
        } else if (diffTime < 0) {
            return 'vừa xong';
        } else {
            return Math.floor(diffTime) + ' giây';
        }
    }
}