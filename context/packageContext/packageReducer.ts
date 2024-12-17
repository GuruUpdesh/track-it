import { TCourier } from "@/app/api/package/typesAndSchemas"
import { TPackage, packageSchema } from "@/components/DashboardGrid"
import { TIndexedPackage } from "../undoStackContext/useUndoStackContext"
import { getCopyString } from "@/utils/package"

export type PackageAction =
	| { type: "set"; packages: TPackage[] }
	| { type: "add"; new: TPackage }
	| { type: "put"; pkg: TIndexedPackage }
	| { type: "delete"; id: number }
	| { type: "batchDelete"; ids: string[] }
	| { type: "updateName"; id: number; name: string }
	| { type: "updateTrackingNumber"; id: number; trackingNumber: string }
	| { type: "updateCourier"; id: number; courier: TCourier }
	| { type: "duplicate"; id: number }
	| { type: "move"; direction: "left" | "right"; index: number }

function packageReducer(state: TPackage[], action: PackageAction): TPackage[] {
	switch (action.type) {
		case "set":
			return action.packages
		case "add":
			packageSchema.parse(action.new)
			return [...state, action.new]
		case "put":
			const { index, ...putPkg }: TIndexedPackage = action.pkg
			const newState = [...state]
			newState.splice(index, 0, putPkg)
			return newState
		case "delete":
			return state.filter((pkg) => pkg.id !== action.id)
		case "batchDelete":
			const ids = action.ids
			return state.filter((pkg) => !ids.includes(`${pkg.id}`))
		case "updateName":
			return state.map((pkg) =>
				pkg.id === action.id ? { ...pkg, name: action.name } : pkg
			)
		case "updateTrackingNumber":
			return state.map((pkg) =>
				pkg.id === action.id
					? { ...pkg, trackingNumber: action.trackingNumber }
					: pkg
			)
		case "updateCourier":
			return state.map((pkg) =>
				pkg.id === action.id ? { ...pkg, courier: action.courier } : pkg
			)
		case "duplicate":
			const pkg = state.find((pkg) => pkg.id === action.id)
			if (pkg) {
				return [
					...state,
					{
						id: Date.now(),
						name: getCopyString(pkg.name),
						trackingNumber: pkg.trackingNumber,
						courier: pkg.courier,
					},
				]
			}
			return state
		case "move":
			const direction = action.direction
			const startIndex = action.index
			const endIndex =
				direction === "left" ? startIndex - 1 : startIndex + 1
			if (endIndex < 0 || endIndex >= state.length) return state
			const result = Array.from(state)
			const [removed] = result.splice(startIndex, 1)
			result.splice(endIndex, 0, removed)
			return result
		default:
			return state
	}
}

export default packageReducer
