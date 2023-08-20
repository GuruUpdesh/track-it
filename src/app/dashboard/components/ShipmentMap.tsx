import React, { useMemo } from "react"
import { useLoadScript, GoogleMap } from "@react-google-maps/api"
import { mapStyles } from "./MapsStyleArray"

const ShipmentMap = () => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [map, setMap] = React.useState<google.maps.Map | null>(null)

	function onLoad(map: google.maps.Map) {
		setMap(map)
	}

	const mapOptions = useMemo<google.maps.MapOptions>(
		() => ({
			disableDefaultUI: true,
			clickableIcons: true,
			scrollwheel: false,
			gestureHandling: "none",
			streetViewControl: false,
			keyboardShortcuts: false,
			minZoom: 2,
			maxZoom: 8,
			styles: mapStyles,
			zoom: 2,
			center: { lat: 0, lng: 0 },
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
				mixBlendMode: "lighten",
				filter: "grayscale(100%)",
				opacity: 0.5,
			}}
		/>
	)
}

export default ShipmentMap
