import {axiosInstance} from "@/data/provider/AxiosClient";
import {getValue} from "@/core/utils/storage";

export const getFetcher = (url: string) => axiosInstance.get(url, {
    headers: {
      "ngrok-skip-browser-warning": true,
        // "token": `${getValue("token")}`,
    },
}).then(res => {
    return {status: res.status, data: res.data};
});

export const postFetcher = (url: string, {arg}: { arg: any }) =>
    axiosInstance.post(url, arg, {
        headers: {
            // "token": `${getValue("token")}`,
        },
    }).then(res => {
        return {status: res.status, data: res.data};
    });

export const patchFetcher = (url: string, {arg}: { arg: any }) =>
    axiosInstance.patch(url, arg, {
        headers: {
            "token": `${getValue("token")}`,
        },
    }).then(res => {
        return {status: res.status, data: res.data};
    });