"use client"

import { TPackage, TPackageWithInfo } from "../../DashboardGrid"
import Tooltip from "../../ui/Tooltip"
import "./styles/card.css"
import "./styles/modal.css"
import {
	PackageInfo,
	TCourier,
	TrackingHistory,
} from "@/app/api/package/typesAndSchemas"
import { PackageAction } from "@/context/packageContext/packageReducer"
import {
	undo,
	useUndoStackContext,
} from "@/context/undoStackContext/useUndoStackContext"
import useTextOverflow from "@/hooks/useTextOverflow"
import { couriers, getCourier } from "@/utils/courier"
import { formatDate, formatRelativeDate, getTimeFromDate } from "@/utils/date"
import { estimateProgress, getColorFromStatus } from "@/utils/package"
import axios from "axios"
import { AnimatePresence, motion } from "framer-motion"
import React, { useEffect, useState, useMemo } from "react"
import {
	AiOutlineDelete,
	AiOutlineEdit,
	AiOutlineMail,
	AiOutlineNumber,
	AiOutlineOrderedList,
} from "react-icons/ai"
import { BiCopy, BiExpand } from "react-icons/bi"
import { BsDot, BsArrowLeft } from "react-icons/bs"
import { MdMoreVert, MdOutlineEditNote, MdOutlineExplore } from "react-icons/md"
import { PiSwapLight } from "react-icons/pi"
import { TbEditCircle } from "react-icons/tb"
import Skeleton, { SkeletonTheme } from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import CardImage from "./CardImage"
import Modal from "../../ui/modal/Modal"
import EditTrackingNumber from "../../ui/forms/EditTrackingNumber"
import IconButton from "@/components/ui/IconButton"
import Menu, { TMenuItem } from "@/components/ui/menu/Menu"
import { cn } from "@/lib/utils"
import ReorderCards from "@/components/ui/forms/ReorderCards"
import { toast } from "react-hot-toast"
import { simplifyDetailMessage } from "@/utils/dataTransform"

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
			<EditTrackingNumber pkg={pkg} />
		</Modal>
	)
}

