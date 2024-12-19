import { cn } from "@/lib/utils"
import React from "react"

type Props = {
	disabled: boolean
}

const SaveButton = ({ disabled }: Props) => {
	return (
		<button
			type="submit"
			disabled={disabled}
			className={cn(
				"rounded-md px-4 py-2",
				disabled ? "bg-white/10" : "bg-green-400/50"
			)}
		>
			Save
		</button>
	)
}

export default SaveButton
