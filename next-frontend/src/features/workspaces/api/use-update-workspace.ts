import { NEXT_PUBLIC_API_URL } from "@/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateWorkspacePayload } from "../schemas";
interface payload extends updateWorkspacePayload {
    param: string
}
export const useUpdateWorkspace = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (form: payload) => {
      const formData = new FormData();
      if (form.name) formData.append("name", form.name);
      if(form.image instanceof File) {
        formData.append("image", form.image as Blob);
      } else {
        formData.append("imageUrl", form.image as string)
      }
      
      // console.log(formData.get("name"))
      const response = await fetch(
        NEXT_PUBLIC_API_URL + "/workspaces/" + form.param,
        {
          method: "PATCH",
          body: formData,
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("Failed to update the workspace");
      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Workspace updated!");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspaces", data.$id] });
    },
    onError: () => {
      toast.error("Failed to create workspace!");
    },
  });
  return mutation;
};
