import { useQuery } from "@tanstack/react-query";
import { fetchProperties } from "../services/propertiesApi";
import { buildPropertyQuery } from "../utils/queryParamBuilder";

export function useSearchProperties(filters, sortBy) {
  return useQuery({
    queryKey: ["properties", filters, sortBy],
    queryFn: () => {
      const params = buildPropertyQuery(filters, sortBy);
      return fetchProperties(params);
    },
    staleTime: 20_000,
    keepPreviousData: true,
  });
}
