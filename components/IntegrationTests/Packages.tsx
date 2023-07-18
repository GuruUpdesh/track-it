"use client"

import { TCourier } from "@/app/api/package/typesAndSchemas"
import Card from "@/components/Card/Card"
import React, { useReducer } from "react"

import { TPackageWithInfo } from "../Packages"

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
		name: "Test Pre-Transit Package",
		trackingNumber: "SHIPPO_PRE_TRANSIT",
		courier: "shippo",
	},
	{
		id: 2,
		name: "Test Transit Package",
		trackingNumber: "SHIPPO_TRANSIT",
		courier: "shippo",
	},
	{
		id: 3,
		name: "Test Delivered Package",
		trackingNumber: "SHIPPO_DELIVERED",
		courier: "shippo",
	},
	{
		id: 4,
		name: "Test Returned Package",
		trackingNumber: "SHIPPO_RETURNED",
		courier: "shippo",
	},
	{
		id: 5,
		name: "Test Failure Package",
		trackingNumber: "SHIPPO_FAILURE",
		courier: "shippo",
	},
	{
		id: 6,
		name: "Test Unknown Package",
		trackingNumber: "SHIPPO_UNKNOWN",
		courier: "shippo",
	},
	{
		id: 7,
		name: "Error Package",
		trackingNumber: "INVALID",
		courier: "ups",
	},
]

const Grid = () => {
	const [packages, dispatchPackages] = useReducer(
		packageReducer,
		testPackages
	)

	//eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [selectedPackage, setSelectedPackage] =
		React.useState<TPackageWithInfo | null>(null)

	return (
		<div>
			<div className="grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{packages.map((pkg) => (
					<Card
						key={pkg.id}
						pkg={pkg}
						dispatchPackages={dispatchPackages}
						inSearchResults={true}
						setSelectedPackage={setSelectedPackage}
					/>
				))}
			</div>
		</div>
	)
}

export default Grid
