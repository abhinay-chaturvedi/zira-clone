import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { NEXT_PUBLIC_API_URL } from "@/config";
import { TaskStatus } from "../types";
type t =  {
  $id: string;
  status: TaskStatus;
  position: number;
}[];
export const useBulkUpdateTasks = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: t) => {
      console.log("-----------", payload);
      const response = await fetch(
        NEXT_PUBLIC_API_URL + "/tasks/bulk-update",
        {
          method: "POST",
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
    onSuccess: () => {
      toast.success("tasks updated.");
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
    onError: () => {
      toast.error("Failed to update the tasks");
    },
  });
  return mutation;
};
