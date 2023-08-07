"use client"

import React from "react"
import { BiChevronDown } from "react-icons/bi"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import {
	BsArrowDownShort,
	BsArrowUpShort,
	BsCheckLg,
	BsArrowDownUp,
} from "react-icons/bs"
import { PiSwapLight } from "react-icons/pi"
import { cn } from "@/lib/utils"

type Props = {
	sortOption: string
	setSortOption: (value: string) => void
}

const Filters = ({ sortOption, setSortOption }: Props) => {
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
		// {
		// 	label: "Latest Update",
		// 	value: "latestUpdate",
		// 	icon: <AiOutlineClockCircle className="absolute left-4" />,
		// },
	]

	return (
		<div className="ml-3 flex w-full items-center justify-between gap-3 border-l border-indigo-400/25 pl-3">
			<DropdownMenu.Root
				open={sortedMenuOpen}
				onOpenChange={setSortedMenuOpen}
				modal={true}
			>
				<DropdownMenu.Trigger asChild>
					<button className="flex items-center justify-between gap-3 rounded-sm border border-indigo-400/25 bg-[#110F1B] px-4  capitalize text-indigo-200/80">
						<BsArrowDownUp />
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
			<button className="rounded-full border border-indigo-400/25 bg-[#110F1B]  px-4 text-indigo-200/80">
				Courier: UPS
			</button>
			<button className="rounded-full border border-indigo-400/25 bg-[#110F1B]  px-4 text-indigo-200/80">
				Status: Delivered
			</button>
		</div>
	)
}

export default Filters
