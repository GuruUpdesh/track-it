import { TShipmentRecord } from "@/app/api/shipment/typesAndSchemas"
import React from "react"
import { Card, CardDescription, CardHeader } from "@/components/ui/card"
import ShipmentMenu from "./ShipmentMenu"
import { Button } from "../ui/button"
import { AiOutlineInfoCircle } from "react-icons/ai"
import ShipmentTitle from "./ShipmentTitle"

type Props = {
	shipmentRecord: TShipmentRecord
}

const Shipment = ({ shipmentRecord }: Props) => {
	return (
		<Card className="bg-white/5">
			<div>
				<CardHeader className="flex flex-row items-center justify-between px-4 py-2">
					<div className="flex flex-col">
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
		</Card>
	)
}

export default Shipment
