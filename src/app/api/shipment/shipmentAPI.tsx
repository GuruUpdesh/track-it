import {
	TShipmentRecord,
	TShipmentRecordCreate,
	TShipmentRecordUpdate,
	shipmentRecordCreateSchema,
	shipmentRecordUpdateSchema,
} from "./typesAndSchemas"

export async function getShipments(userId: string): Promise<TShipmentRecord[]> {
	const response = await fetch(
		`/api/shipment?userId=${encodeURIComponent(userId)}`,
		{ method: "GET" }
	)
	const data = await response.json()

	if (!data.success) {
		return []
	}

	return data.shipments
}

export async function createShipment(
	shipmentRecord: TShipmentRecordCreate
): Promise<TShipmentRecord | null> {
	const shipment = shipmentRecordCreateSchema.parse(shipmentRecord)

	const response = await fetch("/api/shipment", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			name: shipment.name,
			courier: shipment.courier,
			trackingNumber: shipment.trackingNumber,
			position: shipment.position,
			userId: shipment.userId,
			createdAt: shipment.createdAt,
		}),
	})

	const data = await response.json()

	if (!data.success) {
		return null
	}

	return data.newShipment
}

export async function deleteShipment(
	id: number
): Promise<TShipmentRecord | null> {
	const response = await fetch("/api/shipment", {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			id: id,
		}),
	})

	const data = await response.json()

	if (!data.success) {
		return null
	}

	return data.shipment
}

export async function updateShipment(
	shipmentRecord: TShipmentRecordUpdate
): Promise<TShipmentRecord | null> {
	const shipment = shipmentRecordUpdateSchema.parse(shipmentRecord)

	const response = await fetch("/api/shipment", {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			id: shipment.id,
			name: shipment.name,
			courier: shipment.courier,
			trackingNumber: shipment.trackingNumber,
			position: shipment.position,
		}),
	})

	const data = await response.json()

	if (!data.success) {
		return null
	}

	return data.updatedShipment
}
