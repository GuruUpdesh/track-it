"use client"

import { TStatus } from "@/app/api/package/typesAndSchemas"
import React, { useMemo } from "react"
import { getIconForStatus } from "@/utils/package"
import { AiOutlineLoading3Quarters, AiOutlineWarning } from "react-icons/ai"

type Props = {
	error?: boolean
	status?: TStatus
}

const CardImage = ({ error, status }: Props) => {
	const color = useMemo(() => {
		let bgClass, textClass

		if (error) {
			bgClass = "to-red-400/25"
			textClass = "text-red-200"
		} else {
			switch (status) {
				case "DELIVERED":
				case "RETURNED":
					bgClass = "to-emerald-400/25"
					textClass = "text-emerald-200"
					break
				case "PRE_TRANSIT":
					bgClass = "to-yellow-400/25"
					textClass = "text-yellow-200"
					break
				case "FAILURE":
					bgClass = "to-red-400/25"
					textClass = "text-red-200"
					break
				case "TRANSIT":
					bgClass = "to-lime-400/25"
					textClass = "text-lime-200"
					break
				default:
					bgClass = "to-indigo-400/25"
					textClass = "text-indigo-200"
					break
			}
		}

		return [bgClass, textClass]
	}, [status, error])
	const icon = error ? (
		<AiOutlineWarning />
	) : !status ? (
		<AiOutlineLoading3Quarters className="animate-spin" />
	) : (
		getIconForStatus(status)
	)
	return (
		<div
			className={`relative flex aspect-square min-w-[50px] items-center justify-center rounded-full border border-indigo-400/25 ${color[1]}`}
		>
			<div
				className={
					"absolute z-20 flex h-full w-full items-center justify-center rounded-full"
				}
			>
				{icon}
			</div>
			<div
				className={`absolute z-10 h-full w-full rounded-full bg-gradient-to-b from-transparent ${color[0]}`}
			/>
		</div>
	)
}

export default CardImage
