"use client"

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

const localStorageKey = "deletedShipmentsStack"

function saveToLocalStorage(data: TShipmentRecord[]) {
	localStorage.setItem(localStorageKey, JSON.stringify(data))
}

function getFromLocalStorage(): TShipmentRecord[] {
	const storedData = localStorage.getItem(localStorageKey)
	return storedData ? JSON.parse(storedData) : []
}

export const useShipments = create<ShipmentsState>()((set, get) => ({
	shipments: [],
	deletedShipmentsStack: getFromLocalStorage(),
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

			const updatedStack = [
				shipmentToDelete,
				...state.deletedShipmentsStack,
			]
			saveToLocalStorage(updatedStack)

			return {
				shipments: state.shipments.filter((s) => s.id !== id),
				deletedShipmentsStack: updatedStack,
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
				const updatedStack = state.deletedShipmentsStack.slice(1)
				saveToLocalStorage(updatedStack)

				const newShipments = [...state.shipments]
				newShipments.splice(
					lastDeletedShipment.position,
					0,
					createdShipment
				)

				return {
					shipments: newShipments,
					deletedShipmentsStack: updatedStack,
				}
			})
		} catch (error) {
			console.error("Error undoing shipment delete", error)
		}
	},
}))
