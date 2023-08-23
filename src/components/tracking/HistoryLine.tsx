// eslint-disable-next-line
// @ts-nocheck

import { THistoryRow } from "@/app/api/package/typesAndSchemas"
import { cn } from "@/lib/utils"
import { formatDate, getTimeFromDate } from "@/utils/date"
import { getColorFromStatus } from "@/utils/package"
import { BsDot } from "react-icons/bs"

type Props = {
	historyItem: THistoryRow | null
	topItem?: boolean
}

const HistoryLine = ({ historyItem, topItem = false }: Props) => {
	if (!historyItem) return null
	const color = getColorFromStatus(historyItem.status)
	return (
		<div
			className={cn(
				"flex items-center rounded-lg py-3",
				topItem
					? `bg-black bg-gradient-to-b from-transparent px-2 to-${color}-400/25 border border-[#292a4b] shadow-${color}-600/25 mb-3`
					: "px-6"
			)}
		>
			{topItem ? (
				<></>
			) : (
				<div className="relative min-h-[32px] min-w-[32px]">
					<div
						className={`absolute left-[50%] min-h-[10px] min-w-[10px] translate-x-[-50%] rounded-full border border-${color}-200 bg-${color}-600`}
					></div>
					{/* <BsDot className={cn("min-h-[32px] min-w-[32px] scale-150", `text-${color}-200`)} /> */}
				</div>
			)}
			<div className="pl-4">
				<h5 className={cn("line-clamp-2", topItem && "font-semibold")}>
					{historyItem.detailedStatus}
				</h5>
				<div
					className={cn(
						"flex items-center",
						topItem ? "text-yellow-50/80" : "text-yellow-50/50"
					)}
				>
					{historyItem.location === "Location not found" ? null : (
						<>
							<p className="whitespace-nowrap">
								{historyItem.location}
							</p>
							<BsDot />
						</>
					)}
					<p className="whitespace-nowrap">
						{formatDate(historyItem.date) +
							" " +
							getTimeFromDate(historyItem.date)}
					</p>
				</div>
			</div>
		</div>
	)
}

export default HistoryLine
