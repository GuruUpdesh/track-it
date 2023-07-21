"use client"

import DetailsModal from "./DetailsModal"
import { PackageInfo, courierEnum } from "@/app/api/package/typesAndSchemas"
import Card from "@/components/card/Card"
import { usePackageContext } from "@/context/packageContext/usePackageContext"
// import Fuse from "fuse.js"
import React from "react"
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

	// const [searchResults, setSearchResults] =
	// 	React.useState<TPackage[]>(packages)

	// React.useEffect(() => {
	// 	if (searchString === "") {
	// 		setSearchResults(packages)
	// 		return
	// 	}
	// 	const options = {
	// 		keys: ["name", "description"],
	// 		threshold: 0.3,
	// 	}
	// 	const fuse = new Fuse(packages, options)
	// 	const results = fuse.search(searchString)
	// 	setSearchResults(results.map((result) => result.item))
	// }, [searchString, packages])

	const [selectedPackage, setSelectedPackage] =
		React.useState<TPackageWithInfo | null>(null)

	return (
		<>
			<div className="grid gap-2 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-2 sm:mt-6">
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
