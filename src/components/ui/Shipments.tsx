"use client"

import { TShipmentRecord } from "@/app/api/shipment/typesAndSchemas"
import React from "react"
import Shipment from "../shipment/Shipment"
import { ShipmentsState, useShipments } from "@/lib/slices/createShipmentsSlice"

type Props = {
	loadedShipments: TShipmentRecord[]
}

const Shipments = ({ loadedShipments }: Props) => {
	const [shipments, updateShipments] = useShipments(
		(state: ShipmentsState) => [state.shipments, state.updateShipments]
	)

	React.useEffect(() => {
		updateShipments(loadedShipments)
	}, [loadedShipments])

	return (
		<div className="mt-6 grid grid-cols-4 gap-6">
			{shipments.map((shipment: TShipmentRecord) => (
				<Shipment key={shipment.id} shipmentRecord={shipment} />
			))}
		</div>
	)
}

export default Shipments
