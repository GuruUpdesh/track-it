"use client"

import { TPackage, TPackageWithInfo } from "../../DashboardGrid"
import Tooltip from "../../ui/Tooltip"
import "./styles/menu.css"
import "./styles/modal.css"
import {
	PackageInfo,
	TCourier,
	TrackingHistory,
} from "@/app/api/package/typesAndSchemas"
import { PackageAction } from "@/context/packageContext/packageReducer"
import { useUndoStackContext } from "@/context/undoStackContext/useUndoStackContext"
import useTextOverflow from "@/hooks/useTextOverflow"
import {
	couriers,
	getCourierIconFromCode,
	getCourierStringFromCode,
	getCourierUrlsFromTrackingNumber,
} from "@/utils/courier"
import { formatDate, formatRelativeDate, getTimeFromDate } from "@/utils/date"
import { estimateProgress } from "@/utils/package"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import axios from "axios"
import { motion } from "framer-motion"
import React, { useEffect, useState } from "react"
import {
	AiOutlineDelete,
	AiOutlineEdit,
	AiOutlineMail,
	AiOutlineNumber,
	AiOutlineOrderedList,
} from "react-icons/ai"
import { BiCopy, BiExpand } from "react-icons/bi"
// todo transition to radix-ui/react-icons
import { BsCheckLg, BsChevronRight } from "react-icons/bs"
import { MdMoreVert, MdOutlineEditNote, MdOutlineExplore } from "react-icons/md"
import { TbEditCircle } from "react-icons/tb"
import Skeleton, { SkeletonTheme } from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import HistoryLine from "../HistoryLine"
import CardImage from "./CardImage"
import { usePackageContext } from "@/context/packageContext/usePackageContext"
import {
	DragDropContext,
	Droppable,
	Draggable,
	DropResult,
	DroppableProvided,
	DraggableProvided,
	DraggableStateSnapshot,
} from "@hello-pangea/dnd"
import ReactDOM from "react-dom"
import Modal from "../../ui/modal/Modal"
import EditTrackingNumber from "../../ui/forms/EditTrackingNumber"

