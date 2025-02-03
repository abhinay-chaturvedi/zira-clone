import { NEXT_PUBLIC_API_URL } from "@/config";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
interface UseGetTasksProps {
  taskId: string
}
export const useGetTask = ({
  taskId,
}: UseGetTasksProps) => {
  const url = new URL("/api/tasks/" + taskId, NEXT_PUBLIC_API_URL);
  const query = useQuery({
    queryKey: ["task", taskId],
    queryFn: async () => {
      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        toast.error("Failed to fetch individual task.");
      }
      const { data } = await response.json();
      return data;
    },
  });
  return query;
};
