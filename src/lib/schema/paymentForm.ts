import { z } from "zod";

// Define your Zod schema
export const FormSchema = z.object({
  player: z.number().min(-1, "Player selection is required"),
  amount: z.number().int("Amount must be a whole number"),
});

// Extract the type of the schema using z.infer
export type FormSchemaType = z.infer<typeof FormSchema>;
