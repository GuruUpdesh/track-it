import axios from "axios"
import {
	TShipmentRecordCreate,
	TShipmentRecordUpdate,
	shipmentRecordCreateSchema,
} from "./typesAndSchemas"

export async function createShipment(shipmentRecord: TShipmentRecordCreate) {
	const shipment = shipmentRecordCreateSchema.parse(shipmentRecord)
	const res = axios.post("/api/shipment", {
		name: shipment.name,
		courier: shipment.courier,
		trackingNumber: shipment.trackingNumber,
		userId: shipment.userId,
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
	const res = axios.patch("/api/shipment", {
		id: shipmentRecord.id,
		name: shipmentRecord.name,
		courier: shipmentRecord.courier,
		trackingNumber: shipmentRecord.trackingNumber,
	})

	return res
}
