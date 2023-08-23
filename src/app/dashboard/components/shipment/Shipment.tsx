import {
	TShipmentRecord,
	shipmentRecordSchema,
} from "@/app/api/shipment/typesAndSchemas"
import React from "react"
import { Card, CardDescription, CardHeader } from "@/components/ui/card"
import ShipmentMenu from "./ShipmentMenu"
// import { Button } from "@/components/ui/button"
// import { AiOutlineInfoCircle } from "react-icons/ai"
import ShipmentTitle from "./ShipmentTitle"
import { motion } from "framer-motion"
// import ShipmentMap from "./ShipmentMap"
// import {
// 	FiArrowDownRight,
// 	FiArrowUpRight,
// 	FiArrowDownLeft,
// 	FiArrowUpLeft,
// } from "react-icons/fi"
// import { getTrackingInfo } from "@/app/api/track/trakingAPI"
// import { TTrackingData } from "@/app/api/package/typesAndSchemas"
import { useShipments } from "@/lib/shipmentsStore"
import { cn } from "@/lib/utils"

type Props = {
	shipmentRecord: TShipmentRecord
}

const Shipment = ({ shipmentRecord }: Props) => {
	const [displayedShipments, updateShipment] = useShipments((state) => [
		state.displayedShipments,
		state.updateShipment,
	])

	interface IDragState {
		indicator: number | null
		dragging: boolean
	}

	const [drag, setDrag] = React.useState<IDragState>({
		indicator: null,
		dragging: false,
	})

	// const [trackingInfo, setTrackingInfo] =
	// 	React.useState<TTrackingData | null>(null)

	async function fetchTrackingInfo() {
		// const trackingInfoData = await getTrackingInfo(
		// 	shipmentRecord.trackingNumber,
		// 	shipmentRecord.courier
		// )
		// setTrackingInfo(trackingInfoData)
	}

	function getShipmentFromDataTransfer(dataTransfer: DataTransfer) {
		const data = dataTransfer.getData("shipment")
		return shipmentRecordSchema.parse(JSON.parse(data))
	}

	const dragAndDrop = {
		onDragStart: (ev: React.DragEvent<HTMLDivElement>) => {
			ev.dataTransfer.setData("shipment", JSON.stringify(shipmentRecord))
			setDrag({ ...drag, dragging: true })
		},
		onDragOver: (ev: React.DragEvent<HTMLDivElement>) => {
			ev.preventDefault()
			const shipment = getShipmentFromDataTransfer(ev.dataTransfer)
			// if the shipment is the same as the one being dragged set the indicator to 0
			let indicator = null
			if (shipment.position === shipmentRecord.position) {
				indicator = 0
			} else if (shipment.position < shipmentRecord.position) {
				indicator = -1
			} else if (shipment.position > shipmentRecord.position) {
				indicator = 1
			}
			setDrag({ ...drag, indicator })
		},
		onDragLeave: (ev: React.DragEvent<HTMLDivElement>) => {
			ev.preventDefault()
			setDrag({ ...drag, indicator: null })
		},
		onDrop: async (ev: React.DragEvent<HTMLDivElement>) => {
			ev.preventDefault()
			const shipment = getShipmentFromDataTransfer(ev.dataTransfer)
			if (shipment.position === shipmentRecord.position) return

			updateShipment({
				id: shipment.id,
				position: shipmentRecord.position,
			})
			setDrag({ indicator: null, dragging: false })
		},
		onDragEnd: (ev: React.DragEvent<HTMLDivElement>) => {
			ev.preventDefault()
			setDrag({ indicator: null, dragging: false })
		},
	}

	React.useEffect(() => {
		fetchTrackingInfo()
	}, [shipmentRecord.trackingNumber, shipmentRecord.courier])

	if (!displayedShipments.has(shipmentRecord.id)) return null

	return (
		<motion.div
			layoutId={`card-${shipmentRecord.id}`}
			transition={{ duration: 0.3, ease: [0.075, 0.82, 0.165, 1] }}
			className="relative"
		>
			<div
				className={cn(
					"absolute h-full w-1 scale-y-0 rounded-full bg-[hsl(var(--primary))] opacity-0 transition-transform",
					{
						"scale-y-100 opacity-100":
							drag.indicator && Math.abs(drag.indicator) === 1,
						"-right-3": drag.indicator === -1,
						"-left-3": drag.indicator === 1,
					}
				)}
			/>
			<Card
				draggable
				onDragStart={dragAndDrop.onDragStart}
				onDragOver={dragAndDrop.onDragOver}
				onDragLeave={dragAndDrop.onDragLeave}
				onDrop={dragAndDrop.onDrop}
				onDragEnd={dragAndDrop.onDragEnd}
				className={cn(
					"group overflow-hidden bg-white/5 transition-opacity",
					drag.dragging && "opacity-50"
				)}
			>
				<div className="">
					<CardHeader className="flex flex-row items-center justify-between px-4 py-2">
						<div className="flex items-baseline gap-2">
							<ShipmentTitle shipmentRecord={shipmentRecord} />
							<CardDescription>
								{shipmentRecord.courier} -{" "}
								{shipmentRecord.position}
							</CardDescription>
						</div>
						<div>
							{/* <Button
								variant="ghost"
								size="icon"
								className="rounded-full"
							>
								<AiOutlineInfoCircle />
							</Button> */}
							<ShipmentMenu shipmentRecord={shipmentRecord} />
						</div>
					</CardHeader>
					{/* <div className={cn("bg-blue-500 h-[1px] border-top border-[hsl(var(--background))]", trackingInfo && `w-[${trackingInfo.progressPercentage}]`)}/> */}
				</div>
				{/* <div className="relative h-[175px] w-full bg-[hsl(var(--background))]">
					<div className="absolute h-full w-full opacity-0 transition-opacity group-hover:animate-expand group-hover:opacity-75">
						<FiArrowDownRight className="absolute bottom-0 right-0" />
						<FiArrowUpRight className="absolute right-0 top-0" />
						<FiArrowDownLeft className="absolute bottom-0 left-0" />
						<FiArrowUpLeft className="absolute left-0 top-0" />
					</div>
					{trackingInfo && (
						<ShipmentMap trackingInfo={trackingInfo} />
					)}
				</div> */}
			</Card>
		</motion.div>
	)
}

export default Shipment
