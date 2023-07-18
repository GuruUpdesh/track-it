"use client"

import {
	PackageInfo,
	TCourier,
	TrackingHistory,
} from "@/app/api/package/typesAndSchemas"
import useTextOverflow from "@/hooks/useTextOverflow"
import {
	couriers,
	getCourierIconFromCode,
	getCourierStringFromCode,
	getCourierUrlsFromTrackingNumber,
} from "@/utils/courier"
import {
	estimateProgress,
	formatDate,
	formatRelativeDate,
	getIconForStatus,
	getTimeFromDate,
} from "@/utils/package"
import * as Dialog from "@radix-ui/react-dialog"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import axios from "axios"
import Image from "next/image"
import React, { useEffect, useState } from "react"
import {
	AiOutlineDelete,
	AiOutlineEdit,
	AiOutlineLoading3Quarters,
	AiOutlineMail,
	AiOutlineNumber,
	AiOutlineWarning,
} from "react-icons/ai"
import { BiCopy, BiExpand } from "react-icons/bi"
// todo transition to radix-ui/react-icons
import { BsCheckLg, BsChevronRight, BsHouseCheck } from "react-icons/bs"
import {
	MdClose,
	MdMoreVert,
	MdOutlineEditNote,
	MdOutlineExplore,
} from "react-icons/md"
import { TbEditCircle } from "react-icons/tb"
import Skeleton, { SkeletonTheme } from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

import Tooltip from "../Base/Tooltip"
import { PackageAction, TPackage, TPackageWithInfo } from "../Packages"
import "./styles/menu.css"
import "./styles/modal.css"

type CardDowndownProps = {
	pkg: TPackage
	menuFunctions: {
		copyTrackingNumber: () => void
		edit: {
			name: () => void
			trackingNumber: () => void
			courier: (courier: TCourier) => void
		}
		duplicate: () => void
		delete: () => void
	}
}

export const CardDropdownMenu = ({ pkg, menuFunctions }: CardDowndownProps) => {
	const [open, setOpen] = useState(false)
	return (
		<DropdownMenu.Root onOpenChange={setOpen}>
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
						<DropdownMenu.Item className="DropdownMenu-item">
							<BsHouseCheck className="absolute left-4" />
							Mark as Delivered
						</DropdownMenu.Item>
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
					<DropdownMenu.Separator className="m-1 h-[1px] bg-indigo-400/25" />
					<DropdownMenu.Item
						onSelect={menuFunctions.duplicate}
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
	dispatchPackages: React.Dispatch<PackageAction>
}

export const EditTrackingNumberModal = ({
	open,
	setOpen,
	pkg,
	dispatchPackages,
}: EditTrackingNumberModalProps) => {
	const [trackingNumber, setTrackingNumber] = useState(pkg.trackingNumber)
	return (
		<Dialog.Root open={open} onOpenChange={setOpen} modal={true}>
			<Dialog.Portal>
				<Dialog.Overlay className="Modal-overlay absolute left-0 top-0 h-full w-full z-40" />
				<Dialog.Content className="Modal-content absolute left-[50%] top-[50%] min-h-[200px] translate-x-[-50%] translate-y-[-50%] p-6 z-50">
					<div className="mb-4 flex items-center justify-between">
						<h1 className="text-lg font-bold">
							Edit Tracking Number
						</h1>
						<button
							onClick={() => setOpen(false)}
							className="text-yellow-50/50 hover:text-yellow-50/90 active:text-yellow-50"
							aria-label="close modal"
						>
							<MdClose fontSize="large" />
						</button>
					</div>
					<form
						className="text-yellow-50"
						onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
							e.preventDefault()
							dispatchPackages({
								type: "updateTrackingNumber",
								id: pkg.id,
								trackingNumber: trackingNumber,
							})
							setOpen(false)
						}}
					>
						<input
							className="w-full rounded-md border border-yellow-50/25 bg-transparent p-2 outline-none outline-offset-2 focus-within:outline-2 focus-within:outline-indigo-400"
							id="tracking-number-input"
							placeholder="Type tracking number..."
							autoFocus={true}
							type="text"
							value={trackingNumber}
							onChange={(e) => {
								setTrackingNumber(e.target.value)
							}}
						/>
						<div className="flex items-center justify-between mt-6">
							<button
								className="py-2 px-4 bg-white/10 rounded-md"
								onClick={() => {
									setOpen(false)
								}}
							>
								Cancel
							</button>
							<button
								type="submit"
								className={
									"py-2 px-4 rounded-md" +
									(trackingNumber === pkg.trackingNumber
										? " bg-white/10"
										: " bg-green-400/50")
								}
								disabled={trackingNumber === pkg.trackingNumber}
							>
								Save changes
							</button>
						</div>
					</form>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	)
}

type HistoryLineProps = {
	historyItem: TrackingHistory | null
}

