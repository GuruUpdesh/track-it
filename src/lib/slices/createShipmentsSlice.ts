import { create } from "zustand"
import { TShipmentRecord } from "../../app/api/shipment/typesAndSchemas"

export interface ShipmentsState {
	shipments: TShipmentRecord[]
	updateShipments: (shipments: TShipmentRecord[]) => void
	addShipment: (shipment: TShipmentRecord) => void
	deleteShipment: (id: number) => void
	updateShipment: (shipment: TShipmentRecord) => void
}

export const useShipments = create<ShipmentsState>()((set) => ({
	shipments: [],
	updateShipments: (shipments) => set(() => ({ shipments: shipments })),
	addShipment: (shipment) =>
		set((state) => ({ shipments: [...state.shipments, shipment] })),
	deleteShipment: (id) =>
		set((state) => ({
			shipments: state.shipments.filter((s) => s.id !== id),
		})),
	updateShipment: (shipment) =>
		set((state) => ({
			shipments: state.shipments.map((s) =>
				s.id === shipment.id ? shipment : s
			),
		})),
}))
