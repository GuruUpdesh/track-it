"use client"

import React, {useReducer} from "react"
import Card from "@/components/Card/Card"
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
	| { type: "duplicate"; id: number }

function packageReducer(state: TPackage[], action: PackageAction): TPackage[] {
	switch (action.type) {
		case "add":
			return [
				...state,
				{
					id: Date.now(),
					name: "",
					trackingNumber: "tracking number",
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

const testPackages: TPackage[] = [
    {
      id: 1,
      name: "Test Package 1",
      trackingNumber: "SHIPPO_PRE_TRANSIT",
      courier: "shippo"
    },
    {
      id: 2,
      name: "Test Package 2",
      trackingNumber: "SHIPPO_TRANSIT",
      courier: "shippo"
    },
    {
      id: 3,
      name: "Test Package 3",
      trackingNumber: "SHIPPO_DELIVERED",
      courier: "shippo"
    },
    {
      id: 4,
      name: "Test Package 4",
      trackingNumber: "SHIPPO_RETURNED",
      courier: "shippo"
    },
    {
      id: 5,
      name: "Test Package 5",
      trackingNumber: "SHIPPO_FAILURE",
      courier: "shippo"
    },
    {
      id: 6,
      name: "Test Package 6",
      trackingNumber: "SHIPPO_UNKNOWN",
      courier: "shippo"
    }
  ];

const Grid = () => {
    const [packages, dispatchPackages] = useReducer(packageReducer, testPackages)
	return (
		<div>
			<button onClick={() => dispatchPackages({ type: "add" })}>
				add
			</button>
			<div className="grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{packages.map((pkg) => (
					<Card
						key={pkg.id}
						pkg={pkg}
						dispatchPackages={dispatchPackages}
					/>
				))}
			</div>
		</div>
	)
}

export default Grid