export const HistoryLine = ({ historyItem }: HistoryLineProps) => {
	if (!historyItem) return null
	return (
		<div className="flex items-center justify-between px-2 py-1">
			<div>
				<h1 className="text-left text-lg font-light tracking-tighter text-yellow-50/75">
					{historyItem.location}
				</h1>
				<Tooltip text={formatRelativeDate(historyItem.date)}>
					<p className="text-left text-xs tracking-tighter text-yellow-50/25 hover:text-yellow-50/50">
						{formatDate(historyItem.date)} at
						{" " + getTimeFromDate(historyItem.date)}
					</p>
				</Tooltip>
			</div>
			<Tooltip text={historyItem.detailedStatus}>
				<div className="flex items-center gap-2 rounded-full bg-indigo-400/25 px-4 py-1 text-sm capitalize text-indigo-400 hover:text-indigo-900 hover:bg-indigo-400">
					{historyItem.status.toLocaleLowerCase()}
					{getIconForStatus(
						historyItem.status,
						historyItem.deliveryLocation
					)}
				</div>
			</Tooltip>
		</div>
	)
}

type Props = {
	pkg: TPackage
	dispatchPackages: React.Dispatch<PackageAction>
	inSearchResults: boolean
	setSelectedPackage: (pkg: TPackageWithInfo) => void
}

const Card = ({
	pkg,
	dispatchPackages,
	inSearchResults,
	setSelectedPackage,
}: Props) => {
	const [packageInfo, setPackageInfo] = useState<PackageInfo | null>(null)
	const [editName, setEditName] = useState(false)
	const [editNameValue, setEditNameValue] = useState(pkg.name)
	const [openTrackingNumberModal, setOpenEditTrackingNumberModal] =
		useState(false)

	const [error, setError] = useState<null | string>(null)
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
							packageInfo.trackingHistory[0].date,
							packageInfo.status.date
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
				<div className="flex items-center justify-center px-2 py-1 flex-col">
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
		if (pkg.name === "") {
			setEditName(true)
		}
	}, [pkg.name])

	function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
		setEditNameValue(e.target.value)
	}

	function handleSaveName() {
		if (pkg.name === "") {
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
		duplicate: () => {
			console.log("menuFunctions > duplicate")
			dispatchPackages({ type: "duplicate", id: pkg.id })
		},
		delete: () => {
			console.log("menuFunctions > delete")
			dispatchPackages({ type: "delete", id: pkg.id })
		},
	}

	if (!inSearchResults) return null

	return (
		<>
			<div
				className="group border border-indigo-400/25 bg-[#110F1B]"
				data-testid="card"
				// layoutId={`card-${pkg.id}`}
			>
				{/* Card Header */}
				<div className="relative min-w-[220px] max-w-[350px] select-none border-b border-b-indigo-400/25">
					<div
						ref={journeyPercentRef}
						className="journeyPercent absolute bottom-0 block h-[1px] w-0 bg-indigo-400/75 opacity-50"
					/>
					<div className="flex items-center justify-between p-2 relative">
						<div className="flex max-w-[80%] gap-2">
							{/* Image */}
							<div className="relative flex aspect-square min-w-[50px] items-center justify-center rounded-full border border-indigo-400/25">
								<div
									className={
										"absolute z-20 flex h-full w-full items-center justify-center rounded-full" +
										(!packageInfo &&
											" bg-black/25 backdrop-blur-[2px]")
									}
								>
									{error ? (
										<AiOutlineWarning />
									) : !packageInfo ? (
										<AiOutlineLoading3Quarters className="animate-spin" />
									) : null}
								</div>
								<Image
									src="/package.svg"
									alt="Package Box"
									width={27}
									height={27}
									priority
									className="pointer-events-none z-10 h-auto"
								/>
							</div>
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
										text={pkg.name}
										disabled={!isTextOverflowed}
									>
										<h3
											ref={textRef}
											onClick={handleEditName}
											className="flex items-center w-[20ch] max-w-full overflow-hidden whitespace-nowrap text-left text-lg font-semibold tracking-tighter text-yellow-50"
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
										text={
											(packageInfo &&
												packageInfo.eta &&
												formatDate(packageInfo.eta) +
													" by " +
													getTimeFromDate(
														packageInfo.eta
													)) ||
											""
										}
									>
										<p className="text-left text-xs tracking-tighter text-yellow-50/50 hover:text-yellow-50/75">
											{packageInfo
												? packageInfo.eta &&
												  "Arrives " +
														formatRelativeDate(
															packageInfo.eta
														)
												: null}
										</p>
									</Tooltip>
								</div>
							</div>
						</div>
						<Tooltip text="Open">
							<button
								onClick={() => {
									if (packageInfo) {
										setSelectedPackage({
											pkg,
											info: packageInfo,
										})
									}
								}}
								className="aspect-square cursor-pointer rounded-full p-2 text-yellow-50 outline-none hover:bg-yellow-50/10 focus:bg-yellow-50/10 opacity-0 group-hover:opacity-100 transition-opacity"
							>
								<BiExpand />
							</button>
						</Tooltip>
						<CardDropdownMenu
							pkg={pkg}
							menuFunctions={menuFunctions}
						/>
					</div>
				</div>
				{renderHistory(-1)}
			</div>
			<EditTrackingNumberModal
				open={openTrackingNumberModal}
				setOpen={setOpenEditTrackingNumberModal}
				pkg={pkg}
				dispatchPackages={dispatchPackages}
			/>
		</>
	)
}

export default Card
