import { z } from "zod";

export const createWorkSpaceSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
});
export const updateWorkspaceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name must be atleast of 1 character")
    .optional(),
  image: z
    .union([
      z.instanceof(File),
      z.string(),
    ])
    .optional(),
});
export type updateWorkspacePayload = z.infer<typeof updateWorkspaceSchema>;
export type createWorkSpacePayload = z.infer<typeof createWorkSpaceSchema>;
