import { NextRequest, NextResponse } from "next/server"
import { courierSchema } from "./typesAndSchemas"
import {
	TCourier,
	TRawLocation,
	TShippoResponse,
	shippoResponseSchema,
	trackingDataSchema,
} from "../package/typesAndSchemas"
import axios from "axios"
import {
	formatRawLocation,
	simplifyRawTrackingData,
} from "@/utils/trackingDataTransform"
import { kv } from "@vercel/kv"

const SHIPPO_API_KEY = "ShippoToken " + process.env.SHIPPO_KEY
const SHIPPO_TEST_API_KEY = "ShippoToken " + process.env.SHIPPO_TEST

interface LatLng {
	lat: number
	lng: number
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getLatLng(location: TRawLocation): Promise<LatLng> {
	const locationString = formatRawLocation(location)

	if (locationString === "") {
		throw new Error("Location string is empty")
	}

	// 1. Check if the cache has a value for the given locationString
	const cachedLatLng = await kv.get<LatLng>(locationString)

	if (cachedLatLng) {
		return cachedLatLng
	}

	const { data } = await axios.get(
		`https://maps.googleapis.com/maps/api/geocode/json?address=${locationString}&key=${process.env.GOOGLE_MAPS_KEY}`
	)

	if (data.status !== "OK") {
		throw new Error("Error getting lat lng")
	}

	const latLng = data.results[0].geometry.location

	// If the Google API returns a valid result, store this result in the cache for future use
	await kv.set(locationString, { lat: latLng.lat, lng: latLng.lng })

	return { lat: latLng.lat, lng: latLng.lng }
}

type CachedTrackingData = {
	data: TShippoResponse
	timestamp: number
}

const CACHE_EXPIRY = 30 * 60 * 1000 // 30 minutes

async function getRawTrackingData(
	trackingNumber: string,
	courier: TCourier
): Promise<TShippoResponse> {
	const cacheKey = `${courier}-${trackingNumber}`

	const cachedData = await kv.get<CachedTrackingData>(cacheKey)

	if (cachedData) {
		const currentTime = new Date().getTime()
		const ageOfCache = currentTime - cachedData.timestamp

		if (ageOfCache <= CACHE_EXPIRY) {
			return cachedData.data
		}
	}

	// step 1: get the tracking info from shippo
	const headers = {
		Authorization:
			courier === "shippo" ? SHIPPO_TEST_API_KEY : SHIPPO_API_KEY,
	}

	const { data } = await axios.get(
		`https://api.goshippo.com/tracks/${courier}/${trackingNumber}`,
		{ headers }
	)

	// step 2: validate the response
	shippoResponseSchema.parse(data)

	await kv.set(cacheKey, {
		data: data as TShippoResponse,
		timestamp: new Date().getTime(),
	})

	return data as TShippoResponse
}

export async function GET(req: NextRequest) {
	try {
		const start = new Date().getTime()
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
		const trackingInfo = await getRawTrackingData(trackingNumber, courier)

		// transform the tracking info
		const simplifiedTrackingData =
			await simplifyRawTrackingData(trackingInfo)

		trackingDataSchema.parse(simplifiedTrackingData)
		const end = new Date().getTime()
		console.log("Time to get tracking info: " + (end - start) + "ms")

		return new NextResponse(
			JSON.stringify({
				trackingInfo: simplifiedTrackingData,
				success: true,
			}),
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
