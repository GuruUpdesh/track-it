import { format, formatDistance, isSameYear } from "date-fns"

export function formatRelativeDate(date: string): string {
	const dateObject = new Date(date)
	const relative = formatDistance(dateObject, new Date(), { addSuffix: true })
	return relative
}

export function formatDate(date: string): string {
	const dateObject = new Date(date)
	// if this year
	if (isSameYear(dateObject, new Date())) {
		return format(dateObject, "MMM d") // e.g., January 1
	}
	return format(dateObject, "MMM d, yyyy") // e.g., January 1, 2023
}

export function getTimeFromDate(date: string): string {
	const dateObject = new Date(date)
	return format(dateObject, "h:mmaaa") // e.g., 2:30 PM
}