type CardDropdownProps = {
	pkg: TPackage
	menuFunctions: {
		openDetailedView: () => void
		copyTrackingNumber: () => void
		edit: {
			name: () => void
			trackingNumber: () => void
			courier: (courier: TCourier) => void
		}
		reorder: () => void
		duplicate: () => void
		delete: () => void
	}
	open: boolean
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const CardDropdownMenu = ({
	pkg,
	menuFunctions,
	open,
	setOpen,
}: CardDropdownProps) => {
	return (
		<DropdownMenu.Root open={open} onOpenChange={setOpen}>
			<DropdownMenu.Trigger asChild>
				<button
					aria-label="Package Controls"
					className={
						"aspect-square cursor-pointer rounded-full p-2 text-yellow-50 outline-none hover:bg-yellow-50/10 focus:bg-yellow-50/10" +
						(open ? " bg-yellow-50/10" : "")
					}
				>
					<MdMoreVert />
				</button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Portal>
				<DropdownMenu.Content
					className="DropdownMenu-content text-center"
					onCloseAutoFocus={(e) => e.preventDefault()}
				>
					<DropdownMenu.Item
						onSelect={menuFunctions.openDetailedView}
						className="DropdownMenu-item"
					>
						<BiExpand className="absolute left-4" />
						Open Detailed View
					</DropdownMenu.Item>
					<DropdownMenu.Separator className="m-1 h-[1px] bg-indigo-400/25" />
					<DropdownMenu.Item
						onSelect={menuFunctions.copyTrackingNumber}
						className="DropdownMenu-item"
					>
						<AiOutlineNumber className="absolute left-4" />
						Copy Tracking Number
					</DropdownMenu.Item>
					<a
						href={
							getCourierUrlsFromTrackingNumber(
								pkg.trackingNumber
							)[0]
						}
						target="_blank"
					>
						<DropdownMenu.Item className="DropdownMenu-item">
							<MdOutlineExplore className="absolute left-4" />
							Open Courier Website
						</DropdownMenu.Item>
					</a>
					<DropdownMenu.Separator className="m-1 h-[1px] bg-indigo-400/25" />
					<DropdownMenu.Sub>
						<DropdownMenu.SubTrigger className="DropdownMenu-item">
							<MdOutlineEditNote className="absolute left-4" />
							Edit
							<div className="float-right">
								<BsChevronRight />
							</div>
						</DropdownMenu.SubTrigger>
						<DropdownMenu.Portal>
							<DropdownMenu.SubContent
								className="DropdownMenu-content"
								sideOffset={5}
								alignOffset={-5}
							>
								<DropdownMenu.Item
									onSelect={menuFunctions.edit.name}
									className="DropdownMenu-item"
								>
									<AiOutlineEdit className="absolute left-4" />
									Name
								</DropdownMenu.Item>
								<DropdownMenu.Item
									onSelect={menuFunctions.edit.trackingNumber}
									className="DropdownMenu-item"
								>
									<TbEditCircle className="absolute left-4" />
									Tracking Number
								</DropdownMenu.Item>
								<DropdownMenu.Sub>
									<DropdownMenu.SubTrigger className="DropdownMenu-item bg-orange-500/25 text-orange-400">
										<AiOutlineMail className="absolute left-4" />
										Override Courier
										<div className="float-right">
											<BsChevronRight />
										</div>
									</DropdownMenu.SubTrigger>
									<DropdownMenu.Portal>
										<DropdownMenu.SubContent
											className="DropdownMenu-content"
											sideOffset={5}
											alignOffset={-5}
										>
											<DropdownMenu.RadioGroup
												value={pkg.courier}
												onValueChange={(value) =>
													menuFunctions.edit.courier(
														value as TCourier
													)
												}
											>
												<DropdownMenu.Label className="p-2 text-xs text-orange-400">
													Warning this could cause
													errors!
												</DropdownMenu.Label>
												{Object.keys(couriers).map(
													(courier) => (
														<DropdownMenu.RadioItem
															key={courier}
															className="DropdownMenu-item"
															value={courier}
														>
															<DropdownMenu.ItemIndicator className="absolute left-4">
																<BsCheckLg />
															</DropdownMenu.ItemIndicator>
															{getCourierStringFromCode(
																courier
															)}
														</DropdownMenu.RadioItem>
													)
												)}
											</DropdownMenu.RadioGroup>
										</DropdownMenu.SubContent>
									</DropdownMenu.Portal>
								</DropdownMenu.Sub>
							</DropdownMenu.SubContent>
						</DropdownMenu.Portal>
					</DropdownMenu.Sub>
					<DropdownMenu.Item
						onSelect={menuFunctions.reorder}
						className="DropdownMenu-item"
					>
						<AiOutlineOrderedList className="absolute left-4" />
						Reorder
					</DropdownMenu.Item>
					<DropdownMenu.Separator className="m-1 h-[1px] bg-indigo-400/25" />
					<DropdownMenu.Item
						onSelect={menuFunctions.reorder}
						className="DropdownMenu-item"
					>
						<BiCopy className="absolute left-4" />
						Duplicate
					</DropdownMenu.Item>
					<DropdownMenu.Item
						onSelect={menuFunctions.delete}
						className="DropdownMenu-item bg-red-500/25 text-red-400"
					>
						<AiOutlineDelete className="absolute left-4" />
						Delete
					</DropdownMenu.Item>
					<DropdownMenu.Arrow className="fill-indigo-400/75" />
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	)
}

type EditTrackingNumberModalProps = {
	open: boolean
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
	pkg: TPackage
}

export const EditTrackingNumberModal = ({
	open,
	setOpen,
	pkg,
}: EditTrackingNumberModalProps) => {
	return (
		<Modal open={open} setOpen={setOpen}>
			<div className="mb-4 flex items-center justify-between">
				<h1 className="text-lg font-bold">Edit Tracking Number</h1>
			</div>
			<EditTrackingNumber pkg={pkg} setOpen={setOpen} />
		</Modal>
	)
}

type ReorderModalProps = {
	open: boolean
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

let portal: HTMLElement | null = document.querySelector(".your-portal-class") // change to the actual class if you already have a portal div

// if there's no portal already, we will create one
if (!portal) {
	portal = document.createElement("div")
	portal.classList.add("your-portal-class") // change to desired class name
	document.body.appendChild(portal)
}

export const ReorderModal = ({ open, setOpen }: ReorderModalProps) => {
	const { packages } = usePackageContext()
	return (
		<Modal open={open} setOpen={setOpen}>
			<div className="absolute z-50">
				<DragDropContext
					onDragEnd={(result: DropResult) => {
						console.log(result)
					}}
				>
					<Droppable droppableId="droppable">
						{(droppableProvided: DroppableProvided) => (
							<div
								ref={droppableProvided.innerRef}
								className="relative z-50 border border-white"
							>
								{packages.map(
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
														className="relative z-50 my-1 bg-white/10"
														ref={
															draggableProvided.innerRef
														}
														{...draggableProvided.draggableProps}
														{...draggableProvided.dragHandleProps}
													>
														{pkg.name}
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
			</div>
		</Modal>
	)
}

type Props = {
	pkg: TPackage
	dispatchPackages: React.Dispatch<PackageAction>
	setSelectedPackage: (pkg: TPackageWithInfo) => void
	triggerUndoNotification: () => void
	inSearchResults: boolean
	isSelected: boolean
}

const Card = ({
	pkg,
	dispatchPackages,
	setSelectedPackage,
	triggerUndoNotification,
	inSearchResults,
	isSelected,
}: Props) => {
	const { dispatchUndoStack } = useUndoStackContext()
	const [packageInfo, setPackageInfo] = useState<PackageInfo | null>(null)
	const [menuOpen, setMenuOpen] = useState(false)
	const [editName, setEditName] = useState(false)
	const [editNameValue, setEditNameValue] = useState(pkg.name)
	const [openTrackingNumberModal, setOpenEditTrackingNumberModal] =
		useState(false)
	const [openReorderModal, setOpenReorderModal] = useState(false)
	const [error, setError] = useState<null | string>(null)
	// todo fix the journey percent resets after a state change
	const journeyPercentRef = React.useRef<HTMLDivElement>(null)
	const nameInputRef = React.useRef<HTMLInputElement>(null)

	useEffect(() => {
		const getPackageInfo = async () => {
			axios
				.get(`/api/package`, {
					params: {
						trackingNumber: pkg.trackingNumber,
						courier: pkg.courier,
					},
				})
				.then((res) => {
					const packageInfo = res.data.packageInfo as PackageInfo
					if (journeyPercentRef.current) {
						journeyPercentRef.current.style.width = `${estimateProgress(
							packageInfo.eta,
							packageInfo.status.status,
							packageInfo.trackingHistory[0].date
						)}%`
						journeyPercentRef.current.style.opacity = "1"
					}
					setPackageInfo(packageInfo)
					setError(null)
				})
				.catch((error) => {
					setPackageInfo(null)
					if (error.response.status === 400) {
						setError(error.response.data.error)
					} else {
						setError("Something went wrong")
					}
				})
		}
		getPackageInfo()
	}, [pkg.trackingNumber, pkg.courier])

	function renderHistory(index: number) {
		let historyItem: TrackingHistory | null = null

		if (error) {
			return (
				<div className="flex flex-col items-center justify-center px-2 py-1">
					<p className="text-left text-xs tracking-tighter text-red-400/75">
						Error!
					</p>
					<p className="text-left text-xs tracking-tighter text-yellow-50/25">
						{error}
					</p>
				</div>
			)
		}

		if (!packageInfo) {
			return (
				<SkeletonTheme
					baseColor="#1e1b4b"
					highlightColor="#312e81"
					borderRadius="2rem"
				>
					<div className="z-0 flex items-center justify-between px-2 py-1">
						<div>
							<Skeleton width="120px" height="22px" />
							<Skeleton width="90px" height="16px" />
						</div>
						<Skeleton width="130px" height="25px" />
					</div>
				</SkeletonTheme>
			)
		}

		if (index === -1) {
			historyItem = packageInfo.status
		} else if (index < packageInfo.trackingHistory.length) {
			historyItem = packageInfo.trackingHistory[index]
		} else {
			return
		}

		return <HistoryLine historyItem={historyItem} />
	}

	useEffect(() => {
		if (pkg.name === "" && editNameValue === "") {
			setEditName(true)
		}
	}, [pkg.name, editNameValue])

	function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
		setEditNameValue(e.target.value)
	}

	function handleSaveName() {
		if (editNameValue === "" || editNameValue === pkg.name) {
			return
		}
		dispatchPackages({
			type: "updateName",
			id: pkg.id,
			name: editNameValue,
		})
		setEditName(false)
	}

	function handleEditName() {
		setEditName(true)
	}

	const [textRef, isTextOverflowed] = useTextOverflow<HTMLHeadingElement>([
		editName,
	])

	const menuFunctions = {
		openDetailedView: () => {
			if (packageInfo) {
				setSelectedPackage({ pkg, info: packageInfo })
			}
		},
		copyTrackingNumber: () => {
			console.log("menuFunctions > copyTrackingNumber")
			navigator.clipboard.writeText(pkg.trackingNumber)
		},
		edit: {
			name: () => {
				console.log("menuFunctions > edit > name")
				if (editName) {
					nameInputRef.current?.focus()
					return
				}
				setEditName(true)
			},
			trackingNumber: () => {
				console.log("menuFunctions > edit > trackingNumber")
				setOpenEditTrackingNumberModal(true)
			},
			courier: (courier: TCourier) => {
				console.log("menuFunctions > edit > courier")
				dispatchPackages({ type: "updateCourier", id: pkg.id, courier })
			},
		},
		reorder: () => {
			console.log("menuFunctions > reorder")
			setOpenReorderModal(true)
		},
		duplicate: () => {
			console.log("menuFunctions > duplicate")
			dispatchPackages({ type: "duplicate", id: pkg.id })
		},
		delete: () => {
			console.log("menuFunctions > delete")
			const pkgCopy = { ...pkg }
			dispatchPackages({ type: "delete", id: pkg.id })
			dispatchUndoStack({
				type: "push",
				new: pkgCopy,
			})
			triggerUndoNotification()
		},
	}

	if (!inSearchResults) return null

	return (
		<>
			<motion.div
				className={
					"card group border border-indigo-400/25 bg-gradient-to-b from-[#110F1B] to-transparent focus-within:bg-[#181527] hover:bg-[#181527] " +
					(isSelected ? "border-indigo-400/75" : "")
				}
				data-testid="card"
				id={`${pkg.id}`}
				onContextMenu={(e) => {
					if (isSelected) return
					e.preventDefault()
					setMenuOpen(true)
				}}
				layoutId={`card-${pkg.id}`}
				transition={{ duration: 0.3, ease: [0.075, 0.82, 0.165, 1] }}
				initial={false}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: 50 }}
				key={pkg.id}
			>
				{/* Card Header */}
				<div className="relative min-w-[220px] max-w-[350px] select-none border-b border-b-indigo-400/25">
					<div
						ref={journeyPercentRef}
						className="journeyPercent absolute bottom-0 block h-[1px] w-0 bg-indigo-400/40 opacity-50"
					/>
					<div className="relative flex items-center justify-between p-2">
						<div className="flex max-w-[80%] gap-2">
							{/* Image */}
							<CardImage
								error={error !== null}
								status={
									packageInfo
										? packageInfo.status.status
										: undefined
								}
							/>
							{/* Name */}
							<div className="relative flex max-w-[calc(100%-50px)] flex-col items-start">
								{editName ? (
									<input
										ref={nameInputRef}
										autoFocus
										placeholder="Type name..."
										value={editNameValue}
										onChange={handleNameChange}
										onBlur={handleSaveName}
										onKeyDown={(event) => {
											if (event.key === "Enter") {
												handleSaveName()
											}
										}}
										className="w-[20ch] max-w-full bg-transparent text-lg font-semibold tracking-tighter text-yellow-50 outline-none"
									/>
								) : (
									<Tooltip
										title={pkg.name}
										disabled={!isTextOverflowed}
									>
										<h3
											ref={textRef}
											onDoubleClick={handleEditName}
											className="flex w-[20ch] max-w-full cursor-pointer items-center overflow-hidden whitespace-nowrap text-left text-lg font-semibold tracking-tighter text-yellow-50"
											style={
												isTextOverflowed
													? {
															WebkitMaskImage:
																"linear-gradient(to right, black 90%, transparent)",
													  }
													: {}
											}
											data-overflow={
												isTextOverflowed
													? "true"
													: "false"
											}
										>
											{pkg.name}
										</h3>
									</Tooltip>
								)}
								<div className="flex items-center justify-start gap-2">
									<a
										className="underline-link flex items-center gap-1 text-xs text-indigo-300"
										href={
											getCourierUrlsFromTrackingNumber(
												pkg.trackingNumber
											)[0]
										}
										target="_blank"
									>
										{getCourierIconFromCode(pkg.courier)}
										<p>
											{getCourierStringFromCode(
												pkg.courier
											)}
										</p>
									</a>
									<Tooltip
										title={
											(packageInfo &&
												packageInfo.eta &&
												formatDate(packageInfo.eta) +
													(packageInfo.status
														.status === "DELIVERED"
														? " at "
														: " by ") +
													getTimeFromDate(
														packageInfo.eta
													)) ||
											""
										}
									>
										<p className="cursor-pointer text-left text-xs tracking-tighter text-yellow-50/50">
											{packageInfo
												? packageInfo.eta &&
												  (packageInfo.status.status ===
												  "DELIVERED"
														? "Arrived "
														: "Arrives ") +
														formatRelativeDate(
															packageInfo.eta
														)
												: null}
										</p>
									</Tooltip>
								</div>
							</div>
						</div>
						<Tooltip title="Open">
							<button
								onClick={menuFunctions.openDetailedView}
								className="aspect-square cursor-pointer rounded-full p-2 text-yellow-50 opacity-0 outline-none transition-opacity hover:bg-yellow-50/10 focus:bg-yellow-50/10 group-hover:opacity-100"
							>
								<BiExpand />
							</button>
						</Tooltip>
						<CardDropdownMenu
							pkg={pkg}
							menuFunctions={menuFunctions}
							open={menuOpen}
							setOpen={setMenuOpen}
						/>
					</div>
				</div>
				<div
					className="cursor-pointer bg-black hover:bg-[#111]"
					onClick={menuFunctions.openDetailedView}
				>
					{renderHistory(-1)}
				</div>
			</motion.div>
			<EditTrackingNumberModal
				open={openTrackingNumberModal}
				setOpen={setOpenEditTrackingNumberModal}
				pkg={pkg}
			/>
			<ReorderModal
				open={openReorderModal}
				setOpen={setOpenReorderModal}
			/>
		</>
	)
}

export default Card
