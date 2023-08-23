"use client"

import { getCourierFromTrackingNumber } from "@/utils/courier"
import React, { useEffect, useState } from "react"
import { Input } from "../../../components/ui/input"
import { Button } from "../../../components/ui/button"
import { cn } from "@/lib/utils"
import { BiPlus } from "react-icons/bi"
import { useAuth } from "@clerk/nextjs"
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import { useShipments } from "@/lib/shipmentsStore"

const AddInput = () => {
	const [addShipment] = useShipments((state) => [
		state.addShipment,
		state.shipments,
	])
	const { userId } = useAuth()
	const [trackingNumber, setTrackingNumber] = useState("")

	const [loading, setLoading] = useState(false)
	const [valid, setValid] = useState(false)

	useEffect(() => {
		const courier = getCourierFromTrackingNumber(trackingNumber)
		if (courier === null && trackingNumber.length > 0) {
			setValid(false)
		} else {
			setValid(false)
		}

		if (courier) {
			setValid(true)
		}
	}, [trackingNumber])

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		setTrackingNumber(e.target.value.trim())
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()

		if (valid && userId) {
			const courier = getCourierFromTrackingNumber(trackingNumber)
			if (courier === null) return

			const newShipment = {
				name: "",
				courier: courier.code,
				position: -1,
				trackingNumber,
				userId,
			}

			setLoading(true)
			const result = await addShipment(newShipment)
			setLoading(false)

			if (result === false) {
				return
			}

			setTrackingNumber("")
		}
	}

	return (
		<form
			onSubmit={handleSubmit}
			className={cn("flex w-full max-w-xs items-center space-x-1")}
		>
			<label htmlFor="add-shipment" className="sr-only">
				Tracking Number
			</label>
			<Input
				id="add-shipment"
				placeholder="Type tracking number..."
				type="text"
				value={trackingNumber}
				onChange={handleChange}
				className={cn({
					"border border-red-700/75": !(
						valid || trackingNumber === ""
					),
					"border border-emerald-400/75": valid,
				})}
				disabled={loading}
				aria-autocomplete="list"
				aria-invalid={!valid}
				aria-describedby={valid ? undefined : "invalid tracking number"}
			/>
			<Button
				variant="outline"
				size="icon"
				disabled={!(valid || trackingNumber === "") || loading}
				type="submit"
			>
				{loading ? (
					<AiOutlineLoading3Quarters className="animate-spin" />
				) : (
					<BiPlus
						className={cn("transition-transform duration-150", {
							"rotate-45": !(valid || trackingNumber === ""),
						})}
					/>
				)}
			</Button>
		</form>
	)
}

export default AddInput
