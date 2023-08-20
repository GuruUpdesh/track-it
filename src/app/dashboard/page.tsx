import Shipments from "./components/Shipments"
import { getShipments } from "../api/shipment/shipmentAPI"

export default async function Dashboard() {
	const shipments = await getShipments()
	return <Shipments loadedShipments={shipments} />
}
