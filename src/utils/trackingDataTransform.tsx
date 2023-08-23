import {
	TTrackingData,
	TShippoResponse,
	TShippoTrackingHistory,
	TStatus,
	THistoryRow,
	TRawLocation,
} from "@/app/api/package/typesAndSchemas"
import {
	endOfDay,
	isEqual,
	startOfDay,
	format,
	differenceInCalendarDays,
	formatDistance,
} from "date-fns"
import {
	convertLocationObjectToString,
	estimateProgress,
	extractDeliveryLocation,
} from "./package"
import { getLatLng } from "@/app/api/track/route"

export function simplifyDetailMessage(
	message: string,
	status: TStatus
): string {
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

export function getEta(eta: string | null): string | null {
	if (!eta) {
		return null
	}

	const etaDate = new Date(eta)

	if (isEqual(etaDate, startOfDay(etaDate))) {
		const endOfEtaDay = endOfDay(etaDate)
		return format(endOfEtaDay, "yyyy-MM-dd HH:mm:ss")
	} else {
		return eta
	}
}

export function getSourceAndDestinationLocations(packageInfo: TShippoResponse) {
	let source = packageInfo.address_from
	const destination = packageInfo.address_to

	const trackingHistory = packageInfo.tracking_history
	if (trackingHistory.length === 0) {
		source = null
	} else {
		for (let i = 0; i < trackingHistory.length; i++) {
			const historyItem = trackingHistory[i]
			if (historyItem.location) {
				source = historyItem.location
				break
			}
		}
	}

	if (!source && !destination) {
		return null
	}

	const sourceString = convertLocationObjectToString(source)
	const destinationString = convertLocationObjectToString(destination)

	if (!source) {
		return `Coming to ${destinationString}`
	} else if (!destination) {
		return `Coming from ${sourceString}`
	} else {
		if (sourceString === destinationString) {
			return `Coming to ${destinationString}`
		}
		return `Coming from ${sourceString} to ${destinationString}`
	}
}

export function getTransitTime(packageInfo: TShippoResponse) {
	const trackingHistory = packageInfo.tracking_history
	if (trackingHistory.length < 1) {
		return null
	}
	const startDate = new Date(trackingHistory[0].status_date)
	let endDate = new Date()
	if (trackingHistory.length > 1) {
		endDate = new Date(
			trackingHistory[trackingHistory.length - 1].status_date
		)
	}

	if (Math.abs(differenceInCalendarDays(endDate, startDate)) < 1) {
		return null
	}

	const transitTime = formatDistance(startDate, endDate)

	const trackingStatus = packageInfo.tracking_status.status
	if (trackingStatus === "DELIVERED" || trackingStatus === "RETURNED") {
		return "Your package was in transit for " + transitTime
	}
	return "Your package has been in transit for " + transitTime
}

export async function simplifyRawTrackingData(
	data: TShippoResponse
): Promise<TTrackingData> {
	async function simplifyTrackingHistory(
		trackingHistory: TShippoTrackingHistory
	): Promise<THistoryRow> {
		const locationName = convertLocationObjectToString(
			trackingHistory.location
		)
		let lat: number | null = null
		let lng: number | null = null
		try {
			const latLng = await getLatLng(trackingHistory.location)
			lat = latLng.lat
			lng = latLng.lng
		} catch (error) {
			console.error(error)
		}
		return {
			status: trackingHistory.status,
			detailedStatus: trackingHistory.status_details,
			location: {
				name: locationName,
				lat,
				lng,
			},
			date: trackingHistory.status_date,
			deliveryLocation: extractDeliveryLocation(
				trackingHistory.status_details
			),
		}
	}

	const start = new Date().getTime()
	const simplifiedHistoryRows = await Promise.all(
		data.tracking_history.map(simplifyTrackingHistory)
	)

	const simplifiedTrackingHistory: TTrackingData = {
		trackingNumber: data.tracking_number,
		courier: data.carrier,
		eta: getEta(data.eta),
		progressPercentage: 0,
		sourceAndDestinationString: getSourceAndDestinationLocations(data),
		transitTime: getTransitTime(data),
		status: await simplifyTrackingHistory(
			data.tracking_status as TShippoTrackingHistory
		),
		service: data.servicelevel.name,
		trackingHistory: simplifiedHistoryRows,
	}

	simplifiedTrackingHistory.progressPercentage = estimateProgress(
		simplifiedTrackingHistory.eta,
		simplifiedTrackingHistory.status.status,
		simplifiedTrackingHistory.trackingHistory[0].date
	)

	const end = new Date().getTime()
	console.log(`Google API: ${end - start}ms`)

	return simplifiedTrackingHistory
}

export function formatRawLocation(location: TRawLocation): string {
	if (!location) {
		return ""
	}

	const { city, state, zip, country } = location
	const parts = []

	if (city) {
		parts.push(city)
	}

	if (state) {
		parts.push(state)
	}

	if (zip) {
		parts.push(zip)
	}

	if (country) {
		parts.push(country)
	}

	return parts.join(", ")
}
