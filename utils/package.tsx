import { formatDate } from "./date"
import { TLocation, TStatus } from "@/app/api/package/typesAndSchemas"
import { differenceInDays } from "date-fns"
import { AiOutlineWarning } from "react-icons/ai"
import { BsHouseDoor, BsMailbox, BsQuestion, BsTruck } from "react-icons/bs"
import { TbTruckLoading } from "react-icons/tb"

export function convertLocationObjectToString(
	location: TLocation | null
): string {
	if (!location) return "Location not found"

	let locationString = ""
	if (location.city) locationString += location.city
	if (location.state) {
		if (!location.city) locationString += location.state
		else locationString += `, ${location.state}`
	}
	if (location.country && !location.state) {
		if (!location.city) locationString += location.country
		else locationString += `, ${location.country}`
	}

	return locationString
}

export function extractDeliveryLocation(statusUpdate: string): string | null {
	const deliveredRegex = /delivered/i
	const frontDoorRegex = /(front door|doorstep|entrance|gate)/i
	const mailboxRegex = /mailbox/i

	if (deliveredRegex.test(statusUpdate)) {
		if (frontDoorRegex.test(statusUpdate)) {
			return "home"
		} else if (mailboxRegex.test(statusUpdate)) {
			return "mailbox"
		}
	}

	return null
}

export function getIconForStatus(
	status: TStatus,
	deliveryLocation?: string | null
): JSX.Element {
	switch (status) {
		case "PRE_TRANSIT":
			return <TbTruckLoading />
		case "TRANSIT":
			return <BsTruck />
		case "DELIVERED":
			if (deliveryLocation === "mailbox") return <BsMailbox />
			return <BsHouseDoor />
		case "RETURNED":
			return <BsTruck style={{ transform: "scaleX(-1)" }} />
		case "FAILURE":
			return <AiOutlineWarning />
		case "UNKNOWN":
			return <BsQuestion />
		default:
			return <></>
	}
}

export const estimateProgress = (
	currentEta: string | null,
	status: TStatus,
	firstUpdate: string,
	lastUpdate: string
): number => {
	const eta = currentEta ? new Date(currentEta) : null
	const firstUpdateDate = new Date(firstUpdate)
	const lastUpdateDate = new Date(lastUpdate)

	// todo support more robust progress estimation
	if (
		status === "PRE_TRANSIT" ||
		status === "UNKNOWN" ||
		status === "RETURNED" ||
		status === "FAILURE"
	) {
		console.log("estimateProgress", 0)
		return 0
	} else if (status === "TRANSIT") {
		if (!eta) return 0
		const totalTransitTime = differenceInDays(new Date(), firstUpdateDate)
		const expectedTransitTime = differenceInDays(eta, firstUpdateDate)
		const progress = Math.round(
			(totalTransitTime / expectedTransitTime) * 100
		)
		console.log(
			"estimateProgress",
			progress,
			"totalTransitTime",
			totalTransitTime,
			"expectedTransitTime",
			expectedTransitTime,
			formatDate(currentEta || ""),
			formatDate(firstUpdate),
			formatDate(lastUpdate)
		)
		return progress
	} else if (status === "DELIVERED") {
		console.log("estimateProgress", 100)
		return 100
	}
	return 0
}
