import React from "react"
import { MdClose } from "react-icons/md"
import Tooltip from "../Tooltip"
import { useModalContext } from "./Modal"

const CloseButton = () => {
	const { setOpen } = useModalContext()
	function handleClose() {
		setOpen(false)
	}
	return (
		<Tooltip title="close">
			<button
				onClick={handleClose}
				className="absolute right-2 top-2 aspect-square cursor-pointer rounded-full p-2 text-yellow-50 outline-none hover:bg-yellow-50/10"
			>
				<MdClose />
			</button>
		</Tooltip>
	)
}

export default CloseButton
