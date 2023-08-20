import Shipments from "./components/Shipments"
// import { getShipments } from "../api/shipment/shipmentAPI"
import { currentUser } from "@clerk/nextjs"
import { PrismaClient } from "@prisma/client"
import { shipmentRecordSchema } from "../api/shipment/typesAndSchemas"
import { z } from "zod"

const prisma = new PrismaClient()

async function getShipments() {
	const user = await currentUser()

	if (!user || !user.id) {
		return []
	}

	const shipments = await prisma.shipment.findMany({
		where: {
			userId: user.id,
		},
	})

	const jsonShipments = JSON.stringify(shipments)
	const parsedShipments = JSON.parse(jsonShipments)

	return z.array(shipmentRecordSchema).parse(parsedShipments)
}

export default async function Dashboard() {
	const shipments = await getShipments()
	return <Shipments loadedShipments={shipments} />
}
