import axios from "axios"
import Shipments from "./components/Shipments"
import { currentUser } from "@clerk/nextjs"

async function getShipments() {
	const user = await currentUser()
	console.log(user)
	if (!user || !user.id) {
		console.error("No user found")
		return []
	}

	const res = await axios.get(`http://localhost:3000/api/shipment`, {
		params: {
			userId: user.id,
		},
	})

	if (!res.data.success) {
		return []
	}

	return res.data.shipments
}

export default async function Dashboard() {
	const shipments = await getShipments()
	return <Shipments loadedShipments={shipments} />
}
