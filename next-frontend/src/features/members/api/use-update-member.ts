import { NEXT_PUBLIC_API_URL } from "@/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
interface Payload {
  param: string;
  role: string;
}
export const useUpdateMember = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: Payload) => {
      const response = await fetch(
        NEXT_PUBLIC_API_URL + "/members/" + payload.param,
        {
          method: "PATCH",
          body: JSON.stringify({role: payload.role}),
          credentials: "include",
        }
      );
      if (!response.ok) {
        toast.error("Failed to update member");
      }
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Successfully updated the member!");
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
    onError: () => {
      toast.error("failed to update member");
    },
  });

  return mutation;
};
