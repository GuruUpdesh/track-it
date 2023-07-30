import { TrackingHistory } from "@/app/api/package/typesAndSchemas"
import { formatDate, getTimeFromDate } from "@/utils/date"
import { getIconForStatus } from "@/utils/package"
import { BsDot } from "react-icons/bs"

type Props = {
	historyItem: TrackingHistory | null
	topItem?: boolean
}

const HistoryLine = ({ historyItem, topItem = false }: Props) => {
	if (!historyItem) return null
	const delivered = historyItem.status === "DELIVERED"
	return (
		<div
			className={
				"flex items-center rounded-lg px-6 py-3" +
				(topItem
					? delivered
						? " bg-gradient-to-r from-indigo-900 to-indigo-700 py-1 shadow-xl shadow-indigo-600/25"
						: " bg-[#1a1a18] py-1"
					: " ")
			}
		>
			{topItem ? (
				<div className="rounded-full border border-white/50 p-2 text-sm text-white/75 outline outline-white/10">
					{getIconForStatus(
						historyItem.status,
						historyItem.deliveryLocation
					)}
				</div>
			) : (
				<>
					<BsDot className="min-h-[32px] min-w-[32px] text-yellow-50/50" />
				</>
			)}
			<div className="pl-4">
				<h5 className="line-clamp-1">{historyItem.detailedStatus}</h5>
				<div className="flex items-center text-yellow-50/50">
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
