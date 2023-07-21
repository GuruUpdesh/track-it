"use client"

import DetailsModal from "./DetailsModal"
import "./ui/undo/undo.css"
import { PackageInfo, courierEnum } from "@/app/api/package/typesAndSchemas"
import Card from "@/components/card/Card"
import { usePackageContext } from "@/context/packageContext/usePackageContext"
import { useUndoStackContext } from "@/context/undoStackContext/useUndoStackContext"
import * as Toast from "@radix-ui/react-toast"
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

type UndoNotificationProps = {
	open: boolean
	setOpen: (open: boolean) => void
}

const UndoNotification = ({ open, setOpen }: UndoNotificationProps) => {
	const { dispatchPackages } = usePackageContext()
	const { undoStack, dispatchUndoStack } = useUndoStackContext()
	return (
		<Toast.Provider swipeDirection="down" duration={3000}>
			<Toast.Root
				className="ToastRoot bg-[#080808] hover:bg-[#181818] border border-indigo-400/25 text-yellow-50/75 hover:text-yellow-50 font-semibold rounded-sm py-1 px-2 grid items-center"
				open={open}
				onOpenChange={setOpen}
			>
				<Toast.Action
					className="relative overflow-hidden"
					asChild
					altText="undo delete"
				>
					<>
						<button
							className="z-10"
							onClick={() => {
								if (undoStack.length === 0) return
								const pop = undoStack[undoStack.length - 1]
								dispatchUndoStack({ type: "pop" })
								if (pop) {
									dispatchPackages({ type: "add", new: pop })
								}
								setOpen(false)
							}}
						>
							Undo
						</button>
					</>
				</Toast.Action>
			</Toast.Root>
			<Toast.Viewport className="fixed bottom-3 right-[50%] translate-x-[50%] flex flex-col gap-3 max-w-[100vw] z-50" />
		</Toast.Provider>
	)
}

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

	const [undoNotificationOpen, setUndoNotificationOpen] =
		React.useState(false)

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
						triggerUndoNotification={() =>
							setUndoNotificationOpen(true)
						}
					/>
				))}
			</div>
			{selectedPackage && (
				<DetailsModal
					pkg={selectedPackage.pkg}
					pkgInfo={selectedPackage.info}
					dispatchPackages={dispatchPackages}
					setOpen={(open: boolean) => {
						if (!open) setSelectedPackage(null)
					}}
				/>
			)}
			<UndoNotification
				open={undoNotificationOpen}
				setOpen={setUndoNotificationOpen}
			/>
		</>
	)
}

export default Grid
