import { NEXT_PUBLIC_API_URL } from "@/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateProjectPayload } from "../schema";
interface UpdatePayload extends updateProjectPayload {
  projectId: string;
}
export const useUpdateProject = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: UpdatePayload) => {
      const formData = new FormData();
      if (payload.name) {
        formData.append("name", payload.name);
      }

      if (payload.image instanceof File) {
        formData.append("image", payload.image as Blob);
      } else {
        formData.append("imageUrl", payload.image as string);
      }

      const response = await fetch(
        NEXT_PUBLIC_API_URL + "/projects/" + payload.projectId,
        {
          method: "PATCH",
          body: formData,
          credentials: "include",
        }
      );
      if (!response.ok) {
        toast.error("Failed to update project.");
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Project updated.");
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", data.$id] });
    },
    onError: () => {
      toast.error("Failed to update the project");
    },
  });
  return mutation;
};
