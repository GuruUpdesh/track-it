import {
	TShipmentRecord,
	TShipmentRecordCreate,
	TShipmentRecordUpdate,
	shipmentRecordCreateSchema,
	shipmentRecordSchema,
	shipmentRecordUpdateSchema,
} from "./typesAndSchemas"
import { ZodError } from "zod"

interface IShipmentAPIResponse {
	success: boolean
	shipment?: TShipmentRecord
	error?: string
}

function handleError(error: unknown) {
	console.error(error)
	if (error instanceof ZodError) {
		return `Failed to validate: ${error.message}`
	} else {
		return `Unknown error: ${error}`
	}
}

async function getShipments(userId: string): Promise<TShipmentRecord[]> {
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

async function createShipment(
	shipmentRecord: TShipmentRecordCreate
): Promise<IShipmentAPIResponse> {
	try {
		const shipment = shipmentRecordCreateSchema.parse(shipmentRecord)

		const response = await fetch("/api/shipment", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(shipment),
		})

		const data = await response.json()

		if (!data.success) {
			return { success: false, error: data.error }
		}

		const newShipment = shipmentRecordSchema.parse(data.shipment)
		return { success: true, shipment: newShipment }
	} catch (error) {
		return { success: false, error: handleError(error) }
	}
}

export async function deleteShipment(
	id: number
): Promise<IShipmentAPIResponse> {
	try {
		const response = await fetch("/api/shipment", {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ id }),
		})

		const data = await response.json()

		if (!data.success) {
			return { success: false, error: data.error }
		}

		const deletedShipment = shipmentRecordSchema.parse(data.shipment)
		return { success: true, shipment: deletedShipment }
	} catch (error) {
		return { success: false, error: handleError(error) }
	}
}

export async function updateShipment(
	shipmentRecord: TShipmentRecordUpdate
): Promise<IShipmentAPIResponse> {
	try {
		const shipment = shipmentRecordUpdateSchema.parse(shipmentRecord)

		const response = await fetch("/api/shipment", {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(shipment),
		})

		const data = await response.json()

		if (!data.success) {
			return { success: false, error: data.error }
		}

		const updatedShipment = shipmentRecordSchema.parse(data.shipment)
		return { success: true, shipment: updatedShipment }
	} catch (error) {
		return { success: false, error: handleError(error) }
	}
}

const shipmentAPI = {
	getShipments,
	createShipment,
	deleteShipment,
	updateShipment,
}

export default shipmentAPI
