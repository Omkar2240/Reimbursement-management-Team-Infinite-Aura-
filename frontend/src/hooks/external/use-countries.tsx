import { useQuery } from "@tanstack/react-query";
import { getCountriesAndCurrencies } from "@/services/external.service";

export const useCountries = () => {
  return useQuery({
    queryKey: ["countries-currencies"],
    queryFn: getCountriesAndCurrencies,
    staleTime: Infinity, // Countries string data rarely changes
    refetchOnWindowFocus: false
  });
};
