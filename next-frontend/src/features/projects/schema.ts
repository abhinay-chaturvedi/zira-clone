import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
  workspaceId: z.string(),
});
export const updateProjectSchema = z.object({
  name: z.string().trim().min(1, "Name must be atleast of 1 character").optional(),
  image: z
    .union([
      z.instanceof(File),
      z.string(),
    ])
    .optional(),
});
export type updateProjectPayload = z.infer<typeof updateProjectSchema>
export type createProjectPayload = z.infer<typeof createProjectSchema>
