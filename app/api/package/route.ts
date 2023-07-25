import {
	PackageInfo,
	PackageInfoSchema,
	ShippoResponse,
	ShippoTrackingHistory,
	TCourier,
	TStatus,
	TrackingHistory,
	shippoResponseSchema,
} from "./typesAndSchemas"
import { createErrorResponse, createSuccessResponse } from "./utils"
import {
	convertLocationObjectToString,
	extractDeliveryLocation,
} from "@/utils/package"
import axios from "axios"
import { startOfDay, endOfDay, isEqual, format } from "date-fns"
import { NextRequest } from "next/server"
import { z } from "zod"

const SHIPPO_API_KEY = "ShippoToken " + process.env.SHIPPO_KEY
const SHIPPO_TEST_API_KEY = "ShippoToken " + process.env.SHIPPO_TEST

async function fetchTrackingInfo(
	trackingNumber: string,
	courier: TCourier
): Promise<ShippoResponse> {
	const { data, status } = await axios.get(
		`https://api.goshippo.com/tracks/${courier}/${trackingNumber}`,
		{
			headers: {
				Authorization:
					courier === "shippo" ? SHIPPO_TEST_API_KEY : SHIPPO_API_KEY,
			},
		}
	)
	if (status !== 200) {
		switch (status) {
			case 400:
				throw new Error("Bad Request to Shippo API")
			case 401:
				throw new Error("Unauthorized request to Shippo API")
			case 403:
				throw new Error("Forbidden request to Shippo API")
			case 429:
				throw new Error("Rate limit exceeded for Shippo API")
			case 500:
				throw new Error("Shippo API internal server error")
			case 503:
				throw new Error("Shippo API service unavailable")
			default:
				throw new Error("API call failed")
		}
	}

	shippoResponseSchema.parse(data)

	return data as ShippoResponse
}

function isTCourier(courier: string): courier is TCourier {
	const couriers: TCourier[] = ["ups", "usps", "ontrac", "fedex", "shippo"]
	return couriers.includes(courier as TCourier)
}

function getEta(eta: string | null): string | null {
	if (!eta) {
		return null
	}
	console.log(eta)

	const etaDate = new Date(eta)

	if (isEqual(etaDate, startOfDay(etaDate))) {
		console.log("start of day")
		const endOfEtaDay = endOfDay(etaDate)
		return format(endOfEtaDay, "yyyy-MM-dd HH:mm:ss")
	} else {
		return eta
	}
}

function simplifyDetailMessage(message: string, status: TStatus): string {
	const lowercaseMessage = message.toLowerCase()

	if (status === "DELIVERED") {
		return "Delivered"
	}

	if (status === "TRANSIT") {
		if (lowercaseMessage.includes("departed")) {
			return "Departed"
		} else if (lowercaseMessage.includes("arrived")) {
			return "Arrived at facility"
		} else if (lowercaseMessage.includes("in transit")) {
			return "In transit"
		} else if (lowercaseMessage.includes("out for delivery")) {
			return "Out for delivery"
		}
	}

	if (status === "PRE_TRANSIT") {
		return "Shipment information received"
	}

	return message
}

function simplifyTrackingHistory(
	trackingHistory: ShippoTrackingHistory
): TrackingHistory {
	return {
		status: trackingHistory.status,
		detailedStatus: simplifyDetailMessage(
			trackingHistory.status_details,
			trackingHistory.status
		),
		location: convertLocationObjectToString(trackingHistory.location),
		date: trackingHistory.status_date,
		deliveryLocation: extractDeliveryLocation(
			trackingHistory.status_details
		),
	}
}

export async function GET(request: NextRequest) {
	console.log("GET /api/package")
	try {
		const url = new URL(request.url)
		const trackingNumber = url.searchParams.get("trackingNumber")
		const courier = url.searchParams.get("courier")

		if (!trackingNumber || !courier || !isTCourier(courier)) {
			return createErrorResponse(
				400,
				"Missing tracking number or courier in url parameters"
			)
		}

		const packageInfo = await fetchTrackingInfo(trackingNumber, courier)

		const packageInfoSimple: PackageInfo = {
			trackingNumber: packageInfo.tracking_number,
			courier: packageInfo.carrier,
			eta: getEta(packageInfo.eta),
			startLocation: convertLocationObjectToString(
				packageInfo.address_from
			),
			endLocation: convertLocationObjectToString(packageInfo.address_to),
			status: simplifyTrackingHistory(
				packageInfo.tracking_status as ShippoTrackingHistory
			),
			service: packageInfo.servicelevel.name,
			trackingHistory: packageInfo.tracking_history.map((history) =>
				simplifyTrackingHistory(history)
			),
		}

		// Validate the simplified package info
		PackageInfoSchema.parse(packageInfoSimple)

		return createSuccessResponse({
			packageInfo: packageInfoSimple,
		})
	} catch (error) {
		if (error instanceof z.ZodError) {
			return createErrorResponse(
				400,
				"Failed to validate shipment information"
			)
		} else if (error instanceof Error) {
			return createErrorResponse(500, error.message)
		}

		return createErrorResponse(500, "Something went wrong")
	}
}
