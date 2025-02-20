import { NEXT_PUBLIC_API_URL } from "@/config";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetProjectAnalytics = ({ projectId }: { projectId: string }) => {
  const query = useQuery({
    queryKey: ["project-analytics", projectId],
    queryFn: async () => {
      const response = await fetch(
        NEXT_PUBLIC_API_URL + `/projects/${projectId}/analytics`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!response.ok) {
        toast.error("Failed to load the project analytics.");
      }
      const { data } = await response.json();
      return data;
    },
  });
  return query;
};
