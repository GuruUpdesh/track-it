import {
	getEta,
	getSourceAndDestinationLocations,
	getTransitTime,
	simplifyDetailMessage,
} from "@/utils/dataTransform"
import {
	PackageInfo,
	PackageInfoSchema,
	ShippoResponse,
	ShippoTrackingHistory,
	TCourier,
	TrackingHistory,
	shippoResponseSchema,
} from "./typesAndSchemas"
import { createErrorResponse, createSuccessResponse } from "./utils"
import {
	convertLocationObjectToString,
	extractDeliveryLocation,
} from "@/utils/package"
import axios from "axios"
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
			sourceAndDestinationString:
				getSourceAndDestinationLocations(packageInfo),
			transitTime: getTransitTime(packageInfo),
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