type ReorderModalProps = {
	open: boolean
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const ReorderModal = ({ open, setOpen }: ReorderModalProps) => {
	return (
		<Modal open={open} setOpen={setOpen}>
			<ReorderCards />
		</Modal>
	)
}

type Props = {
	pkg: TPackage
	index: number
	packagesLength: number
	dispatchPackages: React.Dispatch<PackageAction>
	setSelectedPackage: (pkg: TPackageWithInfo) => void
	inSearchResults: boolean
	isSelected: boolean
}

const Card = ({
	pkg,
	index,
	packagesLength,
	dispatchPackages,
	setSelectedPackage,
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

	const courier = useMemo(() => {
		return getCourier(pkg.courier)
	}, [pkg.courier])

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

	const [detailsHistoryTextRef, isDetailsHistoryTextOverflowed] =
		useTextOverflow<HTMLHeadingElement>([packageInfo])

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
					baseColor="#11101c"
					highlightColor="#1e1b4b"
					borderRadius="2rem"
				>
					<div className="z-0 flex w-full items-center justify-between">
						<div>
							<Skeleton width="120px" height="20px" />
							<Skeleton width="200px" height="20px" />
						</div>
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

		return (
			<div className="line-height-shrink w-full text-indigo-100">
				<Tooltip
					disabled={!isDetailsHistoryTextOverflowed}
					title={historyItem.detailedStatus}
				>
					<h5
						ref={detailsHistoryTextRef}
						className="w-fit max-w-full overflow-hidden whitespace-nowrap"
						style={
							isDetailsHistoryTextOverflowed
								? {
										WebkitMaskImage:
											"linear-gradient(to right, black 90%, transparent)",
								  }
								: {}
						}
					>
						{simplifyDetailMessage(
							historyItem.detailedStatus,
							historyItem.status
						)}
					</h5>
				</Tooltip>
				<div className="flex items-center text-sm text-indigo-100/60">
					{historyItem.location === "Location not found" ? null : (
						<>
							<p className="whitespace-nowrap">
								{historyItem.location}
							</p>
							<BsDot />
						</>
					)}
					<p className="whitespace-nowrap">
						{formatDate(historyItem.date) +
							" " +
							getTimeFromDate(historyItem.date)}
					</p>
				</div>
			</div>
		)
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
		if (editNameValue === "") {
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
			navigator.clipboard.writeText(pkg.trackingNumber)
			toast.success("Copied to clipboard")
		},
		edit: {
			name: () => {
				if (editName) {
					nameInputRef.current?.focus()
					return
				}
				setEditName(true)
			},
			trackingNumber: () => {
				setOpenEditTrackingNumberModal(true)
			},
			courier: (courier: TCourier) => {
				dispatchPackages({ type: "updateCourier", id: pkg.id, courier })
				toast.success("Courier updated")
			},
		},
		reorder: () => {
			setOpenReorderModal(true)
		},
		duplicate: () => {
			dispatchPackages({ type: "duplicate", id: pkg.id })
		},
		delete: () => {
			const pkgCopy = { ...pkg, index: index }
			dispatchPackages({ type: "delete", id: pkg.id })
			dispatchUndoStack({
				type: "push",
				new: pkgCopy,
			})
			toast.success((t) => (
				<div className="flex items-center">
					<p className="line-clamp-1 h-min max-w-[20ch] overflow-hidden">
						Deleted {pkgCopy.name}
					</p>
					<button
						className="ml-3 rounded-md bg-white/10 px-2 py-1 hover:bg-white/20"
						onClick={() => {
							undo(dispatchUndoStack, dispatchPackages)
							toast.dismiss(t.id)
						}}
					>
						Undo
					</button>
				</div>
			))
		},
	}

	const menu: TMenuItem[] = [
		{
			label: "Open Detailed View",
			onClick: menuFunctions.openDetailedView,
			icon: <BiExpand className="absolute left-4" />,
			separator: true,
			disabled: error !== null || !packageInfo,
		},
		{
			label: "Copy Tracking Number",
			onClick: menuFunctions.copyTrackingNumber,
			icon: <AiOutlineNumber className="absolute left-4" />,
			disabled: pkg.trackingNumber === "",
		},
		{
			label: "Open Courier Website",
			onClick: () => {
				window.open(courier.tracking_url + pkg.trackingNumber)
			},
			icon: <MdOutlineExplore className="absolute left-4" />,
			separator: true,
		},
		{
			label: "Edit",
			icon: <MdOutlineEditNote className="absolute left-4" />,
			children: [
				{
					label: "Name",
					onClick: menuFunctions.edit.name,
					icon: <AiOutlineEdit className="absolute left-4" />,
				},
				{
					label: "Tracking Number",
					onClick: menuFunctions.edit.trackingNumber,
					icon: <TbEditCircle className="absolute left-4" />,
				},
				{
					label: "Override Courier",
					icon: <AiOutlineMail className="absolute left-4" />,
					radioGroup: {
						enabled: true,
						value: pkg.courier,
						onChange: (value: string) => {
							menuFunctions.edit.courier(value as TCourier)
						},
						options: couriers.map((courier) => ({
							label: courier.name,
							value: courier.code,
						})),
					},
					variant: "warning",
				},
			],
			separator: true,
		},
		{
			label: "Reorder All",
			onClick: menuFunctions.reorder,
			icon: <AiOutlineOrderedList className="absolute left-4" />,
		},
		{
			label: "Move",
			icon: <PiSwapLight className="absolute left-4" />,
			children: [
				{
					label: "Left",
					onClick: () => {
						dispatchPackages({
							type: "move",
							direction: "left",
							index: index,
						})
					},
					icon: <BsArrowLeft className="absolute left-4" />,
					disabled: index === 0,
				},
				{
					label: "Right",
					onClick: () => {
						dispatchPackages({
							type: "move",
							direction: "right",
							index: index,
						})
					},
					icon: (
						<BsArrowLeft className="absolute left-4 rotate-180 transform" />
					),
					disabled: index === packagesLength - 1,
				},
			],
			separator: true,
		},
		{
			label: "Duplicate",
			onClick: menuFunctions.duplicate,
			icon: <BiCopy className="absolute left-4" />,
		},
		{
			label: "Delete",
			onClick: menuFunctions.delete,
			icon: <AiOutlineDelete className="absolute left-4" />,
			variant: "danger",
		},
	]

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
					<AnimatePresence>
						{isSelected && (
							<Tooltip
								title="Right click for options"
								disabled={!isSelected}
							>
								<motion.p
									className="absolute left-[50%] rounded-full bg-indigo-700 px-4 py-1 text-sm text-indigo-100"
									initial={{
										opacity: 0,
										scale: 0,
										x: "-50%",
										y: "-50%",
									}}
									animate={{
										opacity: 1,
										scale: 1,
										x: "-50%",
										y: "-50%",
									}}
									exit={{
										opacity: 0,
										scale: 0,
										x: "-50%",
										y: "-50%",
									}}
								>
									Selected
								</motion.p>
							</Tooltip>
						)}
					</AnimatePresence>
					<div
						ref={journeyPercentRef}
						className={cn(
							"journeyPercent absolute bottom-0 block h-[1px] w-0 bg-indigo-400/75 opacity-50",
							`group-hover:bg-${getColorFromStatus(
								packageInfo?.status.status || "UNKNOWN"
							)}-600`
						)}
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
								deliveryLocation={
									packageInfo
										? packageInfo.status.deliveryLocation
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
											onClick={handleEditName}
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
										className="underline-link flex items-center gap-1 text-xs text-yellow-50"
										href={
											courier.tracking_url +
											pkg.trackingNumber
										}
										target="_blank"
									>
										{courier.icon}
										<p>{courier.name}</p>
									</a>
									{packageInfo &&
									packageInfo.status.status !== "DELIVERED" &&
									packageInfo.eta ? (
										<Tooltip
											title={
												packageInfo &&
												packageInfo.eta &&
												formatDate(packageInfo.eta) +
													" by " +
													getTimeFromDate(
														packageInfo.eta
													)
											}
										>
											<p className="cursor-pointer text-left text-xs tracking-tighter text-yellow-50/50">
												{"Arrives " +
													formatRelativeDate(
														packageInfo.eta
													)}
											</p>
										</Tooltip>
									) : null}
								</div>
							</div>
						</div>
						<IconButton
							onClick={menuFunctions.openDetailedView}
							disabled={error !== null || !packageInfo}
							altText="Open Detailed Package Information"
							className="opacity-0 transition-opacity group-hover:opacity-100"
						>
							<BiExpand />
						</IconButton>
						<Menu menu={menu} open={menuOpen} setOpen={setMenuOpen}>
							<button
								aria-label="Package Controls"
								className={
									"aspect-square cursor-pointer rounded-full p-2 text-yellow-50 outline-none hover:bg-yellow-50/10 focus:bg-yellow-50/10" +
									(menuOpen ? " bg-yellow-50/10" : "")
								}
							>
								<MdMoreVert />
							</button>
						</Menu>
					</div>
				</div>
				<div
					className={cn(
						"relative flex h-[56px] min-w-[220px]  max-w-[350px] items-center justify-center bg-black p-2",
						error === null && packageInfo ? "cursor-pointer" : ""
					)}
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
