"use client"

import React, { useEffect, useState } from "react"
import {
	MdMoreVert,
	MdOutlineExplore,
	MdOutlineEditNote,
	MdClose,
} from "react-icons/md" // todo transition to radix-ui/react-icons
import { BsChevronRight, BsCheckLg, BsHouseCheck } from "react-icons/bs"
import {
	AiOutlineNumber,
	AiOutlineDelete,
	AiOutlineEdit,
	AiOutlineMail,
	AiOutlineLoading3Quarters,
} from "react-icons/ai"
import { BiCopy } from "react-icons/bi"
import { TbEditCircle } from "react-icons/tb"
import Image from "next/image"
import * as Dialog from "@radix-ui/react-dialog"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import "./menu.css"
import "./modal.css"
import useTextOverflow from "@/hooks/useTextOverflow"
import { PackageAction, TPackage } from "../Packages"
import {
	couriers,
	getCourierIconFromCode,
	getCourierStringFromCode,
} from "@/utils/courier"
import { PackageInfo, TCourier, TrackingHistory } from "@/app/api/package/route"
import Skeleton, { SkeletonTheme } from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import { getIconForStatus } from "@/utils/package"
import Tooltip from "../Base/Tooltip"

type Props = {
	pkg: TPackage
	dispatchPackages: React.Dispatch<PackageAction>
}

