export async function getTrackingInfo(trackingNumber: string, courier: string) {
	const response = await fetch(
		"/api/track?trackingNumber=" + trackingNumber + "&courier=" + courier,
		{
			method: "GET",
		}
	)

	const data = await response.json()

	if (!data.success) {
		return null
	}

	return data.trackingInfo
}
