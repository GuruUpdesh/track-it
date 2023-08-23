import React, { useMemo } from "react"
import { useLoadScript, GoogleMap, OverlayView } from "@react-google-maps/api"
import { mapStyles } from "./MapsStyleArray"
import { TLocation, TTrackingData } from "@/app/api/package/typesAndSchemas"

type Props = {
	trackingInfo: TTrackingData
}

function defineMapBounds(trackingInfo: TTrackingData) {
	const bounds = new google.maps.LatLngBounds()

	for (let i = trackingInfo.trackingHistory.length - 1; i >= 0; i--) {
		const historyRow = trackingInfo.trackingHistory[i]
		if (historyRow.location.lat && historyRow.location.lng) {
			bounds.extend(
				new google.maps.LatLng(
					historyRow.location.lat,
					historyRow.location.lng
				)
			)
		}
	}

	return bounds
}

const ShipmentMap = ({ trackingInfo }: Props) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [map, setMap] = React.useState<google.maps.Map | null>(null)

	function onLoad(map: google.maps.Map) {
		const bounds = defineMapBounds(trackingInfo)
		map.fitBounds(bounds)
		setMap(map)
	}

	const mapOptions = useMemo<google.maps.MapOptions>(
		() => ({
			disableDefaultUI: true,
			clickableIcons: true,
			// scrollwheel: false,
			// gestureHandling: "none",
			streetViewControl: false,
			keyboardShortcuts: false,
			// minZoom: 2,
			maxZoom: 8,
			styles: mapStyles,
			zoom: 2,
		}),
		[]
	)

	const { isLoaded } = useLoadScript({
		googleMapsApiKey: process.env.GOOGLE_MAPS_KEY as string,
	})

	if (!isLoaded) {
		return <p>Loading...</p>
	}

	return (
		<GoogleMap
			options={mapOptions}
			onLoad={onLoad}
			mapContainerStyle={{
				width: "100%",
				height: "120%",
				// mixBlendMode: "lighten",
				// filter: "grayscale(100%)",
				opacity: 1,
			}}
		>
			{trackingInfo.trackingHistory
				.map((historyRow, index) => ({
					location: historyRow.location,
					index,
				}))
				.map((locationObj) => {
					const location = locationObj.location as TLocation
					if (location.lat && location.lng) {
						return (
							<OverlayView
								key={`${location.lat}-${location.lng}`}
								position={
									new google.maps.LatLng(
										location.lat,
										location.lng
									)
								}
								mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
							>
								<div className="h-[7px] w-[7px] rounded-full border border-blue-200 bg-blue-500">
									{locationObj.index === 0 && (
										<div className="h-[15px] w-[15px] animate-ping rounded-full border border-blue-500 bg-blue-500"></div>
									)}
								</div>
							</OverlayView>
						)
					}
					return null
				})}
		</GoogleMap>
	)
}

export default ShipmentMap
