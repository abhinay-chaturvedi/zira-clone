import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTaskPayload } from "../schema";
import { toast } from "sonner";
import { NEXT_PUBLIC_API_URL } from "@/config";

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: createTaskPayload) => {
      const response = await fetch(NEXT_PUBLIC_API_URL + "/tasks", {
        method: "POST",
        body: JSON.stringify(payload),
        credentials: "include"
      });
      if (!response.ok) {
        toast.error("Failed to create task.");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("task created.");
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
    onError: () => {
        toast.error("Failed to create the task")
    }
  });
  return mutation;
};
