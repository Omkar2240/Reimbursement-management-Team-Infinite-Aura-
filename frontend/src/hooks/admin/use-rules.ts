import { useQuery } from "@tanstack/react-query"
// import apiClient from "@/config/api.config"

// Placeholder hook for Admin rules
export const useRules = () => {
  return useQuery({
    queryKey: ["rules"],
    queryFn: async () => {
      // return await apiClient.get("/rules")
      return []
    },
  })
}
