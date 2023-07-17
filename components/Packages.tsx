"use client"

import { TCourier, courierEnum } from "@/app/api/package/typesAndSchemas"
import Card from "@/components/Card/Card"
import useLocalStorage from "@/hooks/useLocalStorageHook"
import Image from "next/image"
import React from "react"
import { z } from "zod"

import AddInput from "./AddInput"

export const packageSchema = z.object({
	id: z.number(),
	name: z.string(),
	trackingNumber: z.string().trim(),
	courier: courierEnum,
})

export type TPackage = z.infer<typeof packageSchema>

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

const Grid = () => {
	const [packages, dispatchPackages] = useLocalStorage(
		"packages",
		[],
		packageReducer
	)

	return (
		<div>
			<div className="flex items-center justify-between mb-6">
				<a href="/">
					<Image src="/logo.svg" width={30} height={30} alt="logo" />
				</a>
				<AddInput dispatch={dispatchPackages} />
			</div>
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
