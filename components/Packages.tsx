"use client"

import { TCourier, courierEnum } from "@/app/api/package/typesAndSchemas"
import Card from "@/components/Card/Card"
import useLocalStorage from "@/hooks/useLocalStorageHook"
import Fuse from "fuse.js"
import Image from "next/image"
import React from "react"
import { AiOutlineSearch } from "react-icons/ai"
import { MdClose } from "react-icons/md"
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

	const [searchString, setSearchString] = React.useState("")
	const [searchResults, setSearchResults] =
		React.useState<TPackage[]>(packages)

	React.useEffect(() => {
		if (searchString === "") {
			setSearchResults(packages)
			return
		}
		const options = {
			keys: ["name", "description"],
			threshold: 0.3,
		}
		const fuse = new Fuse(packages, options)
		const results = fuse.search(searchString)
		setSearchResults(results.map((result) => result.item))
	}, [searchString, packages])

	return (
		<div>
			<div className="flex items-center justify-between mb-6">
				<a href="/">
					<Image src="/logo.svg" width={30} height={30} alt="logo" />
				</a>
				<AddInput dispatch={dispatchPackages} />
				<div className="flex relative items-center px-4 border focus-within:outline focus-within:outline-1 focus-within:outline-indigo-300/75 border-indigo-400/25 bg-[#110F1B] rounded-full">
					<AiOutlineSearch className="mr-1" />
					<input
						type="text"
						className="py-2 bg-transparent outline-none"
						placeholder="Search"
						value={searchString}
						onChange={(e) => setSearchString(e.target.value)}
					/>
					{searchString && (
						<button
							className="absolute right-4 bg-[#110F1B] rounded-full p-1"
							onClick={() => setSearchString("")}
						>
							<MdClose />
						</button>
					)}
				</div>
			</div>
			<div className="grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{searchResults.map((pkg) => (
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
