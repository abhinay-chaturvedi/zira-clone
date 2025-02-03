import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTaskPayload } from "../schema";
import { toast } from "sonner";
import { NEXT_PUBLIC_API_URL } from "@/config";
type t = createTaskPayload & {
  taskId: string;
};
export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: t) => {
      console.log("-----------", payload);
      const response = await fetch(
        NEXT_PUBLIC_API_URL + "/tasks/" + payload.taskId,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          credentials: "include",
        }
      );
      if (!response.ok) {
        // toast.error("Failed to create task.");
        throw new Error("Failed to create task");
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("task updated.");
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
      queryClient.invalidateQueries({
        queryKey: ["task", data.$id],
      });
    },
    onError: () => {
      toast.error("Failed to update the task");
    },
  });
  return mutation;
};
