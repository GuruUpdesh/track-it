import { NextRequest, NextResponse } from "next/server"
import { courierSchema } from "./typesAndSchemas"
import {
	TCourier,
	TShippoResponse,
	shippoResponseSchema,
	TShippoTrackingHistory,
	TTrackingHistory,
	TPackageInfo,
	PackageInfoSchema,
} from "../package/typesAndSchemas"
import axios from "axios"
import {
	getEta,
	getSourceAndDestinationLocations,
	getTransitTime,
} from "@/utils/dataTransform"
import {
	convertLocationObjectToString,
	estimateProgress,
	extractDeliveryLocation,
} from "@/utils/package"

const SHIPPO_API_KEY = "ShippoToken " + process.env.SHIPPO_KEY
const SHIPPO_TEST_API_KEY = "ShippoToken " + process.env.SHIPPO_TEST

async function getTrackingData(
	trackingNumber: string,
	courier: TCourier
): Promise<TShippoResponse> {
	const { data } = await axios.get(
		`https://api.goshippo.com/tracks/${courier}/${trackingNumber}`,
		{
			headers: {
				Authorization:
					courier === "shippo" ? SHIPPO_TEST_API_KEY : SHIPPO_API_KEY,
			},
		}
	)

	shippoResponseSchema.parse(data)

	return data as TShippoResponse
}

function simplifyTrackingHistory(
	trackingHistory: TShippoTrackingHistory
): TTrackingHistory {
	return {
		status: trackingHistory.status,
		detailedStatus: trackingHistory.status_details,
		location: convertLocationObjectToString(trackingHistory.location),
		date: trackingHistory.status_date,
		deliveryLocation: extractDeliveryLocation(
			trackingHistory.status_details
		),
	}
}

export async function GET(req: NextRequest) {
	try {
		// parse the request url
		const url = new URL(req.url)
		const trackingNumber = url.searchParams.get("trackingNumber")
		const rawCourier = url.searchParams.get("courier")

		if (!trackingNumber || !rawCourier) {
			throw new Error(
				"Missing tracking number or courier in url parameters"
			)
		}

		const courier = courierSchema.parse(rawCourier)

		// get the tracking info
		const trackingInfo = await getTrackingData(trackingNumber, courier)

		// transform the tracking info
		const trackingInfoSimple: TPackageInfo = {
			trackingNumber: trackingInfo.tracking_number,
			courier: trackingInfo.carrier,
			eta: getEta(trackingInfo.eta),
			progressPercentage: 0,
			sourceAndDestinationString:
				getSourceAndDestinationLocations(trackingInfo),
			transitTime: getTransitTime(trackingInfo),
			status: simplifyTrackingHistory(
				trackingInfo.tracking_status as TShippoTrackingHistory
			),
			service: trackingInfo.servicelevel.name,
			trackingHistory: trackingInfo.tracking_history.map((history) =>
				simplifyTrackingHistory(history)
			),
		}
		trackingInfoSimple.progressPercentage = estimateProgress(
			trackingInfoSimple.eta,
			trackingInfoSimple.status.status,
			trackingInfoSimple.trackingHistory[0].date
		)

		PackageInfoSchema.parse(trackingInfoSimple)

		return new NextResponse(
			JSON.stringify({ trackingInfo: trackingInfoSimple, success: true }),
			{ status: 200 }
		)
	} catch (error) {
		console.error("Request error", error)
		return new NextResponse(
			JSON.stringify({
				error: "Error getting tracking info",
				success: false,
			}),
			{ status: 500 }
		)
	}
}
