import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: async () => {
      //   console.log(process.env.NEXT_PUBLIC_API_URL, json);
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/auth/logout",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("Failed to logout");
      const res = await fetch("/api/auth/cookie", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        console.log("Error while deleting cookies");
        throw new Error("Failed to logout.");
      }
      const result = await response.json();
      // console.log(result);
      return result;
    },
    onSuccess: () => {
      toast.success("Logged out");
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["current"] });
    },
    onError: () => {
      toast.error("Failed to logout");
    },
  });
  return mutation;
};
