import { z } from "zod"

export type TCourier = "ups" | "usps" | "ontrac" | "fedex" | "shippo"
export const courierEnum = z.enum(["ups", "usps", "ontrac", "fedex", "shippo"])

// ref https://docs.goshippo.com/docs/tracking/tracking/
export type TStatus =
	| "PRE_TRANSIT"
	| "TRANSIT"
	| "DELIVERED"
	| "RETURNED"
	| "FAILURE"
	| "UNKNOWN"

export const statusEnum = z.enum([
	"PRE_TRANSIT",
	"TRANSIT",
	"DELIVERED",
	"RETURNED",
	"FAILURE",
	"UNKNOWN",
])

const rawLocationSchema = z
	.object({
		city: z.string(),
		state: z.string(),
		zip: z.string(),
		country: z.string(),
	})
	.nullable()

export type TRawLocation = z.infer<typeof rawLocationSchema>

const locationSchema = z.object({
	name: z.string(),
	lat: z.number().nullable(),
	lng: z.number().nullable(),
})

export type TLocation = z.infer<typeof locationSchema>

export const shippoTrackingHistorySchema = z.object({
	object_created: z.string(),
	object_updated: z.string().nullable(),
	object_id: z.string(),
	status: statusEnum,
	status_details: z.string(),
	status_date: z.string(),
	location: rawLocationSchema,
})

export const shippoResponseSchema = z.object({
	carrier: courierEnum,
	tracking_number: z.string(),
	address_from: rawLocationSchema,
	address_to: rawLocationSchema,
	transaction: z.string().nullable(),
	original_eta: z.string().nullable(),
	eta: z.string().nullable(),
	servicelevel: z.object({
		token: z.string().nullable(),
		name: z.string().nullable(),
	}),
	metadata: z.string().nullable(),
	tracking_status: z.object({
		status_date: z.string(),
		status_details: z.string(),
		location: rawLocationSchema,
		substatus: z
			.object({
				code: z.string().nullable(),
				text: z.string().nullable(),
				action_required: z.boolean().nullable(),
			})
			.nullable(),
		object_created: z.string(),
		object_updated: z.string().nullable(),
		object_id: z.string(),
		status: statusEnum,
	}),
	tracking_history: z.array(shippoTrackingHistorySchema),
})

export type TShippoResponse = z.infer<typeof shippoResponseSchema>
export type TShippoTrackingHistory = z.infer<typeof shippoTrackingHistorySchema>

export const historyRowSchema = z.object({
	status: statusEnum,
	detailedStatus: z.string(),
	location: locationSchema,
	date: z.string(),
	deliveryLocation: z.string().nullable(),
})

export const trackingDataSchema = z.object({
	trackingNumber: z.string(),
	courier: courierEnum,
	status: historyRowSchema,
	eta: z.string().nullable(),
	progressPercentage: z.number().min(0).max(100),
	service: z.string().nullable(),
	sourceAndDestinationString: z.string().nullable(),
	transitTime: z.string().nullable(),
	trackingHistory: z.array(historyRowSchema),
})

export type TTrackingData = z.infer<typeof trackingDataSchema>
export type THistoryRow = z.infer<typeof historyRowSchema>
