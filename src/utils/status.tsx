import { AiOutlineWarning } from "react-icons/ai"
import { BsHouseDoor, BsQuestion, BsTruck } from "react-icons/bs"
import { TbTruckLoading } from "react-icons/tb"

type TStatusCode =
	| "PRE_TRANSIT"
	| "TRANSIT"
	| "DELIVERED"
	| "RETURNED"
	| "FAILURE"
	| "UNKNOWN"

interface StatusConfig {
	name:
		| "Pre Transit"
		| "Transit"
		| "Delivered"
		| "Returned"
		| "Failure"
		| "Unknown"
	code: TStatusCode
	icon: JSX.Element
	color: "red" | "yellow" | "lime" | "emerald" | "indigo"
}

interface StatusConfigs {
	[key: string]: StatusConfig
}

export const statusCodes = [
	"PRE_TRANSIT",
	"TRANSIT",
	"DELIVERED",
	"RETURNED",
	"FAILURE",
	"UNKNOWN",
]

const statusConfig: StatusConfigs = {
	pre_transit: {
		name: "Pre Transit",
		code: "PRE_TRANSIT",
		icon: <TbTruckLoading />,
		color: "yellow",
	},
	transit: {
		name: "Transit",
		code: "TRANSIT",
		icon: <BsTruck />,
		color: "lime",
	},
	delivered: {
		name: "Delivered",
		code: "DELIVERED",
		icon: <BsHouseDoor />,
		color: "emerald",
	},
	returned: {
		name: "Returned",
		code: "RETURNED",
		icon: <BsTruck style={{ transform: "scaleX(-1)" }} />,
		color: "emerald",
	},
	failure: {
		name: "Failure",
		code: "FAILURE",
		icon: <AiOutlineWarning />,
		color: "red",
	},
	unknown: {
		name: "Unknown",
		code: "UNKNOWN",
		icon: <BsQuestion />,
		color: "indigo",
	},
}

export const statuses = Object.keys(statusConfig).map((status) =>
	getStatus(status as TStatusCode)
)

export function getStatus(statusCode: TStatusCode) {
	return statusConfig[statusCode.toLowerCase()]
}
