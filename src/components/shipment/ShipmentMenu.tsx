"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { BiDotsVertical } from "react-icons/bi"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TShipmentRecord } from "@/app/api/shipment/typesAndSchemas"
import { toast } from "react-hot-toast"
import { deleteShipment as handleDelete } from "@/app/api/shipment/shipmentAPI"
import { useShipments } from "@/lib/slices/createShipmentsSlice"

async function deleteShipment(id: number) {
	const res = await handleDelete(id)

	if (!res.data.success) {
		toast.error("Failed to delete shipment")
	}
}

type Props = {
	shipmentRecord: TShipmentRecord
}

const ShipmentMenu = ({ shipmentRecord }: Props) => {
	const [deleteShipmentState] = useShipments((state) => [
		state.deleteShipment,
	])
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon">
					<BiDotsVertical />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem
					onSelect={() => {
						deleteShipment(shipmentRecord.id)
						deleteShipmentState(shipmentRecord.id)
					}}
				>
					Delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default ShipmentMenu
