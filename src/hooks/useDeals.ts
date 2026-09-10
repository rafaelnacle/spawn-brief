import { useQuery } from "@tanstack/react-query";
import { getSteamCatalog } from "../services/steam";
import { getCheapSharkDeals } from "../services/cheapshark";
import { useLocale } from "../i18n/LocaleContext";
export function useSteam() {
  const { locale } = useLocale();
  return useQuery({
    queryKey: ["steam-catalog", locale],
    queryFn: ({ signal }) => getSteamCatalog(locale, signal),
    staleTime: 10 * 60_000,
    retry: 1,
  });
}
export function useDeals() {
  const steam = useSteam();
  const cheapshark = useQuery({
    queryKey: ["cheapshark-deals"],
    queryFn: ({ signal }) => getCheapSharkDeals(signal),
    staleTime: 10 * 60_000,
    retry: 1,
  });
  return {
    data: [...(steam.data?.deals ?? []), ...(cheapshark.data ?? [])],
    isPending: steam.isPending && cheapshark.isPending,
    isFetching: steam.isFetching || cheapshark.isFetching,
    isError: steam.isError && cheapshark.isError,
    failedSources: [steam.isError ? "Steam" : "", cheapshark.isError ? "CheapShark" : ""].filter(
      Boolean,
    ),
    refetch: () => Promise.all([steam.refetch(), cheapshark.refetch()]),
  };
}
