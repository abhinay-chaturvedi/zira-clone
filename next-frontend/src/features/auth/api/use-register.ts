import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registerPayload } from "../schemas/authSchema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useRegister = () => {
    const queryClient = useQueryClient();
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: async (json: registerPayload) => {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(json),
          credentials: "include",
        }
      );
      if(!response.ok) throw new Error("Failed to register")
      const result = await response.json();
      // console.log(result);
      const res = await fetch("/api/auth/cookie", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({secret: result.secret })
      })
      if(!res.ok) {
        console.log("Error while adding cookies");
        router.push("/sign-in");
      }
      return result;
    },
    onSuccess: () => {
      toast.success("Registered")
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["current"] });
    },
    onError: () => {
      toast.error("Failed to register")
    }
  });
  return mutation;
};
