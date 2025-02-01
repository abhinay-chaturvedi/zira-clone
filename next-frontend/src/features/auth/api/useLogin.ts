import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginPayload } from "../schemas/authSchema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: async (json: loginPayload) => {
    //   console.log(process.env.NEXT_PUBLIC_API_URL, json);
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(json),
        credentials: "include"
      });
      if(!response.ok) throw new Error("Failed to login")
      const result = await response.json();
      // console.log(result);
      return result
    },
    onSuccess: () => {
      toast.success("Logged in")
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["current"] });
    },
    onError: () => {
      toast.error("Failed to login")
    }
  });
  return mutation;
};
