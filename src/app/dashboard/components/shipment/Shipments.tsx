"use client"

import { TShipmentRecord } from "@/app/api/shipment/typesAndSchemas"
import React from "react"
import Shipment from "./Shipment"
import { ShipmentsState, useShipments } from "@/lib/shipmentsStore"
import shipmentAPI from "@/app/api/shipment/shipmentAPI"
import ShipmentSkeleton from "./ShipmentSkeleton"

type Props = {
	userId: string | null
}

const Shipments = ({ userId }: Props) => {
	const [loading, setLoading] = React.useState(false)
	const [shipments, updateShipments] = useShipments(
		(state: ShipmentsState) => [state.shipments, state.setShipments]
	)

	async function handleLoadShipments() {
		if (!userId) return
		setLoading(true)
		const loadedShipments = await shipmentAPI.getShipments(userId)
		setLoading(false)
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
					{shipments.map((shipment: TShipmentRecord, index) => (
						<Shipment
							key={shipment.id}
							shipmentRecord={shipment}
							index={index}
						/>
					))}
				</>
			)}
		</div>
	)
}

export default Shipments
