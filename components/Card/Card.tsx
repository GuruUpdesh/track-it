"use client"

import React, { useEffect, useState } from "react"
import { MdMoreVert, MdOutlineExplore, MdOutlineEditNote } from "react-icons/md" // todo transition to radix-ui/react-icons
import { BsChevronRight, BsCheckLg, BsHouseCheck } from "react-icons/bs"
import {
	AiOutlineNumber,
	AiOutlineDelete,
	AiOutlineEdit,
	AiOutlineMail,
} from "react-icons/ai"
import { BiCopy } from "react-icons/bi"
import { TbEditCircle } from "react-icons/tb"
import Image from "next/image"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import * as Tooltip from "@radix-ui/react-tooltip"
import "./menu.css"
import useTextOverflow from "@/hooks/useTextOverflow"
import { PackageAction, TPackage } from "../Grid"
import {
	couriers,
	getCourierIconFromCode,
	getCourierStringFromCode,
} from "@/utils/courier"
import { TCourier } from "@/app/api/package/route"

type Props = {
	pkg: TPackage
	dispatchPackages: React.Dispatch<PackageAction>
}

const Card = ({ pkg, dispatchPackages }: Props) => {
	const [editName, setEditName] = useState(false)
	const nameInputRef = React.useRef<HTMLInputElement>(null)

	useEffect(() => {
		if (pkg.name === "") {
			setEditName(true)
		}
	}, [name])

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
			// todo test this works
			navigator.clipboard.writeText("test")
		},
		openCourierWebsite: () => {
			console.log("menuFunctions > openCourierWebsite")
			// todo test this works
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
		<div className="min-w-[220px] max-w-[350px] select-none border border-indigo-400/25 border-b-indigo-400/25 bg-[#110F1B] after:block after:h-[1px] after:w-[29%] after:bg-indigo-400/75">
			<div className="flex justify-between p-2">
				<div className="flex max-w-[80%] gap-2">
					<div className="flex aspect-square min-w-[50px] items-center justify-center rounded-full border border-indigo-400/50">
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
							<Tooltip.Provider>
								<Tooltip.Root defaultOpen={false}>
									<Tooltip.Trigger asChild>
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
									</Tooltip.Trigger>
									<Tooltip.Portal>
										{isTextOverflowed ? (
											<Tooltip.Content
												className="Tooltip-content"
												side="bottom"
												data-testid="tooltip-content"
											>
												{pkg.name}
											</Tooltip.Content>
										) : null}
									</Tooltip.Portal>
								</Tooltip.Root>
							</Tooltip.Provider>
						)}
						<a
							className="underline-link flex items-center gap-1 text-xs text-indigo-300"
							href="https://www.shipmentracker.com/"
							target="_blank"
						>
							{getCourierIconFromCode(pkg.courier)}
							<p>{getCourierStringFromCode(pkg.courier)}</p>
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
							className="DropdownMenu-content"
							onCloseAutoFocus={(e) => e.preventDefault()}
						>
							<DropdownMenu.Item
								onSelect={menuFunctions.copyTrackingNumber}
								className="DropdownMenu-item"
							>
								<AiOutlineNumber className="absolute left-4" />
								Copy Tracking Number
							</DropdownMenu.Item>
							<DropdownMenu.Item
								onSelect={menuFunctions.openCourierWebsite}
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
									onSelect={menuFunctions.openCourierWebsite}
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
											onSelect={menuFunctions.edit.name}
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
														value={pkg.courier}
														onValueChange={(
															value
														) =>
															menuFunctions.edit.courier(
																value as TCourier
															)
														}
													>
														<DropdownMenu.Label className="p-2 text-xs text-orange-400">
															Warning this could
															cause errors!
														</DropdownMenu.Label>
														{Object.keys(
															couriers
														).map((courier) => (
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
														))}
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
	)
}

export default Card
