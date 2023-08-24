import { create } from "zustand"
import {
	TShipmentRecord,
	TShipmentRecordCreate,
	TShipmentRecordUpdate,
	shipmentRecordSchema,
} from "@/app/api/shipment/typesAndSchemas"
import shipmentAPI from "@/app/api/shipment/shipmentAPI"
import Fuse from "fuse.js"
import { toast } from "react-hot-toast"

export type TSortOption = "position" | "dateNewest" | "dateOldest"

export interface ShipmentsState {
	shipments: TShipmentRecord[]
	sortOption: TSortOption
	setSortOption: (sortOption: TSortOption) => void
	errorAlert: string | null
	displayedShipments: Set<number>
	deletedShipmentsStack: TShipmentRecord[]
	setShipments: (shipments: TShipmentRecord[]) => void
	addShipment: (shipment: TShipmentRecordCreate) => Promise<boolean>
	deleteShipment: (id: number) => void
	updateShipment: (shipment: TShipmentRecordUpdate) => void
	searchShipments: (searchTerm: string) => void
	undoLastDelete: () => void
}

export const useShipments = create<ShipmentsState>()((set, get) => ({
	shipments: [],
	sortOption: "position",
	setSortOption: (sortOption) => {
		set((state) => ({
			sortOption,
			shipments: sortShipments(sortOption, state.shipments),
		}))
	},
	errorAlert: null,
	setShipments: (shipments) => {
		set((state) => ({
			shipments: sortShipments(state.sortOption, shipments),
			displayedShipments: new Set(shipments.map((s) => s.id)),
		}))
	},
	displayedShipments: new Set(),
	addShipment: async (shipment) => {
		// set shipment position
		const { shipments } = get()
		if (shipment.position === -1) {
			shipment.position = shipments.length
		}

		// Check if position exists and shift
		if (shipment.position !== shipments.length) {
			for (const s of shipments) {
				if (s.position >= shipment.position) {
					s.position += 1
				}
			}
		}

		// create shipment
		const result = await shipmentAPI.createShipment(shipment)

		// check if shipment was created
		if (!result.success || !result.shipment) {
			toast.error("Error creating shipment")
			return false
		}

		const createdShipment = result.shipment

		// update state
		set((state) => ({
			shipments: sortShipments(state.sortOption, [
				...state.shipments,
				createdShipment,
			]),
		}))

		// show toast
		toast.success("Shipment created")
		return true
	},
	deleteShipment: async (id) => {
		set((state) => {
			const shipment = state.shipments.find((s) => s.id === id)

			if (!shipment) {
				return state
			}

			// delete the shipment from the state
			const updatedShipments = state.shipments.filter(
				(shipment) => shipment.id !== id
			)

			// adjust the position for the shipments that come after the deleted shipment.
			for (const s of updatedShipments) {
				if (s.position > shipment.position) {
					s.position -= 1
				}
			}

			return {
				shipments: sortShipments(state.sortOption, updatedShipments),
			}
		})

		// call the deleteShipment API to delete from backend.
		const result = await shipmentAPI.deleteShipment(id)
		if (!result.success || !result.shipment) {
			set(() => ({
				errorAlert: result.error
					? result.error
					: "Error deleting shipment",
			}))

			return false
		}

		// now that the shipment has been deleted from the backend, we can update the undo stack.
		const deletedShipment = result.shipment
		set((state) => ({
			deletedShipmentsStack: [
				deletedShipment,
				...state.deletedShipmentsStack,
			],
		}))

		// show success toast
		toast.success("Shipment deleted")
		return true
	},
	updateShipment: async (shipment) => {
		// Optimistic Update
		set((state) => {
			const updatedShipments = [...state.shipments]
			const indexToUpdate = updatedShipments.findIndex(
				(s) => s.id === shipment.id
			)
			if (indexToUpdate === -1) {
				return state
			}

			// Adjust positions if position changed
			if (shipment.position !== undefined) {
				const currentPos = updatedShipments[indexToUpdate].position
				const newPos = shipment.position

				if (newPos < currentPos) {
					// Moving upwards
					for (let i = newPos; i < currentPos; i++) {
						updatedShipments[i].position += 1
					}
				} else if (newPos > currentPos) {
					// Moving downwards
					for (let i = currentPos + 1; i <= newPos; i++) {
						updatedShipments[i].position -= 1
					}
				}
			}

			// Apply the shipment update
			updatedShipments[indexToUpdate] = {
				...updatedShipments[indexToUpdate],
				...shipment,
			}

			return {
				shipments: sortShipments(state.sortOption, updatedShipments),
			}
		})

		// Backend Update
		const result = await shipmentAPI.updateShipment(shipment)
		if (!result.success || !result.shipment) {
			// Here, we might want to rollback the state or fetch the list from the backend
			set(() => ({
				errorAlert: result.error
					? result.error
					: "Error updating shipment",
			}))
			return false
		}

		// Show success toast
		toast.success("Shipment updated")
		return true
	},
	searchShipments: (searchTerm) => {
		if (searchTerm === "") {
			console.log("searchTerm is empty")
			set((state) => ({
				displayedShipments: new Set(state.shipments.map((s) => s.id)),
			}))
			return
		}

		const fuzzySearchOptions = {
			keys: ["name"],
			threshold: 0.3,
		}

		const { shipments } = get()
		const fuse = new Fuse(shipments, fuzzySearchOptions)
		const searchResults = fuse.search(searchTerm)

		set(() => ({
			displayedShipments: new Set(searchResults.map((s) => s.item.id)),
		}))
	},
	deletedShipmentsStack: [],
	redoStack: [],
	undoLastDelete: async () => {
		try {
			const currentState = get()
			if (currentState.deletedShipmentsStack.length === 0) return
			const lastDeletedShipment = currentState.deletedShipmentsStack[0]

			for (const s of currentState.shipments) {
				if (s.position >= lastDeletedShipment.position) {
					s.position += 1
				}
			}

			const result = await shipmentAPI.createShipment(lastDeletedShipment)

			if (!result.success || !result.shipment) {
				return false
			}

			const createdShipment = shipmentRecordSchema.parse(result.shipment)

			set((state) => {
				const newShipments = [...state.shipments]
				newShipments.splice(
					lastDeletedShipment.position,
					0,
					createdShipment
				)

				return {
					shipments: sortShipments(state.sortOption, newShipments),
					deletedShipmentsStack: state.deletedShipmentsStack.slice(1),
				}
			})
		} catch (error) {
			console.error("Error undoing shipment delete", error)
		}
	},
}))

function sortShipments(sortOption: TSortOption, shipments: TShipmentRecord[]) {
	switch (sortOption) {
		case "position": {
			return [...shipments].sort((a, b) => a.position - b.position)
		}
		case "dateNewest": {
			return [...shipments].sort(
				(a, b) =>
					new Date(b.createdAt).getTime() -
					new Date(a.createdAt).getTime()
			)
		}
		case "dateOldest": {
			return [...shipments].sort(
				(a, b) =>
					new Date(a.createdAt).getTime() -
					new Date(b.createdAt).getTime()
			)
		}
	}
}
