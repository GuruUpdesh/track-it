"use client"

import "./nav.css"
import { usePackageContext } from "@/context/packageContext/usePackageContext"
import { getCourierFromTrackingNumber } from "@/utils/courier"
import React, { useEffect, useState, useRef } from "react"
import { BsPlus } from "react-icons/bs"
import { toast } from "react-hot-toast"

const AddInput = () => {
	const { dispatchPackages } = usePackageContext()
	const [trackingNumber, setTrackingNumber] = useState("")
	const [error, setError] = useState("")
	const [valid, setValid] = useState(false)
	const inputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (
				(e.ctrlKey || e.metaKey) &&
				e.shiftKey &&
				e.key.toLowerCase() === "n"
			) {
				e.preventDefault()
				if (inputRef.current) {
					inputRef.current.focus()
				}
			}
		}

		window.addEventListener("keydown", handleKeyDown)
		return () => {
			window.removeEventListener("keydown", handleKeyDown)
		}
	}, [])

	useEffect(() => {
		const courier = getCourierFromTrackingNumber(trackingNumber)
		if (courier === null && trackingNumber.length > 0) {
			setError("Tracking number is invalid")
			setValid(false)
		} else {
			setError("")
			setValid(false)
		}

		if (courier) {
			setValid(true)
		}
	}, [trackingNumber])

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		setTrackingNumber(e.target.value.trim())
	}

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()

		if (valid) {
			const courier = getCourierFromTrackingNumber(trackingNumber)
			if (courier === null) return
			dispatchPackages({
				type: "add",
				new: {
					id: Date.now(),
					name: "",
					trackingNumber,
					courier: courier.code,
				},
			})
			setTrackingNumber("")
			toast.success("Package added")
		}
	}

	return (
		<form
			onSubmit={handleSubmit}
			className={
				"flex-item group flex w-full min-w-0 border bg-[#110F1B] outline-offset-2 focus-within:outline focus-within:outline-2 focus-within:outline-indigo-400 sm:w-fit" +
				(error
					? " border-red-700/75"
					: valid
						? " border-emerald-400/75"
						: " border-indigo-400/25")
			}
		>
			<label htmlFor="trackingNumber" className="sr-only">
				Tracking Number
			</label>
			<input
				ref={inputRef}
				id="trackingNumber"
				placeholder="Type tracking number..."
				type="text"
				className="md:text-md w-full bg-transparent px-4 py-2 text-xs outline-none"
				value={trackingNumber}
				onChange={handleChange}
				aria-invalid={error ? "true" : "false"}
				aria-describedby={error ? "invalid tracking number" : undefined}
			/>
			<button
				type="submit"
				className={
					"border-l bg-black/25 p-[12px]" +
					(valid
						? " text-white/75 hover:bg-indigo-400/10 hover:text-white"
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
