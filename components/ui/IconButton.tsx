import { cn } from "@/lib/utils"
import React from "react"
import Tooltip from "./Tooltip"

type Props = {
	children: React.ReactNode
	ariaLabel: string
	onClick?: () => void
	disabled?: boolean
	className?: string
}

const IconButton = ({
	children,
	ariaLabel,
	onClick = undefined,
	disabled = false,
	className = "",
}: Props) => {
	return (
		<Tooltip title={ariaLabel} disabled={disabled}>
			<button
				onClick={onClick}
				disabled={disabled}
				className={cn(
					"aspect-square cursor-pointer rounded-full p-2 text-yellow-50 outline-none hover:bg-yellow-50/10 focus:bg-yellow-50/10 disabled:pointer-events-none disabled:cursor-default disabled:text-yellow-50/50 disabled:hover:bg-transparent disabled:group-hover:opacity-50",
					className
				)}
				aria-label={ariaLabel}
			>
				{children}
			</button>
		</Tooltip>
	)
}

export default IconButton
