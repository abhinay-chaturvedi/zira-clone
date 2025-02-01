import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProjectPayload } from "../schema";
import { toast } from "sonner";
import { NEXT_PUBLIC_API_URL } from "@/config";

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: createProjectPayload) => {
      const formData = new FormData();
      formData.append("name", payload.name);
      formData.append("image", payload.image as Blob);
      formData.append("workspaceId", payload.workspaceId);
      const response = await fetch(NEXT_PUBLIC_API_URL + "/projects", {
        method: "POST",
        body: formData,
        credentials: "include"
      });
      if (!response.ok) {
        toast.error("Failed to create project.");
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Project created.");
      queryClient.invalidateQueries({
        queryKey: ["projects", data.workspaceId],
      });
    },
    onError: () => {
        toast.error("Failed to create the project")
    }
  });
  return mutation;
};
