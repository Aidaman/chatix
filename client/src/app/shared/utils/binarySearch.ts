import { IMessage } from "../models/IMessage";

export function iterativeBS(arr: IMessage[], x: any) {
    let start = 0;
    let end = arr.length - 1;
    while (start <= end) {
        let mid = Math.floor((start + end) / 2);
        if (+ new Date(arr[mid].createdAt as Date) === +new Date(x.createdAt) && arr[mid]._id === x.id) return mid;
        else if ( +new Date(arr[mid].createdAt as Date) < +new Date(x.createdAt))
            start = mid + 1;
        else
            end = mid - 1;
    }
    return -1;
}
