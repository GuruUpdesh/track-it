"use client"

import "./nav.css"
import { usePackageContext } from "@/context/packageContext/usePackageContext"
import { getCouriersFromTrackingNumber } from "@/utils/courier"
import React, { useEffect, useState } from "react"
import { BsPlus } from "react-icons/bs"

const AddInput = () => {
	const { dispatchPackages } = usePackageContext()
	const [trackingNumber, setTrackingNumber] = useState("")
	const [error, setError] = useState("")
	const [valid, setValid] = useState(false)

	useEffect(() => {
		const couriers = getCouriersFromTrackingNumber(trackingNumber)
		if (couriers.length === 0 && trackingNumber.length > 0) {
			setError("Tracking number is invalid")
			setValid(false)
		} else {
			setError("")
			setValid(false)
		}

		if (couriers.length > 0) {
			setValid(true)
		}
	}, [trackingNumber])

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		setTrackingNumber(e.target.value.trim())
	}

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()

		if (valid) {
			const couriers = getCouriersFromTrackingNumber(trackingNumber)
			if (couriers.length === 0) return
			else if (couriers.length > 1) {
				console.warn(
					`Multiple couriers found for tracking number (${trackingNumber}) returning first one`
				)
			}
			console.log("couriers", couriers)
			dispatchPackages({
				type: "add",
				new: {
					id: Date.now(),
					name: "",
					trackingNumber,
					courier: couriers[0],
				},
			})
			setTrackingNumber("")
		}
	}

	return (
		<form
			onSubmit={handleSubmit}
			className={
				"group flex-item bg-[#110F1B] w-full sm:w-fit border focus-within:outline outline-offset-2 focus-within:outline-2 focus-within:outline-indigo-400 flex min-w-0" +
				(error
					? " border-red-700/75"
					: valid
					? " border-green-400/75"
					: " border-indigo-400/25")
			}
		>
			<label htmlFor="trackingNumber" className="sr-only">
				Tracking Number
			</label>
			<input
				id="trackingNumber"
				placeholder="Type tracking number..."
				type="text"
				className="bg-transparent py-2 px-4 w-full outline-none text-xs sm:text-sm md:text-md"
				value={trackingNumber}
				onChange={handleChange}
				aria-invalid={error ? "true" : "false"}
				aria-describedby={error ? "invalid tracking number" : undefined}
			/>
			<button
				type="submit"
				className={
					"bg-black/25 p-[12px] border-l" +
					(valid
						? " text-white/75 hover:text-white hover:bg-indigo-400/10"
						: " text-white/50") +
					(error
						? " border-l-red-700/75"
						: valid
						? " border-l-green-400/75"
						: " border-l-indigo-400/25")
				}
				disabled={!valid}
				aria-roledescription="add shipment button"
				aria-disabled={!valid}
			>
				<BsPlus
					className={
						"transition-transform duration-150" +
						(valid || trackingNumber === "" ? "" : " rotate-45")
					}
					aria-hidden="true"
					data-testid="add button"
				/>
			</button>
		</form>
	)
}

export default AddInput
