import { NEXT_PUBLIC_API_URL } from "@/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
interface payload {
    param: string
}
export const useDeleteWorkspace = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({param}:payload) => {
      
      const response = await fetch(
        NEXT_PUBLIC_API_URL + "/workspaces/" + param,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("Failed to delete the workspace");
      return await response.json();
    },
    onSuccess: ({ data }) => {
      console.log("in success method")
      toast.success("Workspace Deleted!");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspaces", data.$id] });
    },
    onError: () => {
      toast.error("Failed to create workspace!");
    },
  });
  return mutation;
};
