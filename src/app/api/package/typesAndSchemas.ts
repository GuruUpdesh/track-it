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

const locationSchema = z
	.object({
		city: z.string(),
		state: z.string(),
		zip: z.string(),
		country: z.string(),
	})
	.nullable()

export type TLocation = z.infer<typeof locationSchema>

export const shippoTrackingHistorySchema = z.object({
	object_created: z.string(),
	object_updated: z.string().nullable(),
	object_id: z.string(),
	status: statusEnum,
	status_details: z.string(),
	status_date: z.string(),
	location: locationSchema,
})

export const shippoResponseSchema = z.object({
	carrier: courierEnum,
	tracking_number: z.string(),
	address_from: locationSchema,
	address_to: locationSchema,
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
		location: locationSchema,
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

export const trackingHistorySchema = z.object({
	status: statusEnum,
	detailedStatus: z.string(),
	location: z.string(),
	date: z.string(),
	deliveryLocation: z.string().nullable(),
})

export const PackageInfoSchema = z.object({
	trackingNumber: z.string(),
	courier: courierEnum,
	status: trackingHistorySchema,
	eta: z.string().nullable(),
	progressPercentage: z.number().min(0).max(100),
	service: z.string().nullable(),
	sourceAndDestinationString: z.string().nullable(),
	transitTime: z.string().nullable(),
	trackingHistory: z.array(trackingHistorySchema),
})

export type TPackageInfo = z.infer<typeof PackageInfoSchema>
export type TTrackingHistory = z.infer<typeof trackingHistorySchema>
