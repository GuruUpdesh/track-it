"use client"

import React, { useState } from "react"
import { Button } from "../../../components/ui/button"
import { BiUndo, BiRedo } from "react-icons/bi"
import { useShipments } from "@/lib/shipmentsStore"
import { AiOutlineLoading3Quarters } from "react-icons/ai"

const UndoRedo = () => {
	const [deletedShipmentsStack, undoLastDelete] = useShipments((state) => [
		state.deletedShipmentsStack,
		state.undoLastDelete,
	])
	const [undoLoading, setUndoLoading] = useState(false)

	async function undo() {
		setUndoLoading(true)
		await undoLastDelete()
		setUndoLoading(false)
	}

	return (
		<>
			<Button
				variant="outline"
				size="icon"
				disabled={deletedShipmentsStack.length === 0 || undoLoading}
				onClick={undo}
			>
				{undoLoading ? (
					<AiOutlineLoading3Quarters className="animate-spin" />
				) : (
					<BiUndo />
				)}
			</Button>
			<Button variant="outline" size="icon" disabled={true}>
				<BiRedo />
			</Button>
		</>
	)
}

export default UndoRedo
