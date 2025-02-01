import { NEXT_PUBLIC_API_URL } from "@/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
interface payload {
    param: string;
    code: string;
}
export const useJoinWorkspace = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({param, code}:payload) => {
      
      const response = await fetch(
        NEXT_PUBLIC_API_URL + "/workspaces/" + param + "/join",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({code}),
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("Failed to join workspace");
      return await response.json();
    },
    onSuccess: ({ data }) => {
      // console.log("in success method")
      toast.success("Joined Workspace!");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspaces", data.$id] });
    },
    onError: () => {
      toast.error("Failed to join workspace!");
    },
  });
  return mutation;
};
