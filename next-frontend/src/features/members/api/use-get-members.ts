import { NEXT_PUBLIC_API_URL } from "@/config";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
interface Payload {
  workspaceId: string;
}
export const useGetMembers = (payload: Payload) => {
  console.log(payload);
  const query = useQuery({
    queryKey: ["members", payload.workspaceId],
    queryFn: async () => {
      const response = await fetch(NEXT_PUBLIC_API_URL + "/members?workspaceId="+payload.workspaceId, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        toast.error("Failed to fetch members!");
        throw new Error("Failed to fetch the workspaces!");
      }
      const { data } = await response.json();
      console.log(data);
      return data;
    },
  });

  return query;
};
