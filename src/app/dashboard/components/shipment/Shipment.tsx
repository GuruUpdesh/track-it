import { TShipmentRecord } from "@/app/api/shipment/typesAndSchemas"
import React from "react"
import { Card, CardDescription, CardHeader } from "@/components/ui/card"
import ShipmentMenu from "./ShipmentMenu"
import { Button } from "@/components/ui/button"
import { AiOutlineInfoCircle } from "react-icons/ai"
import ShipmentTitle from "./ShipmentTitle"
import { motion } from "framer-motion"
import ShipmentMap from "../ShipmentMap"
import {
	FiArrowDownRight,
	FiArrowUpRight,
	FiArrowDownLeft,
	FiArrowUpLeft,
} from "react-icons/fi"

type Props = {
	shipmentRecord: TShipmentRecord
}

const Shipment = ({ shipmentRecord }: Props) => {
	return (
		<motion.div
			layoutId={`card-${shipmentRecord.id}`}
			transition={{ duration: 0.3, ease: [0.075, 0.82, 0.165, 1] }}
		>
			<Card className="group overflow-hidden bg-white/5">
				<div className="border-b">
					<CardHeader className="flex flex-row items-center justify-between px-4 py-2">
						<div className="flex items-baseline gap-2">
							<ShipmentTitle shipmentRecord={shipmentRecord} />
							<CardDescription>
								{shipmentRecord.courier}
							</CardDescription>
						</div>
						<div>
							<Button
								variant="ghost"
								size="icon"
								className="rounded-full"
							>
								<AiOutlineInfoCircle />
							</Button>
							<ShipmentMenu shipmentRecord={shipmentRecord} />
						</div>
					</CardHeader>
				</div>
				<div className="relative h-[175px] w-full bg-[hsl(var(--background))]">
					<div className="absolute h-full w-full opacity-0 transition-opacity group-hover:animate-expand group-hover:opacity-75">
						<FiArrowDownRight className="absolute bottom-0 right-0" />
						<FiArrowUpRight className="absolute right-0 top-0" />
						<FiArrowDownLeft className="absolute bottom-0 left-0" />
						<FiArrowUpLeft className="absolute left-0 top-0" />
					</div>
					<ShipmentMap />
				</div>
			</Card>
		</motion.div>
	)
}

export default Shipment
