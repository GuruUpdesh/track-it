"use client"

import { updateShipment } from "@/app/api/shipment/shipmentAPI"
import { TShipmentRecord } from "@/app/api/shipment/typesAndSchemas"
import { useShipments } from "@/lib/shipmentsStore"
import React, { useState } from "react"
import { toast } from "react-hot-toast"

type Props = {
	shipmentRecord: TShipmentRecord
}

const ShipmentTitle = ({ shipmentRecord }: Props) => {
	const [updateShipmentState] = useShipments((state) => [
		state.updateShipment,
	])
	const [name, setName] = useState(shipmentRecord.name)
	const [edit, setEdit] = useState(shipmentRecord.name === "" ? true : false)
	const [loading, setLoading] = useState(false)

	function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
		setName(e.target.value)
	}

	async function handleSaveName() {
		if (name.trim() !== "") setEdit(false)

		if (name === shipmentRecord.name) return
		setLoading(true)
		const shipment = await updateShipment({
			id: shipmentRecord.id,
			name: name,
		})
		setLoading(false)

		updateShipmentState({
			...shipmentRecord,
			name: name,
		})

		if (!shipment) {
			toast.error("Something went wrong")
			return
		}
	}

	return (
		<div>
			{edit ? (
				<input
					autoFocus
					placeholder="Type name..."
					value={name}
					onChange={handleNameChange}
					onBlur={handleSaveName}
					onKeyDown={(event) => {
						if (event.key === "Enter") {
							handleSaveName()
						}
					}}
					className="w-[20ch] max-w-full bg-transparent text-xl font-semibold tracking-tighter outline-none"
				/>
			) : (
				<button
					className="cursor-pointer text-xl font-semibold tracking-tighter"
					role="heading"
					onClick={() => setEdit(true)}
					disabled={loading}
				>
					{name}
				</button>
			)}
		</div>
	)
}

export default ShipmentTitle
