import React from "react"
import { useModalContext } from "./Modal"

const CancelButton = () => {
	const { setOpen } = useModalContext()
	function handleCancel() {
		setOpen(false)
	}
	return (
		<button
			onClick={handleCancel}
			className="rounded-md bg-white/10 px-4 py-2"
		>
			Cancel
		</button>
	)
}

export default CancelButton
