import { FaDhl, FaUps, FaFedex } from "react-icons/fa"
import { MdOutlineExplore } from "react-icons/md"
import { SiUsps } from "react-icons/si"

export const couriers = {
	ups: {
		patterns: [
			new RegExp(
				/\b(1Z ?[0-9A-Z]{3} ?[0-9A-Z]{3} ?[0-9A-Z]{2} ?[0-9A-Z]{4} ?[0-9A-Z]{3} ?[0-9A-Z]|T\d{3} ?\d{4} ?\d{3})\b/i
			),
		],
		tracking_url: "https://www.ups.com/mobile/track?trackingNumber=",
		icon: <FaUps />,
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
	},
	ontrac: {
		patterns: [new RegExp(/\b(C\d{14})\b/i)],
		tracking_url: "http://www.ontrac.com/trackres.asp?tracking_number=",
		icon: <MdOutlineExplore />,
	},
	dhl: {
		patterns: [
			new RegExp(
				/\b(\d{4}[- ]?\d{4}[- ]?\d{2}|\d{3}[- ]?\d{8}|[A-Z]{3}\d{7})\b/i
			),
		],
		tracking_url:
			"http://www.dhl.com/content/g0/en/express/tracking.shtml?brand=DHL&AWB=",
		icon: <FaDhl />,
	},
	fedex: {
		patterns: [
			new RegExp(
				/\b(((96\d\d|6\d)\d{3} ?\d{4}|96\d{2}|\d{4}) ?\d{4} ?\d{4}( ?\d{3}|\d{15})?)\b/i
			),
		],
		tracking_url: "https://www.fedex.com/fedextrack/?tracknumbers=",
		icon: <FaFedex />,
	},
}

export function getCourierStringFromCode(code: string) {
	switch (code) {
		case "ups":
			return "UPS"
		case "usps":
			return "USPS"
		case "ontrac":
			return "OnTrac"
		case "dhl":
			return "DHL"
		case "fedex":
			return "FedEx"
		default:
			console.error("Invalid Courier Code", code)
			return "Invalid Courier"
	}
}

export function getCourierIconFromCode(code: string) {
	switch (code) {
		case "ups":
			return couriers.ups.icon
		case "usps":
			return couriers.usps.icon
		case "ontrac":
			return couriers.ontrac.icon
		case "dhl":
			return couriers.dhl.icon
		case "fedex":
			return couriers.fedex.icon
		default:
			console.error("Invalid Courier Code", code)
			return <MdOutlineExplore />
	}
}

function getCouriersFromTrackingNumber() {}

function getCourierUrlsFromTrackingNumber() {}
