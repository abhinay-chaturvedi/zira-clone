import { NEXT_PUBLIC_API_URL } from "@/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
interface DeletePayload {
  projectId: string;
}
export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: DeletePayload) => {
      const response = await fetch(
        NEXT_PUBLIC_API_URL + "/projects/" + payload.projectId,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!response.ok) {
        toast.error("Failed to delete the project project.");
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Project Deleted");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", data.$id] });
    },
  });
  return mutation;
};
