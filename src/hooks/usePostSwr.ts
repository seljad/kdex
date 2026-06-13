import useSWRMutation from "swr/mutation";
import { postFetcher } from "@/data/provider/fetcher";

export const usePostSwr = (url: string) => {
    const { data, error, trigger, isMutating } = useSWRMutation(url, postFetcher);

    return {
        data,
        error,
        isLoading: isMutating,
        trigger,
    };
};