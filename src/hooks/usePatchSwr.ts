import useSWRMutation from "swr/mutation";
import {patchFetcher} from "@/data/provider/fetcher";

export const usePatchSwr = (url: string) => {
    const {data, error, trigger, isMutating} = useSWRMutation(url, patchFetcher);

    return {
        data,
        error,
        isLoading: isMutating,
        trigger,
    };
};