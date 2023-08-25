import { NextRequest, NextResponse } from "next/server"
import { courierSchema } from "./typesAndSchemas"
import {
	TCourier,
	TRawLocation,
	TShippoResponse,
	TTrackingData,
	shippoResponseSchema,
	trackingDataSchema,
} from "../package/typesAndSchemas"
import axios from "axios"
import {
	formatRawLocation,
	simplifyRawTrackingData,
} from "@/utils/trackingDataTransform"
import { kv } from "@vercel/kv"
import { z } from "zod"

const SHIPPO_API_KEY = "ShippoToken " + process.env.SHIPPO_KEY
const SHIPPO_TEST_API_KEY = "ShippoToken " + process.env.SHIPPO_TEST

interface LatLng {
	lat: number
	lng: number
}

export async function getLatLng(location: TRawLocation): Promise<LatLng> {
	const locationString = formatRawLocation(location)

	if (locationString === "") {
		throw new Error("Location string is empty")
	}

	const { data } = await axios.get(
		`https://maps.googleapis.com/maps/api/geocode/json?address=${locationString}&key=${process.env.GOOGLE_MAPS_KEY}`
	)

	if (data.status !== "OK") {
		throw new Error("Error getting lat lng")
	}

	const rawLatLng = data.results[0].geometry.location

	const latLng = z
		.object({
			lat: z.number(),
			lng: z.number(),
		})
		.parse(rawLatLng)

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

	return data as TShippoResponse
}

export async function GET(req: NextRequest) {
	console.log("Request received")
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

		let trackingData: TTrackingData | null = null

		// get the cached data
		const cacheKey = `${courier}-${trackingNumber}`
		const cachedData = await kv.get<CachedTrackingData>(cacheKey)
		if (cachedData) {
			// check if the cache is expired
			const currentTime = new Date().getTime()
			const ageOfCache = currentTime - cachedData.timestamp

			if (ageOfCache <= CACHE_EXPIRY) {
				trackingData = trackingDataSchema.parse(cachedData.data)
			}
		} else {
			// get the tracking info
			const trackingInfo = await getRawTrackingData(
				trackingNumber,
				courier
			)

			// transform the tracking info
			const simplifiedTrackingData =
				await simplifyRawTrackingData(trackingInfo)

			trackingData = trackingDataSchema.parse(simplifiedTrackingData)

			await kv.set(cacheKey, {
				data: trackingData,
				timestamp: new Date().getTime(),
			})
		}

		if (!trackingData) {
			throw new Error("Error getting tracking info")
		}

		return new NextResponse(
			JSON.stringify({
				trackingInfo: trackingData,
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
