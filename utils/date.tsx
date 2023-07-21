import { format, formatDistance } from "date-fns"

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
