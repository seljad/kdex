import {getFetcher} from "@/data/provider/fetcher";
import useSWRMutation from "swr/mutation";

export const useGetSwrMutation = (url: string) => {
    const {data, error, isMutating, trigger} = useSWRMutation(url, getFetcher, {});

    return {
        data,
        error,
        isLoading: isMutating,
        trigger
    };
};