import { NEXT_PUBLIC_API_URL } from "@/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createWorkSpacePayload } from "../schemas";

export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (form: createWorkSpacePayload) => {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("image", form.image as Blob);
      // console.log(formData.get("name"))
      const response = await fetch(NEXT_PUBLIC_API_URL + "/workspaces", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if(!response.ok) throw new Error("Failed to create the workspace")
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Workspace created!");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
    onError: () => {
      toast.error("Failed to create workspace!")
    }
  });
  return mutation;
};
