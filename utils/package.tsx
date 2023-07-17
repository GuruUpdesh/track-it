import { TLocation, TStatus } from "@/app/api/package/typesAndSchemas"
import { format, formatDistance } from "date-fns"
import { AiOutlineWarning } from "react-icons/ai"
import { BsHouseDoor, BsMailbox, BsQuestion, BsTruck } from "react-icons/bs"
import { TbTruckLoading } from "react-icons/tb"

export function formatRelativeDate(date: string): string {
	const dateObject = new Date(date)
	const relative = formatDistance(dateObject, new Date(), { addSuffix: true })
	return relative
}

export function formatDate(date: string): string {
	const dateObject = new Date(date)
	return format(dateObject, "MMMM d, yyyy") // e.g., January 1, 2023
}

export function getTimeFromDate(date: string): string {
	const dateObject = new Date(date)
	return format(dateObject, "h:mm aa") // e.g., 2:30 PM
}

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
