import axios from "axios"
import {
	TShipmentRecordCreate,
	TShipmentRecordUpdate,
	shipmentRecordCreateSchema,
	shipmentRecordUpdateSchema,
} from "./typesAndSchemas"

export async function createShipment(shipmentRecord: TShipmentRecordCreate) {
	const shipment = shipmentRecordCreateSchema.parse(shipmentRecord)
	const res = axios.post("/api/shipment", {
		name: shipment.name,
		courier: shipment.courier,
		trackingNumber: shipment.trackingNumber,
		position: shipment.position,
		userId: shipment.userId,
		createdAt: shipment.createdAt,
	})

	return res
}

export async function deleteShipment(id: number) {
	const res = axios.delete("/api/shipment", {
		data: {
			id: id,
		},
	})

	return res
}

export async function updateShipment(shipmentRecord: TShipmentRecordUpdate) {
	const shipment = shipmentRecordUpdateSchema.parse(shipmentRecord)
	const res = axios.patch("/api/shipment", {
		id: shipment.id,
		name: shipment.name,
		courier: shipment.courier,
		trackingNumber: shipment.trackingNumber,
		position: shipment.position,
	})

	return res
}
