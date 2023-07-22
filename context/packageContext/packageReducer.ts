import { TCourier } from "@/app/api/package/typesAndSchemas"
import { TPackage, packageSchema } from "@/components/Packages"

export type PackageAction =
	| { type: "add"; new: TPackage }
	| { type: "delete"; id: number }
	| { type: "batchDelete"; ids: string[] }
	| { type: "updateName"; id: number; name: string }
	| { type: "updateTrackingNumber"; id: number; trackingNumber: string }
	| { type: "updateCourier"; id: number; courier: TCourier }
	| { type: "duplicate"; id: number }

function packageReducer(state: TPackage[], action: PackageAction): TPackage[] {
	switch (action.type) {
		case "add":
			packageSchema.parse(action.new)
			return [...state, action.new]
		case "delete":
			return state.filter((pkg) => pkg.id !== action.id)
		case "batchDelete":
			const ids = action.ids
			console.log("batch delete", ids)
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
						name: pkg.name,
						trackingNumber: pkg.trackingNumber,
						courier: pkg.courier,
					},
				]
			}
			return state
		default:
			return state
	}
}

export default packageReducer
