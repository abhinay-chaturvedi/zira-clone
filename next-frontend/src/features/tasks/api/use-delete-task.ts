import { NEXT_PUBLIC_API_URL } from "@/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  const router = useRouter()
  const mutation = useMutation({
    mutationFn: async ({ taskId }: { taskId: string }) => {
      const response = await fetch(NEXT_PUBLIC_API_URL + "/tasks/" + taskId, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!response.ok) {
        // toast.error("Failed to create task.");
        throw new Error("Failed to create task");
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Task deleted.");
      router.refresh()
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task", data.$id] });
    },
    onError: () => {
      toast.error("Failed to delete the task");
    },
  });
  return mutation;
};
