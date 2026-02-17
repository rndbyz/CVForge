import { z } from "zod";

export const certificationSchema = z.object({
	id: z.string(),
	name: z.string().min(1, "Certification name is required"),
	issuer: z.string().min(1, "Issuer is required"),
	date: z.string().min(1, "Date is required"),
	expiryDate: z.string().optional(),
	credentialId: z.string().optional(),
});

export const certificationsSchema = z.array(certificationSchema);

export type Certification = z.infer<typeof certificationSchema>;
