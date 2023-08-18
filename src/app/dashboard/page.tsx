import axios from "axios"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BiDotsVertical } from "react-icons/bi"
import { TShipmentRecord } from "../api/shipment/typesAndSchemas"

async function getShipments() {
	const res = await axios.get(`http://localhost:3000/api/shipment`)

	if (!res.data.success) {
		return []
	}

	return res.data.shipments
}

export default async function Dashboard() {
	const shipments = await getShipments()
	return (
		<div className="mt-6 grid grid-cols-4 gap-6">
			{shipments.map((shipment: TShipmentRecord) => (
				<Card key={shipment.id} className="bg-white/5">
					<CardHeader>
						<CardTitle>{shipment.name}</CardTitle>
						<CardDescription>{shipment.courier}</CardDescription>
						<Button variant="outline" size="icon">
							<BiDotsVertical />
						</Button>
					</CardHeader>
					<CardContent></CardContent>
				</Card>
			))}
		</div>
	)
}
