import { z } from "zod"

const shipmentRecordSchema = z.object({
	id: z.number(),
	name: z.string().max(250),
	courier: z.string().toLowerCase(),
	trackingNumber: z.string(),
	userId: z.string(),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
})

export type TShipmentRecord = z.infer<typeof shipmentRecordSchema>
