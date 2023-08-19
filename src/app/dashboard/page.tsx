import axios from "axios"
import Shipments from "@/components/ui/Shipments"

async function getShipments() {
	const res = await axios.get(`http://localhost:3000/api/shipment`)

	// wait 2 seocnds to simulate loading
	// await new Promise((resolve) => setTimeout(resolve, 2000))

	if (!res.data.success) {
		return []
	}

	return res.data.shipments
}

export default async function Dashboard() {
	const shipments = await getShipments()
	return <Shipments loadedShipments={shipments} />
}
