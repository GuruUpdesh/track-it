import { z } from "zod"

export const shipmentRecordCreateSchema = z.object({
	name: z.string().max(250),
	courier: z.string().toLowerCase(),
	trackingNumber: z.string(),
	userId: z.string(),
	position: z.number().min(0),
	createdAt: z.string().datetime().optional(),
})

export type TShipmentRecordCreate = z.infer<typeof shipmentRecordCreateSchema>

export const shipmentRecordSchema = shipmentRecordCreateSchema.merge(
	z.object({
		id: z.number(),
		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})
)

export type TShipmentRecord = z.infer<typeof shipmentRecordSchema>

export const shipmentRecordUpdateSchema = z.object({
	id: z.number(),
	name: z.string().max(250).optional(),
	courier: z.string().toLowerCase().optional(),
	trackingNumber: z.string().optional(),
	position: z.number().min(0).optional(),
})

export type TShipmentRecordUpdate = z.infer<typeof shipmentRecordUpdateSchema>

export const shipmentIdSchema = z.object({ id: z.number().min(0) })
