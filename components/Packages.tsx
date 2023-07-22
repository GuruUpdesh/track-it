"use client"

import DetailsModal from "./DetailsModal"
import "./ui/undo/undo.css"
import { PackageInfo, courierEnum } from "@/app/api/package/typesAndSchemas"
import Card from "@/components/card/Card"
import { usePackageContext } from "@/context/packageContext/usePackageContext"
import { useSearchContext } from "@/context/searchContext/useSearchContext"
import { useUndoStackContext } from "@/context/undoStackContext/useUndoStackContext"
import * as Toast from "@radix-ui/react-toast"
import Fuse from "fuse.js"
import React, { useEffect } from "react"
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
				className="ToastRoot grid items-center rounded-sm border border-indigo-400/25 bg-[#080808] px-2 py-1 font-semibold text-yellow-50/75 hover:bg-[#181818] hover:text-yellow-50"
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
			<Toast.Viewport className="fixed bottom-3 right-[50%] z-50 flex max-w-[100vw] translate-x-[50%] flex-col gap-3" />
		</Toast.Provider>
	)
}

const Grid = () => {
	const { packages, dispatchPackages } = usePackageContext()
	const { undoStack, dispatchUndoStack } = useUndoStackContext()
	const { search } = useSearchContext()
	const [searchResults, setSearchResults] = React.useState(new Set())

	React.useEffect(() => {
		if (search === "") {
			setSearchResults(new Set(packages.map((pkg) => pkg.id)))
			return
		}
		const options = {
			keys: ["name"],
			threshold: 0.3,
		}

		const fuse = new Fuse(packages, options)
		const results = fuse.search(search)
		setSearchResults(new Set(results.map((result) => result.item.id)))
	}, [search, packages])

	const [selectedPackage, setSelectedPackage] =
		React.useState<TPackageWithInfo | null>(null)

	const [undoNotificationOpen, setUndoNotificationOpen] =
		React.useState(false)

	// undo shortcut
	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if ((e.ctrlKey || e.metaKey) && e.key === "z") {
				console.log("undo")
				e.preventDefault()
				if (undoStack.length === 0) return
				const pop = undoStack[undoStack.length - 1]
				dispatchUndoStack({ type: "pop" })
				if (pop) {
					dispatchPackages({ type: "add", new: pop })
				}
			}
		}

		window.addEventListener("keydown", handleKeyDown)

		return () => {
			window.removeEventListener("keydown", handleKeyDown)
		}
	}, [undoStack, dispatchPackages, dispatchUndoStack])

	return (
		<>
			{packages.length === 0 && (
				<div className="mt-2 flex min-w-full flex-grow flex-col items-center gap-2 text-center text-yellow-50/50 sm:mt-6">
					<p>You are not tracking any shipments yet.</p>
					<button
						className="grid items-center rounded-sm bg-yellow-50/10 px-2 py-1 font-semibold text-yellow-50/75 hover:bg-yellow-50/25 hover:text-yellow-50"
						onClick={() => {
							const addInput = document.getElementById(
								"trackingNumber"
							) as HTMLInputElement
							addInput.focus()
						}}
					>
						Add
					</button>
				</div>
			)}
			{packages.length > 0 && (
				<div className="mt-2 grid grid-cols-1 gap-2 sm:mt-6 sm:grid-cols-2 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{packages.map((pkg) => {
						return (
							<Card
								key={pkg.id}
								pkg={pkg}
								dispatchPackages={dispatchPackages}
								setSelectedPackage={setSelectedPackage}
								triggerUndoNotification={() =>
									setUndoNotificationOpen(true)
								}
								inSearchResults={searchResults.has(pkg.id)}
							/>
						)
					})}
				</div>
			)}
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
