"use client"

import React from "react"
import Card from "@/components/Card/Card"
import useLocalStorage from "@/hooks/useLocalStorageHook"
import { TCourier } from "@/app/api/package/route"

export type TPackage = {
	id: number
	name: string
	trackingNumber: string
	courier: TCourier
}

export type PackageAction =
	| { type: "add" }
	| { type: "delete"; id: number }
	| { type: "updateName"; id: number; name: string }
	| { type: "updateTrackingNumber"; id: number; trackingNumber: string }
	| { type: "updateCourier"; id: number; courier: TCourier }

function packageReducer(state: TPackage[], action: PackageAction): TPackage[] {
	switch (action.type) {
		case "add":
			return [
				...state,
				{
					id: Date.now(),
					name: "",
					trackingNumber: "",
					courier: "ups",
				},
			]
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
		default:
			return state
	}
}

const Grid = () => {
	const [packages, dispatchPackages] = useLocalStorage("packages", [], packageReducer)

	return (
		<div>
			<button onClick={() => dispatchPackages({ type: "add" })}>
				add
			</button>
			<div className="grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{packages.map((pkg) => (
					<Card key={pkg.id} pkg={pkg} dispatchPackages={dispatchPackages} />
				))}
			</div>
		</div>
	)
}

export default Grid
