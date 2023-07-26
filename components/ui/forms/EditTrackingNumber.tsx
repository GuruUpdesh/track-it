import React, { useState } from "react"
import { TPackage } from "@/components/DashboardGrid"
import CancelButton from "../modal/CancelButton"
import SaveButton from "../modal/SaveButton"
import { usePackageContext } from "@/context/packageContext/usePackageContext"
import { useModalContext } from "../modal/Modal"
import { toast } from "react-hot-toast"

type Props = {
	pkg: TPackage
}

const EditTrackingNumber = ({ pkg }: Props) => {
	const [trackingNumber, setTrackingNumber] = useState(pkg.trackingNumber)
	const { dispatchPackages } = usePackageContext()
	const { setOpen } = useModalContext()
	return (
		<form
			className="text-yellow-50"
			onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
				e.preventDefault()
				dispatchPackages({
					type: "updateTrackingNumber",
					id: pkg.id,
					trackingNumber: trackingNumber,
				})
				setOpen(false)
				toast.success("Tracking number updated")
			}}
		>
			<input
				className="w-full rounded-md border border-yellow-50/25 bg-transparent p-2 outline-none outline-offset-2 focus-within:outline-2 focus-within:outline-indigo-400"
				id="tracking-number-input"
				placeholder="Type tracking number..."
				autoFocus={true}
				type="text"
				value={trackingNumber}
				onChange={(e) => {
					setTrackingNumber(e.target.value)
				}}
			/>
			<div className="mt-6 flex items-center justify-between">
				<CancelButton />
				<SaveButton disabled={trackingNumber === pkg.trackingNumber} />
			</div>
		</form>
	)
}

export default EditTrackingNumber
