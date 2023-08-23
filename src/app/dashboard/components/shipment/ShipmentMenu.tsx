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
import { useShipments } from "@/lib/shipmentsStore"
import { AiOutlineDelete } from "react-icons/ai"
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type Props = {
	shipmentRecord: TShipmentRecord
}

const ShipmentMenu = ({ shipmentRecord }: Props) => {
	const [updateShipment, deleteShipmentState] = useShipments((state) => [
		state.updateShipment,
		state.deleteShipment,
	])

	const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="outline"
						size="icon"
						className="opacity-75"
					>
						<BiDotsVertical />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem
						onSelect={() => {
							updateShipment({
								...shipmentRecord,
								position: shipmentRecord.position - 1,
							})
						}}
						disabled={shipmentRecord.position === 0}
					>
						<AiOutlineDelete className="mr-2" />
						Move Left
					</DropdownMenuItem>
					<DropdownMenuItem
						onSelect={() => {
							setDeleteDialogOpen(true)
						}}
					>
						<AiOutlineDelete className="mr-2" />
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<AlertDialog
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This will delete <b>{shipmentRecord.name}</b> from
							the dashboard.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => {
								deleteShipmentState(shipmentRecord.id)
							}}
						>
							Continue
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
}

export default ShipmentMenu
