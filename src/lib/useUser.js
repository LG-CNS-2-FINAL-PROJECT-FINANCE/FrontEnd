import { useQuery } from "@tanstack/react-query";
import { getMe } from "../api/user_api";

export default function useUser() {
  const accessToken = localStorage.getItem("accessToken");
  const hasToken = Boolean(accessToken);

  const { isLoading, data, isError } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    enabled: hasToken,
    retry: false,
  });
  return {
    userLoading: hasToken ? isLoading : false,
    user: data,
    isLoggedIn: hasToken && !isError,
  };
}
