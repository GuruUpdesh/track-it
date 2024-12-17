import { TCourier } from "@/app/api/package/typesAndSchemas"
import { FaFedex, FaUps } from "react-icons/fa"
import { MdOutlineExplore } from "react-icons/md"
import { SiUsps } from "react-icons/si"

import type { JSX } from "react";

const UPS_REGEX_PATTERN =
	/\b(1Z ?[0-9A-Z]{3} ?[0-9A-Z]{3} ?[0-9A-Z]{2} ?[0-9A-Z]{4} ?[0-9A-Z]{3} ?[0-9A-Z]|T\d{3} ?\d{4} ?\d{3})\b/i

const USPS_REGEX_PATTERN_1 =
	/\b((420 ?\d{5} ?)?(91|92|93|94|95|01|03|04|70|23|13)\d{2} ?\d{4} ?\d{4} ?\d{4} ?\d{4}( ?\d{2,6})?)\b/i
const USPS_REGEX_PATTERN_2 =
	/\b((M|P[A-Z]?|D[C-Z]|LK|E[A-C]|V[A-Z]|R[A-Z]|CP|CJ|LC|LJ) ?\d{3} ?\d{3} ?\d{3} ?[A-Z]?[A-Z]?)\b/i
const USPS_REGEX_PATTERN_3 = /\b(82 ?\d{3} ?\d{3} ?\d{2})\b/i

const ONTRAC_REGEX_PATTERN = /\b(C\d{14})\b/i

const FEDEX_REGEX_PATTERN =
	/\b(((96\d\d|6\d)\d{3} ?\d{4}|96\d{2}|\d{4}) ?\d{4} ?\d{4}( ?\d{3}|\d{15})?)\b/i

interface CourierConfig {
	name: string
	code: TCourier
	icon: JSX.Element
	tracking_url: string
	patterns: RegExp[]
}

interface CourierConfigs {
	[key: string]: CourierConfig
}

export const courierCodes: TCourier[] = [
	"ups",
	"usps",
	"ontrac",
	"fedex",
	"shippo",
]

const courierConfig: CourierConfigs = {
	ups: {
		name: "UPS",
		code: "ups",
		icon: <FaUps />,
		tracking_url: "https://www.ups.com/mobile/track?trackingNumber=",
		patterns: [new RegExp(UPS_REGEX_PATTERN)],
	},
	usps: {
		name: "USPS",
		code: "usps",
		icon: <SiUsps />,
		tracking_url:
			"https://tools.usps.com/go/TrackConfirmAction?qtc_tLabels1=",
		patterns: [
			new RegExp(USPS_REGEX_PATTERN_1),
			new RegExp(USPS_REGEX_PATTERN_2),
			new RegExp(USPS_REGEX_PATTERN_3),
		],
	},
	ontrac: {
		name: "OnTrac",
		code: "ontrac",
		icon: <MdOutlineExplore />,
		tracking_url: "http://www.ontrac.com/trackres.asp?tracking_number=",
		patterns: [new RegExp(ONTRAC_REGEX_PATTERN)],
	},
	fedex: {
		name: "FedEx",
		code: "fedex",
		icon: <FaFedex />,
		tracking_url: "https://www.fedex.com/fedextrack/?tracknumbers=",
		patterns: [new RegExp(FEDEX_REGEX_PATTERN)],
	},
	shippo: {
		name: "Shippo",
		code: "shippo",
		icon: <MdOutlineExplore />,
		tracking_url: "https://goshippo.com/tracking/",
		patterns: [],
	},
}

export const couriers = Object.keys(courierConfig).map((courier) =>
	getCourier(courier as TCourier)
)

export function getCourier(courierCode: TCourier) {
	return courierConfig[courierCode]
}

export function getCourierFromTrackingNumber(trackingNumber: string) {
	const matchingCouriers: TCourier[] = []
	for (const courier in courierConfig) {
		for (const pattern of courierConfig[courier].patterns) {
			if (pattern.test(trackingNumber)) {
				matchingCouriers.push(courier as TCourier)
			}
		}
	}

	if (matchingCouriers.length === 1) {
		return getCourier(matchingCouriers[0])
	} else if (matchingCouriers.length > 1) {
		console.warn(
			"Multiple couriers found for tracking number, returning first"
		)
		return getCourier(matchingCouriers[0])
	}

	return null
}
