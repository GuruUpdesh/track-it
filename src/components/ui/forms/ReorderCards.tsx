import React, { useState, useEffect } from "react"
import { useModalContext } from "../modal/Modal"
import { usePackageContext } from "@/context/packageContext/usePackageContext"
import { TPackage } from "@/components/DashboardGrid"
import {
	DragDropContext,
	Droppable,
	Draggable,
	DropResult,
	DroppableProvided,
	DraggableProvided,
	DraggableStateSnapshot,
} from "@hello-pangea/dnd"
import CancelButton from "../modal/CancelButton"
import SaveButton from "../modal/SaveButton"
import { BsDot } from "react-icons/bs"
import { MdDragIndicator } from "react-icons/md"
import { getCourier } from "@/utils/courier"
import ReactDOM from "react-dom"
import { cn } from "@/lib/utils"
import { toast } from "react-hot-toast"

const ReorderCards = () => {
	const { setOpen } = useModalContext()
	const { packages, dispatchPackages } = usePackageContext()
	const [tempPackages, setTempPackages] = useState<TPackage[]>(packages)
	const [hasChanged, setHasChanged] = useState(false)

	useEffect(() => {
		setTempPackages(packages)
		setHasChanged(false)
	}, [open, packages])

	function handleDragEnd(result: DropResult) {
		if (!result.destination) return
		const items = Array.from(tempPackages)
		const [reorderedItem] = items.splice(result.source.index, 1)
		items.splice(result.destination.index, 0, reorderedItem)
		setTempPackages(items)
		setHasChanged(true)
	}

	let portal: HTMLElement | null =
		document.querySelector(".your-portal-class")

	if (!portal) {
		portal = document.createElement("div")
		portal.classList.add("your-portal-class")
		document.body.appendChild(portal)
	}

	return (
		<form
			onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
				e.preventDefault()
				dispatchPackages({
					type: "set",
					packages: tempPackages,
				})
				setOpen(false)
				toast.success("Order updated")
			}}
		>
			<h1 className="text-lg font-bold">Reorder your Packages</h1>
			<p className="mb-3 border-b border-b-white/10 pb-3 text-sm text-yellow-50/75">
				Drag and drop the cards to set their order. Then save the
				results.
			</p>
			<DragDropContext onDragEnd={handleDragEnd}>
				<Droppable droppableId="reorder-modal">
					{(droppableProvided: DroppableProvided) => (
						<div
							ref={droppableProvided.innerRef}
							className="mb-3 max-h-96 overflow-auto"
						>
							{tempPackages.map(
								(pkg: TPackage, index: number) => (
									<Draggable
										key={`${index}`}
										draggableId={`${index}`}
										index={index}
									>
										{(
											draggableProvided: DraggableProvided,
											draggableSnapshot: DraggableStateSnapshot
										) => {
											const usePortal: boolean =
												draggableSnapshot.isDragging
											const child = (
												<div
													className={cn(
														"group relative mb-2  ml-3 max-w-[350px] rounded-sm border border-indigo-400/25 bg-[#110F1B] px-4 py-2",
														draggableSnapshot.isDragging
															? "bg-[#181527]"
															: ""
													)}
													ref={
														draggableProvided.innerRef
													}
													{...draggableProvided.draggableProps}
													{...draggableProvided.dragHandleProps}
												>
													<MdDragIndicator className="absolute left-[-1rem] top-[50%] translate-y-[-50%] opacity-0 transition-opacity group-hover:opacity-75" />
													<h1
														className="whitespace-nowrap text-left text-lg tracking-tighter text-yellow-50"
														style={{
															WebkitMaskImage:
																"linear-gradient(to right, black 90%, transparent)",
														}}
													>
														{pkg.name}
													</h1>
													<div className="flex items-center text-yellow-50/50">
														<p>
															{
																getCourier(
																	pkg.courier
																).name
															}
														</p>
														<BsDot />
														<p>
															{pkg.trackingNumber}
														</p>
													</div>
												</div>
											)
											if (!usePortal || !portal) {
												return child
											}
											return ReactDOM.createPortal(
												child,
												portal
											)
										}}
									</Draggable>
								)
							)}
							{droppableProvided.placeholder}
						</div>
					)}
				</Droppable>
			</DragDropContext>
			<div className="mt-3 flex items-center justify-between border-t  border-t-white/10 pt-3">
				<CancelButton />
				<SaveButton disabled={!hasChanged} />
			</div>
		</form>
	)
}

export default ReorderCards
