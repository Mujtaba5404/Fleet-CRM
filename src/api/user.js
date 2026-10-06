import { useQuery } from "@tanstack/react-query";
import api from "../api/index";

export const useGetAllUsersQuery = (params) => {
  return useQuery({
    queryKey: ["users", "all", params],
    queryFn: () => api.get("users/all", { params }).then(({ data }) => data),
  });
};
