"use client"

import AddInput from "./AddInput"
import DetailsModal from "./DetailsModal"
import { usePackageContext } from "@/app/(dashboard)/usePackageContext"
import { PackageInfo, courierEnum } from "@/app/api/package/typesAndSchemas"
import Card from "@/components/card/Card"
import Fuse from "fuse.js"
import Image from "next/image"
import React from "react"
import { AiOutlineSearch } from "react-icons/ai"
import { MdClose } from "react-icons/md"
import { z } from "zod"

export const packageSchema = z.object({
	id: z.number(),
	name: z.string(),
	trackingNumber: z.string().trim(),
	courier: courierEnum,
})

export interface TPackageWithInfo {
	pkg: TPackage
	info: PackageInfo
}

export type TPackage = z.infer<typeof packageSchema>

const Grid = () => {
	const { packages, dispatchPackages } = usePackageContext()

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

	const [selectedPackage, setSelectedPackage] =
		React.useState<TPackageWithInfo | null>(null)

	console.log(selectedPackage)

	return (
		<>
			<nav className="sticky w-full top-0 flex items-center justify-between z-40">
				<a href="/" className="min-w-[30px]">
					<Image src="/logo.svg" width={30} height={30} alt="logo" />
				</a>
				<AddInput dispatch={dispatchPackages} />
				<div className="flex relative items-center px-4 border outline-offset-2 focus-within:outline focus-within:outline-2 focus-within:outline-indigo-400 border-indigo-400/25 bg-[#110F1B] rounded-full min-w-[5rem] scale-75 md:scale-90 lg:scale-100">
					<AiOutlineSearch className="mr-1" />
					<input
						type="text"
						className="py-2 bg-transparent outline-none min-w-0"
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
			</nav>
			<div className="grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
				{packages.map((pkg) => (
					<Card
						key={pkg.id}
						pkg={pkg}
						dispatchPackages={dispatchPackages}
						inSearchResults={searchResults.includes(pkg)}
						setSelectedPackage={setSelectedPackage}
					/>
				))}
			</div>
			{selectedPackage && (
				<DetailsModal
					pkg={selectedPackage.pkg}
					pkgInfo={selectedPackage.info}
					dispatchPackages={dispatchPackages}
					handleClose={(open: boolean) => {
						if (!open) setSelectedPackage(null)
					}}
				/>
			)}
		</>
	)
}

export default Grid
