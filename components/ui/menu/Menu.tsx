import React from "react"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import "./menu.css"
import SubMenu from "./SubMenu"
import { BsCheckLg } from "react-icons/bs"
import { cn } from "@/lib/utils"

export type radioOption = {
	label: string
	value: string
}

export type TMenuItem = {
	label: string
	icon: React.ReactNode
	onClick?: () => void
	variant?: "danger" | "warning"
	children?: TMenuItem[]
	disabled?: boolean
	separator?: boolean
	radioGroup?: {
		enabled: boolean
		value: string
		onChange: (value: string) => void
		options: radioOption[]
	}
}

type Props = {
	menu: TMenuItem[]
	children: React.ReactNode
}

export function renderRadioOption(option: radioOption, index: number) {
	return (
		<DropdownMenu.RadioItem
			key={index}
			value={option.value}
			className="DropdownMenu-item"
		>
			<DropdownMenu.ItemIndicator className="absolute left-4">
				<BsCheckLg />
			</DropdownMenu.ItemIndicator>
			{option.label}
		</DropdownMenu.RadioItem>
	)
}

export function renderMenuItem(
	item: TMenuItem,
	index: number,
	menu: TMenuItem[]
) {
	if (item.children || item.radioGroup?.enabled) {
		return (
			<React.Fragment key={index}>
				<SubMenu key={index} menuItem={item} />
				{item.separator && menu.length > index + 1 && (
					<DropdownMenu.Separator className="m-1 h-[1px] bg-indigo-400/25" />
				)}
			</React.Fragment>
		)
	}
	return (
		<React.Fragment key={index}>
			<DropdownMenu.Item
				onSelect={item.onClick}
				className={cn(
					"DropdownMenu-item",
					item.variant === "danger"
						? "bg-red-500/25 text-red-500"
						: item.variant === "warning"
						? "bg-orange-400/25 text-orange-400"
						: ""
				)}
				disabled={item.disabled}
			>
				{item.icon}
				{item.label}
			</DropdownMenu.Item>
			{item.separator && menu.length > index + 1 && (
				<DropdownMenu.Separator className="m-1 h-[1px] bg-indigo-400/25" />
			)}
		</React.Fragment>
	)
}

const Menu = ({ menu, children }: Props) => {
	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild>{children}</DropdownMenu.Trigger>
			<DropdownMenu.Portal>
				<DropdownMenu.Content
					className="DropdownMenu-content"
					onCloseAutoFocus={(e) => e.preventDefault()}
				>
					{menu.map((item, index) => {
						return renderMenuItem(item, index, menu)
					})}
					<DropdownMenu.Arrow className="fill-indigo-400/75" />
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	)
}

export default Menu
