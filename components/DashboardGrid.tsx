"use client"

import DetailsModal from "@/components/tracking/details/DetailsModal"
import { TPackageInfo, courierEnum } from "@/app/api/package/typesAndSchemas"
import Card from "@/components/tracking/card/Card"
import { usePackageContext } from "@/context/packageContext/usePackageContext"
import { useSearchContext } from "@/context/searchContext/useSearchContext"
import {
	undo,
	useUndoStackContext,
} from "@/context/undoStackContext/useUndoStackContext"
import Fuse from "fuse.js"
import React, { useEffect, useReducer } from "react"
import Selecto from "react-selecto"
import { z } from "zod"
import * as ContextMenu from "@radix-ui/react-context-menu"
import { AiOutlineDelete } from "react-icons/ai"
import { useSelectContext } from "@/context/selectContext/useSelectContext"
import packageReducer from "@/context/packageContext/packageReducer"
import Filters from "./ui/Filters"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export const packageSchema = z.object({
	id: z.number(),
	name: z.string(),
	trackingNumber: z.string().trim(),
	courier: courierEnum,
})

export interface TPackageWithInfo {
	pkg: TPackage
	info: TPackageInfo
}

export type TPackage = z.infer<typeof packageSchema>

export type TFilters = {
	couriers: string[]
	status: string[]
}

type Props = {
	packagesOverride?: TPackage[]
}

