import { TCourier } from "@/app/api/package/typesAndSchemas"
import { FaFedex, FaUps } from "react-icons/fa"
import { MdOutlineExplore } from "react-icons/md"
import { SiUsps } from "react-icons/si"

interface Couriers {
	[key: string]: {
		patterns: RegExp[]
		tracking_url: string
		icon: JSX.Element
		name: string
	}
}

export const courierCodes: TCourier[] = [
	"ups",
	"usps",
	"ontrac",
	"fedex",
	"shippo",
]

export const couriers: Couriers = {
	ups: {
		patterns: [
			new RegExp(
				/\b(1Z ?[0-9A-Z]{3} ?[0-9A-Z]{3} ?[0-9A-Z]{2} ?[0-9A-Z]{4} ?[0-9A-Z]{3} ?[0-9A-Z]|T\d{3} ?\d{4} ?\d{3})\b/i
			),
		],
		tracking_url: "https://www.ups.com/mobile/track?trackingNumber=",
		icon: <FaUps />,
		name: "UPS",
	},
	usps: {
		patterns: [
			new RegExp(
				/\b((420 ?\d{5} ?)?(91|92|93|94|95|01|03|04|70|23|13)\d{2} ?\d{4} ?\d{4} ?\d{4} ?\d{4}( ?\d{2,6})?)\b/i
			),
			new RegExp(
				/\b((M|P[A-Z]?|D[C-Z]|LK|E[A-C]|V[A-Z]|R[A-Z]|CP|CJ|LC|LJ) ?\d{3} ?\d{3} ?\d{3} ?[A-Z]?[A-Z]?)\b/i
			),
			new RegExp(/\b(82 ?\d{3} ?\d{3} ?\d{2})\b/i),
		],
		tracking_url:
			"https://tools.usps.com/go/TrackConfirmAction?qtc_tLabels1=",
		icon: <SiUsps />,
		name: "USPS",
	},
	ontrac: {
		patterns: [new RegExp(/\b(C\d{14})\b/i)],
		tracking_url: "http://www.ontrac.com/trackres.asp?tracking_number=",
		icon: <MdOutlineExplore />,
		name: "OnTrac",
	},
	fedex: {
		patterns: [
			new RegExp(
				/\b(((96\d\d|6\d)\d{3} ?\d{4}|96\d{2}|\d{4}) ?\d{4} ?\d{4}( ?\d{3}|\d{15})?)\b/i
			),
		],
		tracking_url: "https://www.fedex.com/fedextrack/?tracknumbers=",
		icon: <FaFedex />,
		name: "FedEx",
	},
}

export function getCourierStringFromCode(code: string) {
	const courier = couriers[code]
	if (!courier) {
		if (code === "shippo") return "test"
		console.error("Invalid Courier Code", code)
		return "Invalid Courier"
	}
	return courier.name
}

export function getCourierIconFromCode(code: string) {
	const courier = couriers[code]
	if (!courier) return <MdOutlineExplore />
	const icon = courier.icon
	if (!icon) {
		if (code !== "shippo") console.error("Invalid Courier Code", code)
		return <MdOutlineExplore />
	}
	return icon
}

export function getCouriersFromTrackingNumber(
	trackingNumber: string
): TCourier[] {
	const matchingCouriers: TCourier[] = []
	for (const courier in couriers) {
		const patterns = couriers[courier].patterns
		for (const pattern of patterns) {
			if (pattern.test(trackingNumber)) {
				matchingCouriers.push(courier as TCourier)
			}
		}
	}
	return matchingCouriers
}

export function getCourierUrlsFromTrackingNumber(trackingNumber: string) {
	const couriersSubset = getCouriersFromTrackingNumber(trackingNumber)
	const urls: string[] = []
	for (const courier of couriersSubset) {
		urls.push(couriers[courier].tracking_url + trackingNumber)
	}

	return urls
}
