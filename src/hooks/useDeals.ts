import { useQuery } from "@tanstack/react-query";
import { getSteamCatalog } from "../services/steam";
import { getCheapSharkDeals } from "../services/cheapshark";
import { useLocale } from "../i18n/LocaleContext";
import { useContentPreferences } from "../features/content/ContentPreferences";
import { filterContent } from "../features/content/contentPolicy";
export function useSteam() {
  const { locale } = useLocale();
  const { showExplicit } = useContentPreferences();
  return useQuery({
    queryKey: ["steam-catalog", locale],
    queryFn: ({ signal }) => getSteamCatalog(locale, signal),
    select: (catalog) => ({
      ...catalog,
      deals: filterContent(catalog.deals, showExplicit),
      releases: filterContent(catalog.releases, showExplicit),
    }),
    staleTime: 10 * 60_000,
    retry: 1,
  });
}
export function useDeals() {
  const { showExplicit } = useContentPreferences();
  const steam = useSteam();
  const cheapshark = useQuery({
    queryKey: ["cheapshark-deals"],
    queryFn: ({ signal }) => getCheapSharkDeals(signal),
    select: (deals) => filterContent(deals, showExplicit),
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
