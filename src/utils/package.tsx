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
	firstUpdate: string
): number => {
	const eta = currentEta ? new Date(currentEta) : null
	const firstUpdateDate = new Date(firstUpdate)

	// todo support more robust progress estimation
	if (
		status === "PRE_TRANSIT" ||
		status === "UNKNOWN" ||
		status === "RETURNED" ||
		status === "FAILURE"
	) {
		return 0
	} else if (status === "TRANSIT") {
		if (!eta) return 0
		const totalTransitTime = differenceInDays(new Date(), firstUpdateDate)
		const expectedTransitTime = differenceInDays(eta, firstUpdateDate)
		const progress = Math.round(
			(totalTransitTime / expectedTransitTime) * 100
		)
		return progress
	} else if (status === "DELIVERED") {
		return 100
	}
	return 0
}

export function getCopyString(str: string): string {
	const parts = str.split(" ")
	const lastPart = parts[parts.length - 1]

	if (!isNaN(parseInt(lastPart))) {
		parts[parts.length - 1] = (parseInt(lastPart) + 1).toString()
	} else if (lastPart === "copy") {
		parts.push("2")
	} else {
		parts.push("copy")
	}

	return parts.join(" ")
}

export function getColorFromStatus(status?: TStatus, error = false): string {
	if (error) {
		return "red"
	}

	switch (status) {
		case "PRE_TRANSIT":
			return "yellow"
		case "TRANSIT":
			return "lime"
		case "DELIVERED":
			return "emerald"
		case "RETURNED":
			return "emerald"
		case "FAILURE":
			return "red"
		case "UNKNOWN":
			return "indigo"
		default:
			return "indigo"
	}
}

export const cardStatusColorConfig = {
	red: {
		bg: "bg-red-400/25",
	},
	yellow: {
		bg: "bg-yellow-400/25",
	},
	lime: {
		bg: "bg-lime-400/25",
	},
	emerald: {
		bg: "bg-emerald-400/25",
	},
	indigo: {
		bg: "bg-indigo-400/25",
	},
}