const DashboardGrid = ({ packagesOverride }: Props) => {
	let { packages, dispatchPackages } = usePackageContext()

	// this is an issue because the hook is called conditionally
	if (packagesOverride) {
		//eslint-disable-next-line
		;[packages, dispatchPackages] = useReducer(
			packageReducer,
			packagesOverride
		)
	}

	const { dispatchUndoStack } = useUndoStackContext()
	const { search } = useSearchContext()
	const [searchResults, setSearchResults] = React.useState(new Set())
	const [selectedIds, setSelectedIds] = React.useState<string[]>([])

	const [contextOpen, setContextOpen] = React.useState(false)
	const { enabled } = useSelectContext()

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
	const [detailsModalOpen, setDetailsModalOpen] = React.useState(false)
	React.useEffect(() => {
		setDetailsModalOpen(true)
	}, [selectedPackage])

	// undo shortcut
	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if ((e.ctrlKey || e.metaKey) && e.key === "z") {
				e.preventDefault()
				undo(dispatchUndoStack, dispatchPackages)
			}
		}

		window.addEventListener("keydown", handleKeyDown)
		return () => {
			window.removeEventListener("keydown", handleKeyDown)
		}
	}, [dispatchPackages, dispatchUndoStack])

	// select all shortcut
	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (!enabled) return
			if ((e.ctrlKey || e.metaKey) && e.key === "a") {
				e.preventDefault()
				if (selectedIds.length === packages.length) {
					setSelectedIds([])
					return
				}
				setSelectedIds(packages.map((pkg) => `${pkg.id}`))
			}
		}

		window.addEventListener("keydown", handleKeyDown)
		return () => {
			window.removeEventListener("keydown", handleKeyDown)
		}
	}, [packages, selectedIds, enabled])

	const [sortOption, setSortOption] = React.useState("manual")

	const sortedPackages = React.useMemo(() => {
		if (sortOption === "newest") {
			return [...packages].sort((a, b) => b.id - a.id)
		}
		if (sortOption === "oldest") {
			return [...packages].sort((a, b) => a.id - b.id)
		}
		return packages
	}, [sortOption, packages])

	const [filters, setFilters] = React.useState<TFilters>({
		couriers: [],
		status: [],
	})

	const gridRef = React.useRef<HTMLDivElement>(null)

	const isRenderingPlaceholder = React.useMemo(() => {
		if (packages.length === 0) return true
		else if (searchResults.size === 0) return true
		else if (
			filters.couriers.length > 0 &&
			sortedPackages.filter((pkg) =>
				filters.couriers.includes(pkg.courier)
			).length === 0
		)
			return true
		return false
	}, [packages, filters, sortedPackages, searchResults])

	const renderMessages = React.useCallback(() => {
		if (packages.length === 0) {
			return (
				<div className="flex flex-col items-center gap-2">
					<p>You are not tracking any shipments yet.</p>
					<button
						onClick={() => {
							const addInput = document.getElementById(
								"trackingNumber"
							) as HTMLInputElement
							addInput.focus()
						}}
						className="rounded-sm bg-indigo-400 px-4 py-1 font-semibold text-black"
					>
						Get Started
					</button>
				</div>
			)
		} else if (searchResults.size === 0) {
			return (
				<div>
					<p>Can not find anything that matches {search}.</p>
				</div>
			)
		} else if (
			filters.couriers.length > 0 &&
			sortedPackages.filter((pkg) =>
				filters.couriers.includes(pkg.courier)
			).length === 0
		) {
			return (
				<div>
					<p>No packages match your filters.</p>
				</div>
			)
		}
		return <></>
	}, [packages, filters, sortedPackages, searchResults, search])

	return (
		<>
			<div className="mt-3 flex w-full items-center justify-between border-b border-indigo-400/25 pb-3">
				<h1 className="text-2xl font-semibold tracking-tight">
					Dashboard
				</h1>
				<Filters
					sortOption={sortOption}
					setSortOption={setSortOption}
					filters={filters}
					setFilters={setFilters}
				/>
			</div>
			<ContextMenu.Root onOpenChange={setContextOpen}>
				<ContextMenu.Trigger disabled={selectedIds.length < 1}>
					<div
						ref={gridRef}
						className={cn(
							"grid-container mb-5 mt-2 grid grid-cols-1 gap-4 sm:mt-6 sm:grid-cols-2 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
							{
								"relative max-h-[calc(100vh-250px)] overflow-hidden":
									isRenderingPlaceholder,
							}
						)}
					>
						{sortedPackages.map((pkg, index) => {
							return (
								<Card
									key={pkg.id}
									pkg={pkg}
									dispatchPackages={dispatchPackages}
									setSelectedPackage={setSelectedPackage}
									inSearchResults={
										searchResults.has(pkg.id) &&
										(filters.couriers.length === 0 ||
											filters.couriers.includes(
												pkg.courier
											))
									}
									disableReorder={sortOption !== "manual"}
									statusFilter={filters.status}
									isSelected={selectedIds.includes(
										`${pkg.id}`
									)}
									packagesLength={packages.length}
									index={index}
								/>
							)
						})}
						{isRenderingPlaceholder && (
							<>
								<div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-full bg-gradient-to-b from-transparent to-black"></div>
								<div className="absolute left-[50%] top-3 z-20 translate-x-[-50%] rounded-md border border-indigo-400/50 bg-black p-6 shadow-lg">
									{renderMessages()}
								</div>
								{new Array(50).fill(0).map((value, index) => (
									<motion.div
										initial={{ opacity: 0, y: 50 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{
											duration: 0.5,
											delay: index * 0.03,
											ease: [0.075, 0.82, 0.165, 1],
										}}
										key={index}
										className="relative h-[125px] w-[325px] border border-indigo-400/25 bg-[#110F1B] opacity-50"
									>
										<div className="absolute bottom-0 h-[50%] w-full border-t border-indigo-400/25 bg-black/50"></div>
									</motion.div>
								))}
								<div className="invisible">
									<Card
										key={-1}
										pkg={{
											id: -1,
											name: "",
											trackingNumber: "",
											courier: "ups",
										}}
										dispatchPackages={dispatchPackages}
										setSelectedPackage={setSelectedPackage}
										inSearchResults={true}
										disableReorder={false}
										statusFilter={filters.status}
										isSelected={false}
										packagesLength={packages.length}
										index={0}
										invisible={true}
									/>
								</div>
							</>
						)}
					</div>
				</ContextMenu.Trigger>
				<ContextMenu.Portal>
					<ContextMenu.Content className="DropdownMenu-content text-center">
						<ContextMenu.Item
							className="DropdownMenu-item bg-red-500/25 text-red-400"
							onSelect={() => {
								dispatchPackages({
									type: "batchDelete",
									ids: selectedIds,
								})
								setSelectedIds([])
							}}
						>
							<AiOutlineDelete className="absolute left-4" />
							Delete Selected
						</ContextMenu.Item>
					</ContextMenu.Content>
				</ContextMenu.Portal>
			</ContextMenu.Root>
			{enabled && (
				<Selecto
					selectableTargets={[".card"]}
					hitRate={5}
					onSelect={(e) => {
						if (contextOpen) return
						const selected = e.selected
						const selectedIds = selected.map((el) => el.id)
						setSelectedIds(selectedIds)
					}}
					selectByClick={false}
					dragContainer={null}
					boundContainer={gridRef.current}
					toggleContinueSelect={"shift"}
				/>
			)}
			{selectedPackage && (
				<DetailsModal
					pkg={selectedPackage.pkg}
					pkgInfo={selectedPackage.info}
					dispatchPackages={dispatchPackages}
					open={detailsModalOpen}
					setOpen={setDetailsModalOpen}
				/>
			)}
		</>
	)
}

export default DashboardGrid
