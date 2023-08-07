"use client"

import React from "react"
import { BiChevronDown, BiFilterAlt } from "react-icons/bi"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import {
	BsArrowDownShort,
	BsArrowUpShort,
	BsCheckLg,
	BsArrowDownUp,
} from "react-icons/bs"
import { PiSwapLight } from "react-icons/pi"
import { cn } from "@/lib/utils"
import { couriers } from "@/utils/courier"
import { TFilters } from "../DashboardGrid"
import { getIconForStatus } from "@/utils/package"

type Props = {
	sortOption: string
	setSortOption: (value: string) => void
	filters: TFilters
	setFilters: (value: TFilters) => void
}

const Filters = ({ sortOption, setSortOption, filters, setFilters }: Props) => {
	const [sortedMenuOpen, setSortedMenuOpen] = React.useState(false)

	const sortOptions = [
		{
			label: "Manual",
			value: "manual",
			icon: <PiSwapLight className="absolute left-4" />,
		},
		{
			label: "Newest",
			value: "newest",
			icon: <BsArrowDownShort className="absolute left-4" />,
		},
		{
			label: "Oldest",
			value: "oldest",
			icon: <BsArrowUpShort className="absolute left-4" />,
		},
	]

	const [couriersMenuOpen, setCouriersMenuOpen] = React.useState(false)

	function setCouriers(couriers: string[]) {
		setFilters({
			...filters,
			couriers,
		})
	}

	const statusOptions = [
		{
			name: "Pre Transit",
			code: "PRE_TRANSIT",
			icon: (
				<React.Fragment>
					{getIconForStatus("PRE_TRANSIT")}
				</React.Fragment>
			),
		},
		{
			name: "Transit",
			code: "TRANSIT",
			icon: (
				<React.Fragment>{getIconForStatus("TRANSIT")}</React.Fragment>
			),
		},
		{
			name: "Delivered",
			code: "DELIVERED",
			icon: (
				<React.Fragment>{getIconForStatus("DELIVERED")}</React.Fragment>
			),
		},
		{
			name: "Returned",
			code: "RETURNED",
			icon: (
				<React.Fragment>{getIconForStatus("RETURNED")}</React.Fragment>
			),
		},
		{
			name: "Failure",
			code: "FAILURE",
			icon: (
				<React.Fragment>{getIconForStatus("FAILURE")}</React.Fragment>
			),
		},
		{
			name: "Unknown",
			code: "UNKNOWN",
			icon: (
				<React.Fragment>{getIconForStatus("UNKNOWN")}</React.Fragment>
			),
		},
	]

	const [statusMenuOpen, setStatusMenuOpen] = React.useState(false)

	function setStatus(status: string[]) {
		setFilters({
			...filters,
			status,
		})
	}

	return (
		<div className="ml-3 flex w-full items-center justify-between gap-3 border-l border-indigo-400/25 pl-3">
			<DropdownMenu.Root
				defaultOpen={false}
				open={sortedMenuOpen}
				onOpenChange={setSortedMenuOpen}
				modal={true}
			>
				<DropdownMenu.Trigger asChild>
					<button className="flex items-center justify-between gap-1 rounded-sm border border-indigo-400/25 bg-[#110F1B] px-4 capitalize  text-indigo-200/80 transition-all hover:border-indigo-400/50 hover:bg-[#1c182c]">
						<BsArrowDownUp className="mr-1 text-sm" />
						Sort:{" "}
						{
							sortOptions.filter(
								(option) => option.value === sortOption
							)[0].label
						}
						<BiChevronDown
							className={cn("transition-transform", {
								"rotate-180": sortedMenuOpen,
							})}
						/>
					</button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Portal>
					<DropdownMenu.Content
						className="DropdownMenu-content"
						onCloseAutoFocus={(e) => e.preventDefault()}
					>
						<DropdownMenu.RadioGroup
							value={sortOption}
							onValueChange={(value) => {
								setSortOption(value)
							}}
						>
							{sortOptions.map((option, index) => {
								return (
									<DropdownMenu.RadioItem
										key={index}
										value={option.value}
										className="DropdownMenu-item"
									>
										{option.value === sortOption ? (
											<DropdownMenu.ItemIndicator className="absolute left-4">
												<BsCheckLg />
											</DropdownMenu.ItemIndicator>
										) : (
											option.icon
										)}
										{option.label}
									</DropdownMenu.RadioItem>
								)
							})}
						</DropdownMenu.RadioGroup>
						<DropdownMenu.Arrow className="fill-indigo-400/75" />
					</DropdownMenu.Content>
				</DropdownMenu.Portal>
			</DropdownMenu.Root>
			<div className="grow"></div>
			<p className="flex items-center gap-1 text-indigo-50/50">
				<BiFilterAlt /> Filters:
			</p>
			<DropdownMenu.Root
				defaultOpen={false}
				open={couriersMenuOpen}
				onOpenChange={setCouriersMenuOpen}
				modal={true}
			>
				<DropdownMenu.Trigger className="group/container">
					<button className="group relative flex gap-1 rounded-full border border-indigo-400/25 bg-[#110F1B] px-4 pr-4 text-indigo-200/80 transition-all hover:border-indigo-400/50 hover:bg-[#1c182c] hover:pr-6 group-data-[state=open]/container:border-indigo-400/50 group-data-[state=open]/container:bg-[#1c182c] group-data-[state=open]/container:pr-6">
						Courier
						<p className="inline-block max-w-[10ch] overflow-hidden whitespace-nowrap">
							{filters.couriers.length > 0 &&
								": " +
									filters.couriers
										.map((courier) => {
											return couriers.filter(
												(c) => c.code === courier
											)[0].name
										})
										.join(", ")}
						</p>
						<BiChevronDown
							className={cn(
								"absolute right-2 top-0 h-full opacity-0 transition-all group-hover:opacity-100 group-data-[state=open]/container:opacity-100",
								{
									"rotate-180": couriersMenuOpen,
								}
							)}
						/>
					</button>
				</DropdownMenu.Trigger>

				<DropdownMenu.Content
					className="DropdownMenu-content"
					onCloseAutoFocus={(e) => e.preventDefault()}
				>
					{couriers.map((courier) => {
						const selected = filters.couriers.includes(courier.code)
						if (courier.code === "shippo") return null
						return (
							<DropdownMenu.Item
								key={courier.code}
								onSelect={(e) => {
									e.preventDefault()
									if (selected) {
										setCouriers(
											filters.couriers.filter(
												(selectedCourier) =>
													selectedCourier !==
													courier.code
											)
										)
									} else {
										setCouriers([
											...filters.couriers,
											courier.code,
										])
									}
								}}
								className="DropdownMenu-item"
								data-state={selected ? "checked" : "unchecked"}
							>
								{selected ? (
									<BsCheckLg className="absolute left-4" />
								) : (
									<div className="absolute left-4">
										{courier.icon}
									</div>
								)}
								{courier.name}
							</DropdownMenu.Item>
						)
					})}
					<DropdownMenu.Arrow className="fill-indigo-400/75" />
				</DropdownMenu.Content>
			</DropdownMenu.Root>
			<DropdownMenu.Root
				defaultOpen={false}
				open={statusMenuOpen}
				onOpenChange={setStatusMenuOpen}
				modal={true}
			>
				<DropdownMenu.Trigger className="group/container">
					<button className="group relative flex gap-1 rounded-full border border-indigo-400/25 bg-[#110F1B] px-4 pr-4 text-indigo-200/80 transition-all hover:border-indigo-400/50 hover:bg-[#1c182c] hover:pr-6 group-data-[state=open]/container:border-indigo-400/50 group-data-[state=open]/container:bg-[#1c182c] group-data-[state=open]/container:pr-6">
						Status
						<p className="inline-block max-w-[10ch] overflow-hidden whitespace-nowrap">
							{filters.status.length > 0 &&
								": " +
									filters.status
										.map((status) => {
											return statusOptions.filter(
												(s) => s.code === status
											)[0].name
										})
										.join(", ")}
						</p>
						<BiChevronDown
							className={cn(
								"absolute right-2 top-0 h-full opacity-0 transition-all group-hover:opacity-100 group-data-[state=open]/container:opacity-100",
								{
									"rotate-180": couriersMenuOpen,
								}
							)}
						/>
					</button>
				</DropdownMenu.Trigger>

				<DropdownMenu.Content
					className="DropdownMenu-content"
					onCloseAutoFocus={(e) => e.preventDefault()}
				>
					{statusOptions.map((status) => {
						const selected = filters.status.includes(status.code)
						return (
							<DropdownMenu.Item
								key={status.code}
								onSelect={(e) => {
									e.preventDefault()
									if (selected) {
										setStatus(
											filters.status.filter(
												(selectedStatus) =>
													selectedStatus !==
													status.code
											)
										)
									} else {
										setStatus([
											...filters.status,
											status.code,
										])
									}
								}}
								className="DropdownMenu-item"
								data-state={selected ? "checked" : "unchecked"}
							>
								{selected ? (
									<BsCheckLg className="absolute left-4" />
								) : (
									<div className="absolute left-4">
										{status.icon}
									</div>
								)}
								{status.name}
							</DropdownMenu.Item>
						)
					})}
					<DropdownMenu.Arrow className="fill-indigo-400/75" />
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	)
}

export default Filters
