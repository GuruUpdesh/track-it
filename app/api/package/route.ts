import {
	convertLocationObjectToString,
	extractDeliveryLocation,
	formatDate,
	formatRelativeDate,
	getTimeFromDate,
} from "@/utils/package"
import axios from "axios"
import { NextRequest, NextResponse } from "next/server"

export type TLocation = {
	city: string
	state: string
	zip: string
	country: string
}

export type TCourier = "ups" | "usps" | "ontrac" | "fedex" | "shippo"

// ref https://docs.goshippo.com/docs/tracking/tracking/
export type TStatus =
	| "PRE_TRANSIT"
	| "TRANSIT"
	| "DELIVERED"
	| "RETURNED"
	| "FAILURE"
	| "UNKNOWN"

interface ShippoResponse {
	carrier: TCourier
	tracking_number: string
	address_from: TLocation | null
	address_to: TLocation | null
	transaction: string | null
	original_eta: string | null
	eta: string | null
	servicelevel: {
		token: string | null
		name: string | null
	}
	metadata: string | null
	tracking_status: {
		status_date: string
		status_details: string
		location: TLocation | null
		substatus: {
			code: string | null
			text: string | null
			action_required: boolean | null
		}
		object_created: string
		object_updated: string | null
		object_id: string
		status: TStatus
	}
	tracking_history: ShippoTrackingHistory[]
}

interface ShippoTrackingHistory {
	object_created: string
	object_updated?: string // This field seems to be optional in tracking_history.
	object_id: string
	status: TStatus
	status_details: string
	status_date: string
	location: TLocation
}

export interface PackageInfo {
	trackingNumber: string
	courier: TCourier
	status: TrackingHistory
	eta: string | null
	trackingHistory: TrackingHistory[]
}

export interface TrackingHistory {
	status: TStatus
	detailedStatus: string
	location: string
	date: {
		relative: string
		absolute: string
		time: string
	}
	deliveryLocation: string | null
}

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
		throw new Error("API call failed")
	}

	// verify that the response is what we expect
	const responseKeys = Object.keys(data)
	const expectedKeys = [
		"carrier",
		"tracking_number",
		"address_from",
		"address_to",
		"transaction",
		"original_eta",
		"eta",
		"servicelevel",
		"metadata",
		"tracking_status",
		"tracking_history",
	]
	const missingKeys = expectedKeys.filter(
		(key) => !responseKeys.includes(key)
	)
	if (missingKeys.length > 0) {
		throw new Error(`Response is missing keys: ${missingKeys.join(", ")}`)
	}

	return data as ShippoResponse
}

function isTCourier(courier: string): courier is TCourier {
	const couriers: TCourier[] = ["ups", "usps", "ontrac", "fedex", "shippo"]
	return couriers.includes(courier as TCourier)
}

function simplifyStatusObject(
	trackingHistory: ShippoTrackingHistory
): TrackingHistory {
	return {
		status: trackingHistory.status,
		detailedStatus: trackingHistory.status_details,
		location: convertLocationObjectToString(trackingHistory.location),
		date: {
			relative: formatRelativeDate(trackingHistory.status_date),
			absolute: formatDate(trackingHistory.status_date),
			time: getTimeFromDate(trackingHistory.status_date),
		},
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
			return new NextResponse(
				JSON.stringify({
					error: "Missing tracking number or courier in url parameters",
				}),
				{
					status: 400,
				}
			)
		}

		const packageInfo = await fetchTrackingInfo(trackingNumber, courier)

		let packageInfoSimple: PackageInfo

		// convert into simpler format
		try {
			packageInfoSimple = {
				trackingNumber: packageInfo.tracking_number,
				courier: packageInfo.carrier,
				eta: packageInfo.eta,
				status: simplifyStatusObject(
					packageInfo.tracking_status as ShippoTrackingHistory
				),
				trackingHistory: packageInfo.tracking_history.map((history) =>
					simplifyStatusObject(history)
				),
			}
		} catch (error) {
			return new NextResponse(
				JSON.stringify({
					error: "Invalid Tracking Info",
				}),
				{
					status: 400,
				}
			)
		}

		return new Response(
			JSON.stringify(
				{
					packageInfo: packageInfoSimple,
				},
				null,
				2
			),
			{
				status: 200,
			}
		)
	} catch (error) {
		return new NextResponse(
			JSON.stringify({
				error: "Something went wrong",
			}),
			{
				status: 500,
			}
		)
	}
}
