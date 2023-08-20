import { create } from "zustand"
import {
	TShipmentRecord,
	shipmentRecordSchema,
} from "@/app/api/shipment/typesAndSchemas"
import { createShipment } from "@/app/api/shipment/shipmentAPI"

export interface ShipmentsState {
	shipments: TShipmentRecord[]
	deletedShipmentsStack: TShipmentRecord[]
	updateShipments: (shipments: TShipmentRecord[]) => void
	addShipment: (shipment: TShipmentRecord) => void
	deleteShipment: (id: number) => void
	updateShipment: (shipment: TShipmentRecord) => void
	undoLastDelete: () => void
}

export const useShipments = create<ShipmentsState>()((set, get) => ({
	shipments: [],
	deletedShipmentsStack: [],
	redoStack: [],
	updateShipments: (shipments) => {
		set(() => ({ shipments: shipments }))
	},
	addShipment: (shipment) => {
		set((state) => ({
			shipments: [...state.shipments, shipment],
		}))
	},
	deleteShipment: (id) => {
		set((state) => {
			const shipmentToDelete = state.shipments.find(
				(shipment) => shipment.id === id
			)
			if (!shipmentToDelete) return state

			return {
				shipments: state.shipments.filter((s) => s.id !== id),
				deletedShipmentsStack: [
					shipmentToDelete,
					...state.deletedShipmentsStack,
				],
			}
		})
	},
	updateShipment: (shipment) => {
		set((state) => ({
			shipments: state.shipments.map((s) =>
				s.id === shipment.id ? shipment : s
			),
		}))
	},
	undoLastDelete: async () => {
		const currentState = get()
		const lastDeletedShipment = currentState.deletedShipmentsStack[0]
		if (!lastDeletedShipment) return

		try {
			const res = await createShipment({
				name: lastDeletedShipment.name,
				courier: lastDeletedShipment.courier,
				trackingNumber: lastDeletedShipment.trackingNumber,
				userId: lastDeletedShipment.userId,
				position: lastDeletedShipment.position,
				createdAt: lastDeletedShipment.createdAt,
			})

			if (!res.data.success) {
				return
			}

			const createdShipment = shipmentRecordSchema.parse(
				res.data.newShipment
			)

			set((state) => {
				const newShipments = [...state.shipments]
				newShipments.splice(
					lastDeletedShipment.position,
					0,
					createdShipment
				)

				return {
					shipments: newShipments,
					deletedShipmentsStack: state.deletedShipmentsStack.slice(1),
				}
			})
		} catch (error) {
			console.error("Error undoing shipment delete", error)
		}
	},
}))
