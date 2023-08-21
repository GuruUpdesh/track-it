"use client"

import { TShipmentRecord } from "@/app/api/shipment/typesAndSchemas"
import React from "react"
import Shipment from "./shipment/Shipment"
import { ShipmentsState, useShipments } from "@/lib/shipmentsStore"
import { getShipments } from "@/app/api/shipment/shipmentAPI"
import ShipmentSkeleton from "./shipment/ShipmentSkeleton"

type Props = {
	userId: string | null
}

const Shipments = ({ userId }: Props) => {
	const [loading, setLoading] = React.useState(false)
	const [shipments, updateShipments] = useShipments(
		(state: ShipmentsState) => [state.shipments, state.updateShipments]
	)

	async function handleLoadShipments() {
		if (!userId) return
		setLoading(true)
		const loadedShipments = await getShipments(userId)
		setLoading(false)
		loadedShipments.sort((a, b) => a.position - b.position)
		updateShipments(loadedShipments)
	}

	React.useEffect(() => {
		handleLoadShipments()
	}, [userId])

	return (
		<div className="mt-6 grid grid-cols-4 gap-6">
			{loading ? (
				<>
					{new Array(12).fill(0).map((index) => (
						<>
							<ShipmentSkeleton key={index} />
						</>
					))}
				</>
			) : (
				<>
					{shipments.map((shipment: TShipmentRecord) => (
						<Shipment key={shipment.id} shipmentRecord={shipment} />
					))}
				</>
			)}
		</div>
	)
}

export default Shipments
