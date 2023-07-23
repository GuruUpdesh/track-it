import { TStatus } from "@/app/api/package/typesAndSchemas"
import React from "react"
import Image from "next/image"
import { getIconForStatus } from "@/utils/package"
import { AiOutlineLoading3Quarters, AiOutlineWarning } from "react-icons/ai"

type Props = {
	error?: boolean
	status?: TStatus
}

const CardImage = ({ error, status }: Props) => {
	const icon = error ? (
		<AiOutlineWarning />
	) : !status ? (
		<AiOutlineLoading3Quarters className="animate-spin" />
	) : (
		getIconForStatus(status)
	)
	return (
		<div className="relative flex aspect-square min-w-[50px] items-center justify-center rounded-full border border-indigo-400/25 text-indigo-200">
			<div
				className={
					"absolute z-20 flex h-full w-full items-center justify-center rounded-full" +
					(!status && " bg-black/25 backdrop-blur-[2px]")
				}
			>
				{icon}
			</div>
			<Image
				src="/package.svg"
				alt="Package Box"
				width={27}
				height={27}
				priority
				className="pointer-events-none z-10 h-auto"
			/>
		</div>
	)
}

export default CardImage
