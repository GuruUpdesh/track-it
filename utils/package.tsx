import { TLocation, TStatus } from "@/app/api/package/route"
import { format, formatDistance } from "date-fns"

export function formatRelativeDate(date: string): string {
	const dateObject = new Date(date)
	return formatDistance(dateObject, new Date(), { addSuffix: true })
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
	return `${location.city}, ${location.state}`
}

export function extractDeliveryLocation(statusUpdate: string): string | null {
	const deliveredRegex = /delivered/i
	const frontDoorRegex = /front door/i
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

import { BsHouseDoor, BsMailbox, BsTruck, BsQuestion } from "react-icons/bs"
import { TbTruckLoading } from "react-icons/tb"
import { AiOutlineWarning } from "react-icons/ai"
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
