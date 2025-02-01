import { NEXT_PUBLIC_API_URL } from "@/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
interface Payload {
  param: string;
}
export const useDeleteMember = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: Payload) => {
      const response = await fetch(
        NEXT_PUBLIC_API_URL + "/members/" + payload.param,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!response.ok) {
        toast.error("Failed to delete member");
      }
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Successfully deleted the member!");
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
    onError: () => {
      toast.error("failed to delete member");
    },
  });

  return mutation;
};
