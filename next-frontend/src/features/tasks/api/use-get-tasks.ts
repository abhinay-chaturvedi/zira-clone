import { NEXT_PUBLIC_API_URL } from "@/config";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetTasks = ({ workspaceId }: { workspaceId: string }) => {
  const query = useQuery({
    queryKey: ["tasks", workspaceId],
    queryFn: async () => {
      const response = await fetch(
        NEXT_PUBLIC_API_URL + `/tasks/?workspaceId=${workspaceId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!response.ok) {
        toast.error("Failed to load the tasks.");
      }
      const { data } = await response.json();
      return data;
    },
  });
  return query;
};
