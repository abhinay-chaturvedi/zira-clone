import { NEXT_PUBLIC_API_URL } from "@/config";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetWorkspaceAnalytics = ({ workspaceId }: { workspaceId: string }) => {
  const query = useQuery({
    queryKey: ["workspace-analytics", workspaceId],
    queryFn: async () => {
      const response = await fetch(
        NEXT_PUBLIC_API_URL + `/workspaces/${workspaceId}/analytics`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!response.ok) {
        toast.error("Failed to load the workspace analytics.");
      }
      const { data } = await response.json();
      return data;
    },
  });
  return query;
};
