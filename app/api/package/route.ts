import { NextRequest, NextResponse } from "next/server"
import axios from "axios"

const SHIPPO_API_KEY = "ShippoToken " + process.env.SHIPPO_KEY

async function fetchTrackingInfo(trackingNumber: string, courier: string) {
	const { data, status } = await axios.get(
		`https://api.goshippo.com/tracks/${courier}/${trackingNumber}`,
		{
			headers: {
				Authorization: SHIPPO_API_KEY,
			},
		}
	)
	if (status !== 200) {
		throw new Error("API call failed")
	}

	return data
}

export async function GET(request: NextRequest) {
	const url = new URL(request.url)
	const trackingNumber = url.searchParams.get("trackingNumber")
	const courier = url.searchParams.get("courier")

	if (!trackingNumber || !courier) {
		return new NextResponse(
			JSON.stringify({
				error: "Missing tracking number or courier in url parameters",
			}),
			{
				status: 400,
			}
		)
	}

	const packageAPIInfo = await fetchTrackingInfo(trackingNumber, courier)

	return new Response(JSON.stringify(packageAPIInfo), { status: 200 })
}
