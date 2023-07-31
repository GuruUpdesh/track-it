"use client"

import { TStatus } from "@/app/api/package/typesAndSchemas"
import React from "react"
import { getColorFromStatus, getIconForStatus } from "@/utils/package"
import { AiOutlineLoading3Quarters, AiOutlineWarning } from "react-icons/ai"
import { cn } from "@/lib/utils"

type Props = {
	error?: boolean
	status?: TStatus
}

const CardImage = ({ error, status }: Props) => {
	// warning: the to-... and text-... only work because tailwind.config.js includes the classnames in the safelist array
	const icon = error ? (
		<AiOutlineWarning />
	) : !status ? (
		<AiOutlineLoading3Quarters className="animate-spin" />
	) : (
		getIconForStatus(status)
	)
	return (
		<div
			className={cn(
				"relative flex aspect-square min-w-[50px] items-center justify-center rounded-full border border-indigo-400/25",
				`text-${getColorFromStatus(status, error)}-200`
			)}
		>
			<div
				className={
					"absolute z-20 flex h-full w-full items-center justify-center rounded-full"
				}
			>
				{icon}
			</div>
			<div
				className={cn(
					"absolute z-10 h-full w-full rounded-full bg-gradient-to-b from-transparent",
					`to-${getColorFromStatus(status, error)}-400/25`
				)}
			/>
		</div>
	)
}

export default CardImage