const Card = ({ pkg, dispatchPackages }: Props) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [packageInfo, setPackageInfo] = useState<PackageInfo | null>(null)
	const journeyPercentRef = React.useRef<HTMLDivElement>(null)
	const [editName, setEditName] = useState(false)
	const [openTrackingNumberModal, setOpenEditTrackingNumberModal] =
		useState(false)
	const nameInputRef = React.useRef<HTMLInputElement>(null)

	useEffect(() => {
		const fetchData = async () => {
			const res = await fetch(
				`/api/package?trackingNumber=${encodeURIComponent(
					pkg.trackingNumber
				)}&courier=${encodeURIComponent(pkg.courier)}`
			)
			const data = await res.json()
			console.log(data.packageInfo)
			setPackageInfo(data.packageInfo as PackageInfo)
			// random number between 0 and 100
		}

		fetchData()
	}, [pkg.trackingNumber, pkg.courier])

	useEffect(() => {
		if (journeyPercentRef.current && packageInfo) {
			journeyPercentRef.current.style.width = `${Math.random() * 100}%`
			journeyPercentRef.current.style.opacity = "1"
		}
	}, [packageInfo])

	function renderHistory(index: number) {
		let historyItem: TrackingHistory | null = null

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

		return (
			<div className="flex items-center justify-between px-2 py-1">
				<div>
					<h1 className="text-left text-lg font-semibold tracking-tighter text-yellow-50/75">
						{historyItem.location}
					</h1>
					<p className="text-left text-xs tracking-tighter text-yellow-50/25">
						{historyItem.date.time} - {historyItem.date.relative}
					</p>
				</div>
				<Tooltip text={historyItem.detailedStatus}>
					<div className="flex items-center gap-2 rounded-full bg-indigo-400/25 px-4 py-1 text-sm capitalize text-indigo-400">
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

	useEffect(() => {
		if (pkg.name === "") {
			setEditName(true)
		}
	}, [pkg.name])

	function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
		dispatchPackages({
			type: "updateName",
			id: pkg.id,
			name: e.target.value,
		})
	}

	function handleSaveName() {
		if (pkg.name === "") {
			return
		}
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
			navigator.clipboard.writeText("test")
		},
		openCourierWebsite: () => {
			console.log("menuFunctions > openCourierWebsite")
			window.open("https://www.shipmentracker.com/")
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

	return (
		<>
			<div className="border border-indigo-400/25 bg-[#110F1B]">
				<div className="relative min-w-[220px] max-w-[350px] select-none border-b border-b-indigo-400/25">
					<div
						ref={journeyPercentRef}
						className="journeyPercent absolute bottom-0 block h-[1px] w-0 bg-indigo-400/75 opacity-50"
					/>
					<div className="flex justify-between p-2">
						<div className="flex max-w-[80%] gap-2">
							<div className="flex aspect-square min-w-[50px] items-center justify-center rounded-full border border-indigo-400/50">
								<div className="absolute">
									{!packageInfo ? (
										<AiOutlineLoading3Quarters className="animate-spin" />
									) : null}
								</div>
								<Image
									src="/package.svg"
									alt="Package Box"
									width={27}
									height={27}
									priority
									className="pointer-events-none h-auto"
								/>
							</div>
							<div className="relative flex max-w-[calc(100%-50px)] flex-col items-start">
								{editName ? (
									<input
										ref={nameInputRef}
										autoFocus
										placeholder="Type name..."
										value={pkg.name}
										onChange={handleNameChange}
										onBlur={handleSaveName}
										onKeyDown={(event) => {
											if (event.key === "Enter") {
												handleSaveName()
											}
										}}
										className="max-w-full bg-transparent text-lg font-semibold tracking-tighter text-yellow-50 outline-none"
									/>
								) : (
									<Tooltip
										text={pkg.name}
										disabled={!isTextOverflowed}
									>
										<h3
											ref={textRef}
											onClick={handleEditName}
											className="w-[20ch] max-w-full overflow-hidden whitespace-nowrap text-left text-lg font-semibold tracking-tighter text-yellow-50"
											style={{
												WebkitMaskImage:
													"linear-gradient(to right, black 90%, transparent)",
											}}
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
								<a
									className="underline-link flex items-center gap-1 text-xs text-indigo-300"
									href="https://www.shipmentracker.com/"
									target="_blank"
								>
									{getCourierIconFromCode(pkg.courier)}
									<p>
										{getCourierStringFromCode(pkg.courier)}
									</p>
								</a>
							</div>
						</div>
						<DropdownMenu.Root>
							<DropdownMenu.Trigger asChild>
								<button
									aria-label="Package Controls"
									className="aspect-square cursor-pointer rounded-full p-2 text-yellow-50 outline-none hover:bg-yellow-50/10 focus:bg-yellow-50/10"
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
										onSelect={
											menuFunctions.copyTrackingNumber
										}
										className="DropdownMenu-item"
									>
										<AiOutlineNumber className="absolute left-4" />
										Copy Tracking Number
									</DropdownMenu.Item>
									<DropdownMenu.Item
										onSelect={
											menuFunctions.openCourierWebsite
										}
										className="DropdownMenu-item"
									>
										<MdOutlineExplore className="absolute left-4" />
										Open Courier Website
									</DropdownMenu.Item>
									<DropdownMenu.Separator className="m-1 h-[1px] bg-indigo-400/25" />
									<DropdownMenu.Sub>
										<DropdownMenu.SubTrigger className="DropdownMenu-item">
											<MdOutlineEditNote className="absolute left-4" />
											Edit
											<div className="float-right">
												<BsChevronRight />
											</div>
										</DropdownMenu.SubTrigger>
										<DropdownMenu.Item
											onSelect={
												menuFunctions.openCourierWebsite
											}
											className="DropdownMenu-item"
										>
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
													onSelect={
														menuFunctions.edit.name
													}
													className="DropdownMenu-item"
												>
													<AiOutlineEdit className="absolute left-4" />
													Name
												</DropdownMenu.Item>
												<DropdownMenu.Item
													onSelect={
														menuFunctions.edit
															.trackingNumber
													}
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
																value={
																	pkg.courier
																}
																onValueChange={(
																	value
																) =>
																	menuFunctions.edit.courier(
																		value as TCourier
																	)
																}
															>
																<DropdownMenu.Label className="p-2 text-xs text-orange-400">
																	Warning this
																	could cause
																	errors!
																</DropdownMenu.Label>
																{Object.keys(
																	couriers
																).map(
																	(
																		courier
																	) => (
																		<DropdownMenu.RadioItem
																			key={
																				courier
																			}
																			className="DropdownMenu-item"
																			value={
																				courier
																			}
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
					</div>
				</div>
				{renderHistory(-1)}
			</div>
			<Dialog.Root
				open={openTrackingNumberModal}
				onOpenChange={setOpenEditTrackingNumberModal}
				modal={true}
			>
				<Dialog.Portal>
					<Dialog.Overlay className="Modal-overlay absolute left-0 top-0 h-full w-full" />
					<Dialog.Content className="Modal-content absolute left-[50%] top-[50%] min-h-[200px] translate-x-[-50%] translate-y-[-50%] p-6">
						<div className="mb-4 flex items-center justify-between">
							<h1 className="text-lg font-bold">
								Edit Tracking Number
							</h1>
							<button
								onClick={() =>
									setOpenEditTrackingNumberModal(false)
								}
								className="text-yellow-50/50 hover:text-yellow-50/90 active:text-yellow-50"
								aria-label="close modal"
							>
								<MdClose fontSize="large" />
							</button>
						</div>
						<form className="text-yellow-50">
							<input
								className="w-full rounded-md border border-yellow-50/25 bg-transparent p-2 outline-none focus-within:outline-2 focus-within:outline-indigo-400"
								id="tracking-number-input"
								placeholder="Type tracking number..."
								autoFocus={true}
								type="text"
								value={pkg.trackingNumber}
								onChange={(e) => {
									dispatchPackages({
										type: "updateTrackingNumber",
										id: pkg.id,
										trackingNumber: e.target.value,
									})
								}}
							/>
						</form>
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog.Root>
		</>
	)
}

export default Card
