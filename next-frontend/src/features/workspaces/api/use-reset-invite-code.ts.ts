import { NEXT_PUBLIC_API_URL } from "@/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
interface payload {
    param: string
}
export const useResetInviteCode = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({param}:payload) => {
      
      const response = await fetch(
        NEXT_PUBLIC_API_URL + "/workspaces/" + param + "/reset-invite-code",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("Failed to reset the code");
      return await response.json();
    },
    onSuccess: ({ data }) => {
      console.log("in success method")
      toast.success("Invite code resetted!");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspaces", data.$id] });
    },
    onError: () => {
      toast.error("Failed to reset the invite code!");
    },
  });
  return mutation;
};
