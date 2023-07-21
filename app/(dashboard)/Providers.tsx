"use client"

import { TCourier } from "@/app/api/package/typesAndSchemas"
import { TPackage, packageSchema } from "@/components/Packages"
import useLocalStorage from "@/hooks/useLocalStorageHook"
import React, { createContext } from "react"

export type PackageAction =
	| { type: "add"; new: TPackage }
	| { type: "delete"; id: number }
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

export type PackageContextProps = {
	packages: TPackage[]
	dispatchPackages: React.Dispatch<PackageAction>
}

export const PackageContext = createContext<PackageContextProps>({
	packages: [],
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	dispatchPackages: () => {},
})

export function Providers({ children }: { children: React.ReactNode }) {
	const [packages, dispatchPackages] = useLocalStorage(
		"packages",
		[],
		packageReducer
	)

	return (
		<PackageContext.Provider value={{ packages, dispatchPackages }}>
			{children}
		</PackageContext.Provider>
	)
}
