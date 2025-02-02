import { NEXT_PUBLIC_API_URL } from "@/config";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { TaskStatus } from "../types";
interface UseGetTasksProps {
  workspaceId: string;
  projectId?: string | null;
  status?: TaskStatus | null;
  search?: string | null;
  assigneeId?: string | null;
  dueDate?: string | null;
}
export const useGetTasks = ({
  workspaceId,
  projectId,
  status,
  search,
  assigneeId,
  dueDate,
}: UseGetTasksProps) => {
  const url = new URL("/api/tasks", NEXT_PUBLIC_API_URL);
  url.searchParams.set("workspaceId", workspaceId);
  if (projectId) url.searchParams.set("projectId", projectId);
  if (status) url.searchParams.set("status", status);
  if (search) url.searchParams.set("search", search);
  if (assigneeId) url.searchParams.set("assigneeId", assigneeId);
  if (dueDate) url.searchParams.set("dueDate", dueDate);
  const query = useQuery({
    queryKey: [
      "tasks",
      workspaceId,
      projectId,
      status,
      search,
      assigneeId,
      dueDate,
    ],
    queryFn: async () => {
      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        toast.error("Failed to load the tasks.");
      }
      const { data } = await response.json();
      return data;
    },
  });
  return query;
};
