import { z } from "zod";

export const templateVariantSchema = z.enum(["modern", "classic", "ats"]);

export type TemplateVariant = z.infer<typeof templateVariantSchema>;
