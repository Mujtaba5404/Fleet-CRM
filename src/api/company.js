import { useQuery } from "@tanstack/react-query";
import api from "../api/index";

export const useGetAllCompaniesQuery = (params) => {
  return useQuery({
    queryKey: ["companies", "all", params],
    queryFn: () =>
      api.get("companies/all", { params }).then(({ data }) => data),
  });
};
