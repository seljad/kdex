import { getFetcher } from "@/data/provider/fetcher";
import useSWRImmutable from "swr/immutable";

type UseGetSwrConfig = {
  fetchOnMount?: boolean;
};

export const useGetSwr = (url: string, config: UseGetSwrConfig = { fetchOnMount: true }) => {
  const { data, error, isLoading, mutate } = useSWRImmutable(
    url,
    getFetcher,
    {
      errorRetryCount: 0,
      revalidateOnFocus: config.fetchOnMount,
      revalidateOnMount: config.fetchOnMount,
    }
  );

  const fetchWithParams = (params?: Record<string, any>) => {
    const queryString = params
      ? `?${new URLSearchParams(params).toString()}`
      : "";
    return mutate(() => getFetcher(`${url}${queryString}`), { revalidate: false });
  };

  return {
    data,
    error,
    isLoading,
    mutate: fetchWithParams
  };
};
